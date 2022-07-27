import { useEffect, useState } from 'react'

import MenuMobile from './mobile/MenuMobile'
import useCategoryQuery from './useCategoryQuery'

interface MenuProps {
  isOpen: boolean
}

interface CategoryProps {
  name: string
  item: string
  position: number
}

const removeDuplicate = (obj: CategoryProps[]) => {
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

export const MenuGetCategory = ({ isOpen }: MenuProps) => {
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

  const categoryNode = edges.filter((e) => e.node.type === 'Category')
  const departmentNode = edges.filter((ed) => ed.node.type === 'Department')
  const department = removeDuplicate(
    departmentNode.map((ele) => ele.node.breadcrumbList.itemListElement).flat()
  )

  const category = removeDuplicate(
    categoryNode
      .map((elem) =>
        elem.node.breadcrumbList.itemListElement.filter((p) => p.position === 2)
      )
      .flat()
  )

  const subCategory = removeDuplicate(
    categoryNode
      .map((c) =>
        c.node.breadcrumbList.itemListElement.filter(
          (subC) => subC.position === 3
        )
      )
      .flat()
  )

  const children: CategoryProps[][] = []

  department.forEach((dep: CategoryProps) => {
    children.push(
      category.filter((el: CategoryProps) => el.item.includes(dep.item))
    )
  })

  const subChildren: CategoryProps[][] = []

  category.forEach((cat: CategoryProps) => {
    subChildren.push(
      subCategory.filter((subCat: CategoryProps) =>
        subCat.item.includes(cat.item)
      )
    )
  })

  if (!isMobile) {
    return (
      <div className="container-menu">
        <nav className="categories-field">
          <ul data-menu-category>
            {department.map(({ name: nameCat }: CategoryProps, idx: number) => (
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
            {department.map(
              ({ name: nameCat, item: linkCat }: CategoryProps, id: number) => (
                <div
                  key={nameCat}
                  className={active === id + 1 ? 'active ' : 'not-active'}
                >
                  <li key={`category--${id}`}>
                    <h2>
                      <a href={`${linkCat}`}>{nameCat}</a>
                    </h2>
                    <nav>
                      {children[id] &&
                        children[id].map(
                          (
                            { name: nameSubI, item: linkSubI }: CategoryProps,
                            index: number
                          ) => (
                            <div key={`subCategory--${index}`}>
                              <h3>
                                <a href={`${linkSubI}`}>{nameSubI}</a>
                              </h3>
                              {subChildren[id] &&
                                subChildren[id].map(
                                  (
                                    {
                                      name: nameSubII,
                                      item: linkSubII,
                                    }: CategoryProps,
                                    i: number
                                  ) => (
                                    <a
                                      key={`subSubCategory--${i}`}
                                      href={`${linkSubII}`}
                                    >
                                      {nameSubII}
                                    </a>
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
    <MenuMobile isOpen={isOpen} menuItems={department} subCategory={children} />
  )
}
