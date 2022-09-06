import type { Dispatch, SetStateAction } from 'react'
import { useState } from 'react'
import {
  BackwardArrowIcon,
  ForwardArrowIcon,
} from 'src/components/ui/ImageGallery/Icons'
import Link from 'src/components/ui/Link'
import './menu-mobile.scss'

interface MenuMobileProps {
  isOpen: boolean
  items: ItemProp[]
  stateChanger: Dispatch<SetStateAction<boolean>>
}

interface Node {
  name: string
  item: string
  position: number
}

interface ItemProp {
  depart: Node
  category: SubProp[]
}
interface SubProp {
  subCategory: Node[]
  category: Node
}

const MenuMobile = ({ stateChanger, isOpen, items }: MenuMobileProps) => {
  const [firstLevel, setFirstLevel] = useState(true)
  const [secondLevel, setSecondLevel] = useState(false)
  const [active, setActive] = useState(0)

  const nextLevel = (index: number) => {
    setActive(index + 1)
    setFirstLevel(false)
    setSecondLevel(true)
  }

  const previousLevel = () => {
    setActive(0)
    setSecondLevel(false)
    setFirstLevel(true)
  }

  return (
    <div className={`menu-container ${isOpen ? 'open' : 'closed'}`}>
      <div className="arrow" />
      <div className={`first-level ${firstLevel ? 'open' : 'closed'}`}>
        <nav>
          <ul>
            {items.map(
              (
                { depart: item, category: subCategory }: ItemProp,
                index: number
              ) => (
                <li key={index}>
                  <Link
                    onClick={() => stateChanger(false)}
                    href={`${item.item}`}
                  >
                    {item.name}
                  </Link>
                  {subCategory[0] ? (
                    <button onClick={() => nextLevel(index)}>
                      <ForwardArrowIcon color="#ffffff" />
                    </button>
                  ) : null}
                </li>
              )
            )}
          </ul>
        </nav>
      </div>
      {items.map(
        ({ depart: item, category: subCategory }: ItemProp, idx: number) => (
          <div
            key={`category-${item.name}`}
            className={`second-level ${
              secondLevel && active === idx + 1 ? 'open' : 'closed'
            }`}
          >
            <button onClick={() => previousLevel()}>
              <BackwardArrowIcon color="#ffffff" />
              <span> {item.name}</span>
            </button>
            <nav>
              <ul>
                {subCategory.map(
                  ({ category: subitem }: SubProp, i: number) => (
                    <li key={i}>
                      <Link
                        onClick={() => stateChanger(false)}
                        href={`${subitem.item}`}
                      >
                        {subitem.name}
                      </Link>
                    </li>
                  )
                )}
              </ul>
            </nav>
          </div>
        )
      )}
    </div>
  )
}

export default MenuMobile
