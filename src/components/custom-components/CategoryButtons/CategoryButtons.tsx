import { Link } from '@reach/router'
import { removeDuplicate } from 'src/components/menu/MenuGetCategory'
import useCategoryQuery from 'src/components/menu/useCategoryQuery'

import CategoryImages from './CategoryImage'
import './CategoryButtons.scss'

export interface CategoryButtonsProps {
  slug: string
  className?: string
}

export interface IconsProps {
  name: string
  item: string
  position: number
}

const CategoryButtons = ({ slug, className }: CategoryButtonsProps) => {
  let getIcons: IconsProps[] | undefined = []
  const categories = useCategoryQuery(100)
  const items = categories.data?.allCollections.edges.map(
    (el) => el.node.breadcrumbList.itemListElement
  )

  const icons = items
    ?.flat()
    .filter((ele) => ele.item.startsWith(`/${slug}`) && ele.item !== `/${slug}`)

  const isDep = slug.split('/').length < 2

  if (isDep) {
    getIcons = icons?.filter((elem) => elem.position === 2)
  } else {
    getIcons = icons?.filter((elem) => elem.position === 3)
  }

  if (getIcons) {
    getIcons = removeDuplicate(getIcons)
  }

  return (
    <div className="categoryButtons section">
      <div className={`layout__content ${className ?? ''} categoryButtons`}>
        <div
          data-fs-category-buttons-content
          className="classSection__title category-page"
        >
          {isDep ? (
            <CategoryImages slug={slug} items={getIcons} />
          ) : (
            <>
              {getIcons?.map(({ name, item }: IconsProps, index) => {
                return (
                  <div key={index} data-fs-category-buttons-link>
                    <Link to={item} className="link__buttons">
                      <span data-fs-category-buttons-link-name>{name}</span>
                    </Link>
                  </div>
                )
              })}
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default CategoryButtons
