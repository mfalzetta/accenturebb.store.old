import { useEffect } from 'react'

import './menu.scss'
import { MenuGetCategory } from './MenuGetCategory'

interface MenuProps {
  isOpen: boolean
}

const Menu = ({ isOpen }: MenuProps) => {
  const modalOpen = isOpen

  useEffect(() => {
    if (modalOpen) {
      document.getElementsByTagName('body')[0].style.overflowY = 'hidden'
    } else {
      document.getElementsByTagName('body')[0].style.overflowY = 'auto'
    }
  }, [modalOpen])

  return (
    <div className={`menu ${isOpen ? 'open' : 'closed'}`}>
      <div className="arrow" />
      <MenuGetCategory isOpen={isOpen} />
    </div>
  )
}

export default Menu
