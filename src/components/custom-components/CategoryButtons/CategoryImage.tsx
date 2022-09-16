import { gql } from '@faststore/graphql-utils'
import { useEffect, useState } from 'react'

import Link from 'src/components/ui/Link'
import { useQuery } from 'src/sdk/graphql/useQuery'
// import type { CmsCategoryImage } from '@generated/graphql'
import Icon from 'src/components/ui/Icon'

import type { IconsProps } from './CategoryButtons'
import Slider from '../home/Slider'

export interface CategoryImagesProps {
  slug: string
  items?: ItemsProps[]
}

export interface ItemsProps {
  name: string
  item: string
  position: number
}

export interface CategoryImageProps {
  src: string
  category: string
  alt: string
}
export interface AllImageProps extends CategoryImageProps, ItemsProps {}

export const query = gql`
  query CategoryImageQuery {
    cmsCategoryImage {
      sections {
        data
        name
      }
    }
  }
`

function formatCategoryName(name: string) {
  return name
    .toLocaleLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
}

function EmptyCartegory({ items }: CategoryImagesProps) {
  return (
    <>
      {items?.map(({ name, item }: IconsProps, index) => {
        return (
          <div key={index} data-fs-category-buttons-link>
            <Link href={item} className="link__buttons">
              <span data-fs-category-buttons-link-name>{name}</span>
            </Link>
          </div>
        )
      })}
    </>
  )
}

function CategoryImages({ slug, items }: CategoryImagesProps) {
  const { data } = useQuery<any, any>(query, null)

  const [cms, setCms] = useState<any>()

  useEffect(() => {
    if (data && items) {
      if (cms !== data) {
        setCms(data)
      }
    }
  }, [items, cms, data])

  if (cms && items) {
    const section = cms?.sections.filter(
      (el) =>
        formatCategoryName(el.data.department) === formatCategoryName(slug)
    )

    if (section.length > 0) {
      const allitems = section
        .map((ele) => ele.data)
        .flat()
        .map((el) => el.allItems)
        .flat()

      const allImage: AllImageProps[] = []

      items.forEach((el) => {
        const cat: CategoryImageProps[] = []

        allitems.forEach((elem) => {
          if (
            formatCategoryName(elem.category) === formatCategoryName(el.name)
          ) {
            cat.push(elem)
          }
        })
        const cmsItem = cat[0]

        allImage.push({ ...cmsItem, ...el })
      })

      return (
        <Slider minWidth={96} arrows itemsPerPage={8}>
          {allImage.map(({ src, name, item, alt }, index) => {
            return (
              <div key={index}>
                <Link
                  href={item}
                  className="link__buttons"
                  data-fs-category-image
                >
                  {src ? (
                    <div data-fs-category-image-image>
                      <img
                        data-fs-category-image-image-content
                        src={src}
                        alt={alt ?? ''}
                      />
                    </div>
                  ) : (
                    <Icon
                      className="empty__category"
                      name="empty__category"
                      height={96}
                      width={96}
                    />
                  )}
                  <span data-fs-category-image-name>{name}</span>
                </Link>
              </div>
            )
          })}
        </Slider>
      )
    }

    return <EmptyCartegory slug={slug} items={items} />
  }

  return <EmptyCartegory slug={slug} items={items} />
}

export default CategoryImages
