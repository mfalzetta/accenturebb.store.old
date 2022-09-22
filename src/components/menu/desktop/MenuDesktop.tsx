import type { Dispatch, SetStateAction } from 'react'
import { useEffect, useState } from 'react'

import Link from 'src/components/ui/Link/Link'

import type { CategoryProps, ItemProp, SubProp } from '../MenuGetCategory'
import styles from './menu-desktop.module.scss'

interface MenuDesktopProps {
  depart: CategoryProps[]
  items: ItemProp[]
  stateChanger: Dispatch<SetStateAction<boolean>>
  isOpen: boolean
}

const MenuDesktop = ({
  depart,
  items,
  stateChanger,
  isOpen,
}: MenuDesktopProps) => {
  const [active, setActive] = useState(1)

  useEffect(() => {
    setActive(1)
  }, [isOpen])

  return (
    <div className={styles.fsMenuDesktop}>
      <nav data-fs-categories-field>
        <ul data-menu-category>
          {depart.map(({ name: nameCat }: CategoryProps, idx: number) => (
            <li
              key={`category--${idx}`}
              data-fs-category-active={active === idx + 1}
            >
              <button onClick={() => setActive(idx + 1)}>
                <span>{nameCat}</span>
              </button>
            </li>
          ))}
        </ul>
      </nav>
      <div data-fs-subcategories-field>
        <ul data-menu-sub-category>
          {items.map(
            (
              { depart: { name: nameCat, item: linkCat }, category }: ItemProp,
              id: number
            ) => (
              <div
                key={nameCat}
                data-fs-subcategories-active={active === id + 1}
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
                    {category?.map(
                      (
                        {
                          category: { name: nameSubI, item: linkSubI },
                          subCategory,
                        }: SubProp,
                        index: number
                      ) => (
                        <div key={`subCategory--${index}`}>
                          <h3>
                            <Link
                              onClick={() => stateChanger(false)}
                              href={`${linkSubI}`}
                            >
                              {nameSubI}
                            </Link>
                          </h3>
                          {subCategory?.map(
                            (
                              {
                                name: nameSubII,
                                item: linkSubII,
                              }: CategoryProps,
                              i: number
                            ) => (
                              <Link
                                onClick={() => stateChanger(false)}
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

export default MenuDesktop
