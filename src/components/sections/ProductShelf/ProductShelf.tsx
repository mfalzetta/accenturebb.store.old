import ProductShelfSkeleton from 'src/components/skeletons/ProductShelfSkeleton'
import { useProductsQuery } from 'src/sdk/product/useProductsQuery'
import type { ProductsQueryQueryVariables } from '@generated/graphql'

import ProductCard from '../../product/ProductCard'
import Section from '../Section'
import Carousel from '../../custom-components/home/CarouselShelf'

interface ProductShelfProps extends Partial<ProductsQueryQueryVariables> {
  title?: string | JSX.Element
  withDivisor?: boolean
  noMargins?: boolean
  shelfType?: string
  isSimpleCard?: boolean
  itens?: number
  otherBackground?: boolean
  productClusterIds?: string
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
    >
      <div
        data-fs-product-shelf
        className={`${shelfType === 'isRowLayout' ? 'shelf--row' : ''}`}
      >
        <ProductShelfSkeleton loading={products === undefined}>
          <ul
            data-fs-product-shelf-items
            className={`layout__content ${
              shelfType === 'isRowLayout' ? 'shelf--row' : ''
            }`}
          >
            {shelfType === 'isCarousel' ? (
              <Carousel itemsPerPage={itens} arrows>
                {products?.edges.map((product, idx) => (
                  <li key={`${product.node.id}`}>
                    <ProductCard
                      product={product.node}
                      index={idx + 1}
                      isSimpleCard={isSimpleCard}
                    />
                  </li>
                ))}
              </Carousel>
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
          </ul>
        </ProductShelfSkeleton>
      </div>
    </Section>
  )
}

export default ProductShelf
