import ProductShelfSkeleton from 'src/components/skeletons/ProductShelfSkeleton'
import { useProductsQuery } from 'src/sdk/product/useProductsQuery'
import type { ProductsQueryQueryVariables } from '@generated/graphql'
import CarouselShelf from 'src/components/custom-components/home/CarouselShelf'

import ProductCard from '../../product/ProductCard'
import Section from '../Section'
import styles from './product-shelf.module.scss'

interface ProductShelfProps extends Partial<ProductsQueryQueryVariables> {
  title?: string | JSX.Element
  withDivisor?: boolean
  noMargins?: boolean
  shelfType?: string
  isSimpleCard?: boolean
  itens?: number
  otherBackground?: boolean
  productClusterIds?: string
  size?: string
}

function ProductShelf({
  title,
  withDivisor = false,
  noMargins = false,
  isSimpleCard,
  shelfType = 'isCarousel',
  itens,
  otherBackground,
  productClusterIds,
  size = 'small',
  ...variables
}: ProductShelfProps) {
  if (productClusterIds) {
    variables.selectedFacets = {
      key: 'productClusterIds',
      value: productClusterIds,
    }
  }

  const products = useProductsQuery(variables)

  if (products?.edges.length === 0) {
    return null
  }

  return (
    <Section
      className={`layout__section ${withDivisor ? 'section__divisor' : ''} ${
        noMargins ? 'section__no-margins' : ''
      } ${otherBackground ? 'section__other-background' : ''}`}
      style={{ marginTop: 0 }}
    >
      <div
        data-fs-product-shelf
        className={`${styles.fsProductShelf} ${
          shelfType === 'isRowLayout' ? 'shelf--row' : ''
        }`}
      >
        <ProductShelfSkeleton loading={products === undefined}>
          <div
            data-fs-product-shelf-items
            className={`layout__content ${
              shelfType === 'isRowLayout' ? 'shelf--row' : ''
            }`}
          >
            {shelfType === 'isCarousel' ? (
              <CarouselShelf itemsPerPage={itens} arrows size={size}>
                {products?.edges.map((product, idx) => (
                  <div key={`${product.node.id}`}>
                    <ProductCard
                      product={product.node}
                      index={idx + 1}
                      isSimpleCard={isSimpleCard}
                    />
                  </div>
                ))}
              </CarouselShelf>
            ) : (
              <>
                {products?.edges.map((product, idx) => (
                  <li key={`${product.node.id}`}>
                    <ProductCard
                      product={product.node}
                      index={idx + 1}
                      rowLayout={shelfType === 'isRowLayout'}
                      isSimpleCard={isSimpleCard}
                    />
                  </li>
                ))}
              </>
            )}
          </div>
        </ProductShelfSkeleton>
      </div>
    </Section>
  )
}

export default ProductShelf
