import { useEffect } from 'react'
import { isMobile } from 'react-device-detect'

import './menu.scss'
import MenuMobile from './mobile/MenuMobile'

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

  if (isMobile) {
    return <MenuMobile isOpen={isOpen} />
  }

  return (
    <div className={`menu ${isOpen ? 'open' : 'closed'}`}>
      <div className="arrow" />
      <div className="container-menu">
        <nav className="categories-field">
          <ul>
            <li>
              <a href="/">Eletrônicos</a>
            </li>
            <li>
              <a href="/">Eletrodoméstico</a>
            </li>
            <li>
              <a href="/">Cozinha</a>
            </li>
            <li>
              <a href="/">Banheiro</a>
            </li>
          </ul>
        </nav>
        <div className="subcategories-field">
          <h2>Eletrônicos</h2>
          <nav>
            <div>
              <h3>
                <a href="/">Notebooks</a>
              </h3>
              <a href="/">Acessórios para Notebook</a>
              <a href="/">Componentes para Notebook</a>
            </div>
            <div>
              <h3>
                <a href="/">Notebooks</a>
              </h3>
              <a href="/">Acessórios para Notebook</a>
              <a href="/">Componentes para Notebook</a>
            </div>
            <div>
              <h3>
                <a href="/">Notebooks</a>
              </h3>
              <a href="/">Acessórios para Notebook</a>
              <a href="/">Componentes para Notebook</a>
            </div>
            <div>
              <h3>
                <a href="/">Notebooks</a>
              </h3>
              <a href="/">Acessórios para Notebook</a>
              <a href="/">Componentes para Notebook</a>
            </div>
            <div>
              <h3>
                <a href="/">Notebooks</a>
              </h3>
              <a href="/">Acessórios para Notebook</a>
              <a href="/">Componentes para Notebook</a>
            </div>
            <div>
              <h3>
                <a href="/">Notebooks</a>
              </h3>
              <a href="/">Acessórios para Notebook</a>
              <a href="/">Componentes para Notebook</a>
            </div>
            <div>
              <h3>
                <a href="/">Notebooks</a>
              </h3>
              <a href="/">Acessórios para Notebook</a>
              <a href="/">Componentes para Notebook</a>
            </div>
            <div>
              <h3>
                <a href="/">Notebooks</a>
              </h3>
              <a href="/">Acessórios para Notebook</a>
              <a href="/">Componentes para Notebook</a>
            </div>
          </nav>
        </div>
      </div>
    </div>
  )
}

export default Menu
