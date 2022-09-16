import { isNotFoundError } from '@faststore/api'
import { gql } from '@faststore/graphql-utils'
import { BreadcrumbJsonLd, NextSeo, ProductJsonLd } from 'next-seo'
import type { GetStaticPaths, GetStaticProps } from 'next'
import type { ContentData } from '@vtex/client-cms'

import ProductDetails from 'src/components/sections/ProductDetails'
import { useSession } from 'src/sdk/session'
import { mark } from 'src/sdk/tests/mark'
import { execute } from 'src/server'
import type {
  ServerProductPageQueryQuery,
  ServerProductPageQueryQueryVariables,
} from '@generated/graphql'
import { getCMSPageDataByContentType } from 'src/cms/client'
import RenderPageSections from 'src/components/cms/RenderPageSections'

import storeConfig from '../../../store.config'

type Props = {
  data: ServerProductPageQueryQuery
  cmsPdp: ContentData
}

function Page({ data, cmsPdp }: Props) {
  const { currency } = useSession()

  // No data was found
  if (data === undefined) {
    return null
  }

  const { product } = data

  const { seo } = product
  const title = seo.title || storeConfig.seo.title
  const description = seo.description || storeConfig.seo.description
  const canonical = `${storeConfig.storeUrl}${seo.canonical}`

  return (
    <>
      {/* SEO */}
      <NextSeo
        title={title}
        description={description}
        canonical={canonical}
        openGraph={{
          type: 'og:product',
          url: canonical,
          title,
          description,
          images: product.image.map((img) => ({
            url: img.url,
            alt: img.alternateName,
          })),
        }}
        additionalMetaTags={[
          {
            property: 'product:price:amount',
            content: product.offers.lowPrice?.toString() ?? undefined,
          },
          {
            property: 'product:price:currency',
            content: currency.code,
          },
        ]}
      />
      <BreadcrumbJsonLd
        itemListElements={product.breadcrumbList.itemListElement}
      />
      <ProductJsonLd
        productName={product.name}
        description={product.description}
        brand={product.brand.name}
        sku={product.sku}
        gtin={product.gtin}
        releaseDate={product.releaseDate}
        images={product.image.map((img) => img.url)} // Somehow, Google does not understand this valid Schema.org schema, so we need to do conversions
        offersType="AggregateOffer"
        offers={{
          ...product.offers,
          ...product.offers.offers[0],
          url: canonical,
        }}
      />

      {/*
        WARNING: Do not import or render components from any
        other folder than '../components/sections' in here.

        This is necessary to keep the integration with the CMS
        easy and consistent, enabling the change and reorder
        of elements on this page.

        If needed, wrap your component in a <Section /> component
        (not the HTML tag) before rendering it here.
      */}

      <ProductDetails product={product} />

      <div className="cms-pdp">
        <RenderPageSections sections={cmsPdp?.sections} />
      </div>
    </>
  )
}

const query = gql`
  query ServerProductPageQuery($slug: String!) {
    product(locator: [{ key: "slug", value: $slug }]) {
      id: productID

      seo {
        title
        description
        canonical
      }

      brand {
        name
      }

      sku
      gtin
      name
      description
      releaseDate

      breadcrumbList {
        itemListElement {
          item
          name
          position
        }
      }

      image {
        url
        alternateName
      }

      offers {
        lowPrice
        highPrice
        priceCurrency
        offers {
          availability
          price
          priceValidUntil
          priceCurrency
          itemCondition
          seller {
            identifier
          }
        }
      }

      isVariantOf {
        productGroupID
      }

      ...ProductDetailsFragment_product
    }
  }
`
// TODO TYPE THIS

export const getStaticProps: GetStaticProps<any, { slug: string }> = async ({
  params,
}) => {
  const { data, errors = [] } = await execute<
    ServerProductPageQueryQueryVariables,
    ServerProductPageQueryQuery
  >({
    variables: { slug: params?.slug ?? '' },
    operationName: query,
  })

  const notFound = errors.find(isNotFoundError)
  const cmsPdp = await getCMSPageDataByContentType('pdp')

  if (notFound) {
    return {
      notFound: true,
    }
  }

  if (errors.length > 0) {
    throw errors[0]
  }
  // const { product } = data

  const dataFinal = { data, cmsPdp }

  return {
    props: dataFinal,
  }
}

export const getStaticPaths: GetStaticPaths = async () => {
  return {
    paths: [],
    fallback: 'blocking',
  }
}

Page.displayName = 'Page'

export default mark(Page)
