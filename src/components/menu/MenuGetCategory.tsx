import { useEffect, useState } from 'react'
import type { Dispatch, SetStateAction } from 'react'

import useCategories from 'src/data/hook/useCategories'

import MenuMobile from './mobile/MenuMobile'
import MenuDesktop from './desktop/MenuDesktop'

interface MenuProps {
  isOpen: boolean
  stateChanger: Dispatch<SetStateAction<boolean>>
}

export interface CategoryProps {
  name: string
  item: string
  position: number
}

export interface ItemProp {
  depart: CategoryProps
  category: SubProp[]
}

export interface SubProp {
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

export function handleResize() {
  if (window.innerWidth < 920) {
    return true
  }

  return false
}

export const MenuGetCategory = ({ stateChanger, isOpen }: MenuProps) => {
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    setIsMobile(handleResize())
    window.addEventListener(
      'resize',
      () => {
        setIsMobile(handleResize())
      },
      true
    )
  }, [isMobile])

  const data = useCategories()
  const categories = data?.categories

  if (!categories) {
    return <></>
  }

  const {
    allCollections: { edges },
  } = categories

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
      <MenuDesktop
        isOpen={isOpen}
        stateChanger={stateChanger}
        depart={depart}
        items={items}
      />
    )
  }

  return (
    <MenuMobile stateChanger={stateChanger} isOpen={isOpen} items={items} />
  )
}
