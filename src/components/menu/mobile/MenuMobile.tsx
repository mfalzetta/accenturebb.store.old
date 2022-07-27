import { useState } from 'react'
import {
  BackwardArrowIcon,
  ForwardArrowIcon,
} from 'src/components/ui/ImageGallery/Icons'
import './menu-mobile.scss'

interface MenuMobileProps {
  isOpen: boolean
  menuItems: CategoriesProp[]
  subCategory: CategoriesProp[][]
}

interface CategoriesProp {
  name: string
  item: string
}

const MenuMobile = ({ isOpen, menuItems, subCategory }: MenuMobileProps) => {
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
            {menuItems.map((item: CategoriesProp, index: number) => (
              <li key={index}>
                <a href={`${item.item}`}>{item.name}</a>
                {subCategory[index] ? (
                  <button onClick={() => nextLevel(index)}>
                    <ForwardArrowIcon color="#ffffff" />
                  </button>
                ) : null}
              </li>
            ))}
          </ul>
        </nav>
      </div>
      {menuItems.map((item: CategoriesProp, idx: number) => (
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
              {subCategory[idx].map((subitem: CategoriesProp, i: number) => (
                <li key={i}>
                  <a href={`${subitem.item}`}>{subitem.name}</a>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      ))}
    </div>
  )
}

export default MenuMobile
