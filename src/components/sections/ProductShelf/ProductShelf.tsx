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
  isRowLayout?: boolean
  noMargins?: boolean
  otherBackground?: boolean
  isCarousel?: boolean
}

function ProductShelf({
  title,
  withDivisor = false,
  isRowLayout = false,
  noMargins = false,
  otherBackground = false,
  isCarousel,
  ...variables
}: ProductShelfProps) {
  const products = useProductsQuery(variables)

  if (products?.edges.length === 0) {
    return null
  }

  if (isCarousel) {
    return (
      <Section
        className={`layout__section ${withDivisor ? 'section__divisor' : ''} ${
          noMargins ? 'section__no-margins' : ''
        } ${otherBackground ? 'section__other-background' : ''}`}
      >
        {title && (
          <SectionTitle
            className="classSection__container"
            title={title.toString()}
          />
        )}
        <ProductShelfSkeleton loading={products === undefined}>
          <ul
            className="shelf--carousel layout__content"
            data-fs-product-shelf-items
          >
            <Carousel itemsPerPage={6} arrows>
              {products?.edges.map((product, idx) => (
                <li key={`${product.node.id}`}>
                  <ProductCard
                    product={product.node}
                    index={idx + 1}
                    rowLayout={isRowLayout}
                  />
                </li>
              ))}
            </Carousel>
          </ul>
        </ProductShelfSkeleton>
        <div data-fs-product-shelf />
      </Section>
    )
  }

  return (
    <Section
      className={`layout__section ${withDivisor ? 'section__divisor' : ''} ${
        noMargins ? 'section__no-margins' : ''
      } ${otherBackground ? 'section__other-background' : ''}`}
    >
      {title && (
        <SectionTitle
          className="classSection__container"
          title={title.toString()}
        />
      )}
      <div
        data-fs-product-shelf
        className={`${isRowLayout ? 'shelf--row' : ''}`}
      >
        <ProductShelfSkeleton loading={products === undefined}>
          <ul
            data-fs-product-shelf-items
            className={`layout__content ${isRowLayout ? 'shelf--row' : ''}`}
          >
            {products?.edges.map((product, idx) => (
              <li key={`${product.node.id}`}>
                <ProductCard
                  product={product.node}
                  index={idx + 1}
                  rowLayout={isRowLayout}
                />
              </li>
            ))}
          </ul>
        </ProductShelfSkeleton>
      </div>
    </Section>
  )
}

export default ProductShelf
