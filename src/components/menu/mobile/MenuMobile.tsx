import { useState } from 'react'
import {
  BackwardArrowIcon,
  ForwardArrowIcon,
} from 'src/components/ui/ImageGallery/Icons'
import './menu-mobile.scss'

interface MenuMobileProps {
  isOpen: boolean
}

interface MenuItem {
  value: string
  items?: MenuItem[]
}

const menuItems = [
  {
    value: 'Fashion',
    items: [{ value: 'Boys' }, { value: 'Girls' }, { value: 'Kids' }],
  },
  {
    value: 'Electronics',
    items: [{ value: 'Smartphone' }, { value: 'Notebook' }],
  },
  { value: 'Food' },
  { value: 'Mobile phones' },
]

const MenuMobile = ({ isOpen }: MenuMobileProps) => {
  const [firstLevel, setFirstLevel] = useState(true)
  const [secondLevel, setSecondLevel] = useState(false)
  const [currentItem, setCurrentItem] = useState({
    value: '',
    items: [],
  })

  const nextLevel = (menuItem: any) => {
    setFirstLevel(false)
    setSecondLevel(true)
    setCurrentItem(menuItem)
  }

  const previousLevel = () => {
    setSecondLevel(false)
    setFirstLevel(true)
  }

  return (
    <div className={`menu-container ${isOpen ? 'open' : 'closed'}`}>
      <div className="arrow" />
      <div className={`first-level ${firstLevel ? 'open' : 'closed'}`}>
        <nav>
          <ul>
            {menuItems.map((item: MenuItem, index) => (
              <li key={index}>
                <a href="/">{item.value}</a>
                {item.items ? (
                  <button onClick={() => nextLevel(item)}>
                    <ForwardArrowIcon color="#ffffff" />
                  </button>
                ) : null}
              </li>
            ))}
          </ul>
        </nav>
      </div>
      <div className={`second-level ${secondLevel ? 'open' : 'closed'}`}>
        <button onClick={() => previousLevel()}>
          <BackwardArrowIcon color="#ffffff" />
          <span>{currentItem?.value}</span>
        </button>
        <nav>
          <ul>
            {currentItem?.items.map((subitem: MenuItem, index) => (
              <li key={index}>
                <a href="/">{subitem.value}</a>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </div>
  )
}

export default MenuMobile
