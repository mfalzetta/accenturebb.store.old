import type { Dispatch, SetStateAction } from 'react'
import { useEffect, useState } from 'react'
import Link from 'src/components/ui/Link'

import MenuMobile from './mobile/MenuMobile'
import useCategoryQuery from './useCategoryQuery'

interface MenuProps {
  isOpen: boolean
  stateChanger: Dispatch<SetStateAction<boolean>>
}

interface CategoryProps {
  name: string
  item: string
  position: number
}

interface ItemProp {
  depart: CategoryProps
  category: SubProp[]
}

interface SubProp {
  subCategory: CategoryProps[]
  category: CategoryProps
}

export const removeDuplicate = (obj: CategoryProps[]) => {
  const uniqueIds: string[] = []
  const unique = obj.filter((element: CategoryProps) => {
    const isDuplicate = uniqueIds.includes(element.item)

    if (!isDuplicate) {
      uniqueIds.push(element.item)

      return true
    }

    return false
  })

  return unique
}

function handleResize() {
  if (window.innerWidth < 920) {
    return true
  }

  return false
}

export const MenuGetCategory = ({ stateChanger, isOpen }: MenuProps) => {
  const [isMobile, setIsMobile] = useState(false)
  const [active, setActive] = useState(0)

  useEffect(() => {
    setIsMobile(handleResize())
    setActive(handleResize() ? 0 : 1)
    window.addEventListener(
      'resize',
      () => {
        setIsMobile(handleResize())
        setActive(handleResize() ? 0 : 1)
      },
      true
    )
  }, [setActive])

  const { data } = useCategoryQuery(100)

  if (!data) {
    return <></>
  }

  const {
    allCollections: { edges },
  } = data

  const departNode = edges.filter((el) => el.node.type === 'Department').flat()
  const categoryNode = edges.filter((el) => el.node.type === 'Category').flat()
  const departament = departNode
    .map((el) => el.node.breadcrumbList.itemListElement)
    .flat()

  const categoryList = categoryNode
    .map((el) => el.node.breadcrumbList.itemListElement)
    .flat()

  const category2 = categoryList.flat().filter((el) => el.position === 2)
  const categorySub = categoryList.flat().filter((el) => el.position === 3)
  const items: ItemProp[] = []

  departament.forEach((dep) => {
    const cat = category2.filter((el) =>
      dep.item.includes(el.item.split('/')[1])
    )

    const cate: SubProp[] = []

    removeDuplicate(cat).forEach((c) => {
      const sub = categorySub.filter(
        (el) =>
          el.item.includes(c.item) && dep.item.includes(el.item.split('/')[1])
      )

      const subc = { subCategory: sub, category: c }

      cate.push(subc)
    })
    const categ = { depart: dep, category: cate }

    items.push(categ)
  })

  const depart = items.map((el) => el.depart)

  if (!isMobile) {
    return (
      <div className="container-menu">
        <nav className="categories-field">
          <ul data-menu-category>
            {depart.map(({ name: nameCat }: CategoryProps, idx: number) => (
              <li
                key={`category--${idx}`}
                className={active === idx + 1 ? 'category-active' : ''}
              >
                <button onClick={() => setActive(idx + 1)}>
                  <span>{nameCat}</span>
                </button>
              </li>
            ))}
          </ul>
        </nav>
        <div className="subcategories-field">
          <ul data-menu-sub-category>
            {items.map(
              (
                {
                  depart: { name: nameCat, item: linkCat },
                  category,
                }: ItemProp,
                id: number
              ) => (
                <div
                  key={nameCat}
                  className={active === id + 1 ? 'active ' : 'not-active'}
                >
                  <li key={`category--${id}`}>
                    <h2>
                      <Link
                        href={`${linkCat}`}
                        onClick={() => stateChanger(false)}
                      >
                        {nameCat}
                      </Link>
                    </h2>
                    <nav>
                      {category &&
                        category.map(
                          (
                            {
                              category: { name: nameSubI, item: linkSubI },
                              subCategory,
                            }: SubProp,
                            index: number
                          ) => (
                            <div key={`subCategory--${index}`}>
                              <h3>
                                <Link href={`${linkSubI}`}>{nameSubI}</Link>
                              </h3>
                              {subCategory &&
                                subCategory.map(
                                  (
                                    {
                                      name: nameSubII,
                                      item: linkSubII,
                                    }: CategoryProps,
                                    i: number
                                  ) => (
                                    <Link
                                      key={`subSubCategory--${i}`}
                                      href={`${linkSubII}`}
                                    >
                                      {nameSubII}
                                    </Link>
                                  )
                                )}
                            </div>
                          )
                        )}
                    </nav>
                  </li>
                </div>
              )
            )}
          </ul>
        </div>
      </div>
    )
  }

  return (
    <MenuMobile stateChanger={stateChanger} isOpen={isOpen} items={items} />
  )
}
