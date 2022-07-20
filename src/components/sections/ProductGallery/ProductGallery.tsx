import { useSearch } from '@faststore/sdk'
import { GatsbySeo } from 'gatsby-plugin-next-seo'
import { lazy, Suspense, useState } from 'react'
import type { MouseEvent } from 'react'
import Filter from 'src/components/search/Filter'
import Sort from 'src/components/search/Sort'
import FilterSkeleton from 'src/components/skeletons/FilterSkeleton'
import ProductGridSkeleton from 'src/components/skeletons/ProductGridSkeleton'
import SkeletonElement from 'src/components/skeletons/SkeletonElement'
import Button, { ButtonLink } from 'src/components/ui/Button'
import Icon from 'src/components/ui/Icon'
import { mark } from 'src/sdk/tests/mark'
import { useUI } from 'src/sdk/ui/Provider'
import { GalleryIcon, ListIcon } from 'src/images/categoryType/categoryType'

import Section from '../Section'
import EmptyGallery from './EmptyGallery'
import { useDelayedFacets } from './useDelayedFacets'
import { useDelayedPagination } from './useDelayedPagination'
import { useGalleryQuery } from './useGalleryQuery'
import { useProductsPrefetch } from './usePageProducts'
import styles from './product-gallery.module.scss'

const GalleryPage = lazy(() => import('./ProductGalleryPage'))
const GalleryPageSkeleton = <ProductGridSkeleton loading />

interface Props {
  title: string
  searchTerm?: string
}

function ProductGallery({ title, searchTerm }: Props) {
  const { openFilter } = useUI()
  const { pages, addNextPage, addPrevPage } = useSearch()

  const { data } = useGalleryQuery()
  const facets = useDelayedFacets(data)
  const totalCount = data?.search.products.pageInfo.totalCount ?? 0
  const { next, prev } = useDelayedPagination(totalCount)
  const [isGallery, setIsGallery] = useState(true)

  useProductsPrefetch(prev ? prev.cursor : null)
  useProductsPrefetch(next ? next.cursor : null)

  if (data && totalCount === 0) {
    return (
      <Section
        data-testid="product-gallery"
        className={`${styles.fsProductListing} layout__content`}
        data-fs-product-listing
      >
        <EmptyGallery />
      </Section>
    )
  }

  return (
    <Section
      data-testid="product-gallery"
      className={`${styles.fsProductListing} layout__content-full`}
      data-fs-product-listing
    >
      {searchTerm && (
        <header data-fs-product-listing-search-term className="layout__content">
          <h1>
            Resultados para: <span>{searchTerm}</span>
          </h1>
        </header>
      )}
      <div data-fs-product-listing-content-grid className="layout__content">
        <div data-fs-product-listing-filters>
          <FilterSkeleton loading={facets?.length === 0}>
            <Filter facets={facets} />
          </FilterSkeleton>
        </div>

        <div data-fs-product-listing-results-count data-count={totalCount}>
          <SkeletonElement shimmer type="text" loading={!data}>
            <h2 data-testid="total-product-count">
              {totalCount} {totalCount > 1 ? 'produtos' : 'produto'}
            </h2>
          </SkeletonElement>
        </div>

        <div data-fs-product-listing-sort>
          <SkeletonElement shimmer type="text" loading={facets?.length === 0}>
            <Sort />
          </SkeletonElement>

          <SkeletonElement shimmer type="button" loading={facets?.length === 0}>
            <Button
              variant="tertiary"
              data-testid="open-filter-button"
              icon={<Icon name="FadersHorizontal" width={16} height={16} />}
              iconPosition="left"
              aria-label="Open Filters"
              onClick={openFilter}
            >
              Filtros
            </Button>
          </SkeletonElement>
        </div>

        <div data-fs-product-listing-type>
          <Button
            variant="secondary"
            icon={<GalleryIcon />}
            iconPosition="left"
            data-testid="type-gallery"
            aria-label={`gallery${isGallery ? ' active' : ''}`}
            onClick={() => setIsGallery(true)}
          >
            Galeria
          </Button>
          <Button
            variant="secondary"
            icon={<ListIcon />}
            iconPosition="left"
            data-testid="type-list"
            aria-label={`list${isGallery ? '' : ' active'}`}
            onClick={() => setIsGallery(false)}
          >
            Lista
          </Button>
        </div>

        <div data-fs-product-listing-results>
          {/* Add link to previous page. This helps on SEO */}
          {prev !== false && (
            <div data-fs-product-listing-pagination="top">
              <GatsbySeo defer linkTags={[{ rel: 'prev', href: prev.link }]} />
              <ButtonLink
                onClick={(e: MouseEvent<HTMLElement>) => {
                  e.currentTarget.blur()
                  e.preventDefault()
                  addPrevPage()
                }}
                href={prev.link}
                rel="prev"
                variant="secondary"
                iconPosition="left"
                icon={
                  <Icon name="ArrowLeft" width={16} height={16} weight="bold" />
                }
              >
                Página anterior
              </ButtonLink>
            </div>
          )}

          {/* Render ALL products */}
          {data ? (
            <Suspense fallback={GalleryPageSkeleton}>
              {pages.map((page) => (
                <GalleryPage
                  key={`gallery-page-${page}`}
                  showSponsoredProducts={false}
                  page={page}
                  title={title}
                  isGallery={isGallery}
                />
              ))}
            </Suspense>
          ) : (
            GalleryPageSkeleton
          )}

          {/* Add link to next page. This helps on SEO */}
          {next !== false && (
            <div data-fs-product-listing-pagination="bottom">
              <GatsbySeo defer linkTags={[{ rel: 'next', href: next.link }]} />
              <ButtonLink
                data-testid="show-more"
                onClick={(e: MouseEvent<HTMLElement>) => {
                  e.currentTarget.blur()
                  e.preventDefault()
                  addNextPage()
                }}
                href={next.link}
                rel="next"
                variant="secondary"
              >
                Carregar mais produtos
              </ButtonLink>
            </div>
          )}
        </div>
      </div>
    </Section>
  )
}

ProductGallery.displayName = 'ProductGallery'
export default mark(ProductGallery)
