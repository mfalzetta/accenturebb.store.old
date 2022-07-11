import ProductShelfSkeleton from 'src/components/skeletons/ProductShelfSkeleton'
import { useProductsQuery } from 'src/sdk/product/useProductsQuery'
import type { ProductsQueryQueryVariables } from '@generated/graphql'
import SectionTitle from 'src/components/custom-components/home/SectionTitle'

import ProductCard from '../../product/ProductCard'
import Section from '../Section'
import Carousel from '../../custom-components/home/CarouselShelf'

interface ProductShelfProps extends Partial<ProductsQueryQueryVariables> {
  title?: string | JSX.Element
  withDivisor?: boolean
  noMargins?: boolean
  otherBackground?: boolean
  shelfType: string
  shelfLink?: {
    name: string
    link: string
  }
  isSimpleCard?: boolean
  itens: number
}

function ProductShelf({
  title,
  withDivisor = false,
  noMargins = false,
  otherBackground = false,
  shelfLink = {
    name: '',
    link: '',
  },
  isSimpleCard,
  shelfType,
  itens,
  ...variables
}: ProductShelfProps) {
  const products = useProductsQuery(variables)

  if (products?.edges.length === 0) {
    return null
  }

  return (
    <Section
      className={`layout__section ${withDivisor ? 'section__divisor' : ''} ${
        noMargins ? 'section__no-margins' : ''
      } ${shelfType === 'isRowLayout' ? 'section__other-background' : ''}`}
    >
      {title && (
        <SectionTitle
          className="classSection__container"
          title={title.toString()}
          linkText={shelfLink.name}
          href={shelfLink.link}
        />
      )}
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
