import { isNotFoundError } from '@faststore/api'
import {
  formatSearchState,
  parseSearchState,
  SearchProvider,
} from '@faststore/sdk'
import { gql } from '@faststore/graphql-utils'
import { BreadcrumbJsonLd, NextSeo } from 'next-seo'
import { useRouter } from 'next/router'
import { useMemo } from 'react'
import type { SearchState } from '@faststore/sdk'
import type { GetStaticPaths, GetStaticProps } from 'next'
import type { ContentData } from '@vtex/client-cms'

import Breadcrumb from 'src/components/sections/Breadcrumb'
import ProductGallery from 'src/components/sections/ProductGallery'
import ScrollToTopButton from 'src/components/sections/ScrollToTopButton'
import { ITEMS_PER_PAGE } from 'src/constants'
import { useApplySearchState } from 'src/sdk/search/state'
import { mark } from 'src/sdk/tests/mark'
import { execute } from 'src/server'
import type {
  ServerCollectionPageQueryQuery,
  ServerCollectionPageQueryQueryVariables,
} from '@generated/graphql'
import type { PageContentType } from 'src/server/cms'
import { getPage } from 'src/server/cms'
import SectionTitle from 'src/components/custom-components/home/SectionTitle'

import storeConfig from '../../store.config'

type Props = ServerCollectionPageQueryQuery

type CmsCategoryImageProps = {
  cmsCategoryImage: ContentData
}

const useSearchParams = ({ collection }: Props): SearchState => {
  const selectedFacets = collection?.meta.selectedFacets
  const { asPath } = useRouter()

  const hrefState = useMemo(() => {
    const newState = parseSearchState(new URL(asPath, 'http://localhost'))

    // In case we are in an incomplete url
    if (newState.selectedFacets.length === 0) {
      newState.selectedFacets = selectedFacets
    }

    return formatSearchState(newState).href
  }, [asPath, selectedFacets])

  return useMemo(() => parseSearchState(new URL(hrefState)), [hrefState])
}

function Page(props: Props & CmsCategoryImageProps) {
  const { collection, cmsCategoryImage } = props
  const router = useRouter()
  const applySearchState = useApplySearchState()
  const searchParams = useSearchParams(props)

  const { page } = searchParams
  const title = collection?.seo.title ?? storeConfig.seo.title
  const description = collection?.seo.description || storeConfig.seo.title
  const pageQuery = page !== 0 ? `?page=${page}` : ''
  const [pathname] = router.asPath.split('?')
  const canonical = `${storeConfig.storeUrl}${pathname}${pageQuery}`

  return (
    <SearchProvider
      onChange={applySearchState}
      itemsPerPage={ITEMS_PER_PAGE}
      {...searchParams}
    >
      {/* SEO */}
      <NextSeo
        title={title}
        description={description}
        titleTemplate={storeConfig.seo.titleTemplate}
        canonical={canonical}
        openGraph={{
          type: 'website',
          title,
          description,
        }}
      />
      <BreadcrumbJsonLd
        itemListElements={collection?.breadcrumbList.itemListElement ?? []}
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
      <Breadcrumb
        breadcrumbList={collection?.breadcrumbList.itemListElement}
        name={title}
      />

      <SectionTitle
        title={title}
        description={collection?.seo.description}
        className="category-page"
      />

      <ProductGallery
        categoryImage={cmsCategoryImage}
        title={title}
        slug={pathname}
      />

      <ScrollToTopButton />
    </SearchProvider>
  )
}

const query = gql`
  query ServerCollectionPageQuery($slug: String!) {
    collection(slug: $slug) {
      seo {
        title
        description
      }
      breadcrumbList {
        itemListElement {
          item
          name
          position
        }
      }
      meta {
        selectedFacets {
          key
          value
        }
      }
    }
  }
`

export const getStaticProps: GetStaticProps<
  ServerCollectionPageQueryQuery,
  { slug: string[] }
> = async ({ params }) => {
  const { data, errors = [] } = await execute<
    ServerCollectionPageQueryQueryVariables,
    ServerCollectionPageQueryQuery
  >({
    variables: { slug: params?.slug.join('/') ?? '' },
    operationName: query,
  })

  const notFound = errors.find(isNotFoundError)
  const sections = await getPage<PageContentType>({
    contentType: 'categoryImage',
  })

  const cmsCategoryImage = sections

  if (notFound) {
    return {
      notFound: true,
    }
  }

  if (errors.length > 0) {
    throw errors[0]
  }

  const finalData = { ...data, cmsCategoryImage }

  return {
    props: finalData,
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
