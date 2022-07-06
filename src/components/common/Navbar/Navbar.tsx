import { List as UIList } from '@faststore/ui'
import { Link as LinkGatsby } from 'gatsby'
import type { AnchorHTMLAttributes } from 'react'
import { useState, useEffect } from 'react'
import CartToggle from 'src/components/cart/CartToggle'
import SearchInput from 'src/components/common/SearchInput'
import Icon from 'src/components/ui/Icon'
import { ButtonIcon, ButtonSignIn } from 'src/components/ui/Button'
import Logo from 'src/components/ui/Logo'
import { mark } from 'src/sdk/tests/mark'
import Menu from 'src/components/menu'
import RegionalizationButton from 'src/components/regionalization/RegionalizationButton'
import Link from 'src/components/ui/Link'

interface NavLinksProps {
  onClickLink?: AnchorHTMLAttributes<HTMLAnchorElement>['onClick']
}

const collections = [
  {
    name: "Today's Deals",
    href: '/deals',
  },
  {
    name: 'New Releases',
    href: '/new-releases',
  },
  {
    name: 'Top Sale',
    href: '/top-sale',
  },
  {
    name: 'Customer Service',
    href: '/customer-service',
  },
  {
    name: 'Gift Cards',
    href: '/gift-cards',
  },
]

function NavLinks({ onClickLink }: NavLinksProps) {
  return (
    <nav className="navlinks__list">
      <UIList>
        <li>
          <RegionalizationButton classes="hidden-mobile" />
        </li>
        {collections.map(({ href, name }) => (
          <li key={name}>
            <Link variant="display" to={href} onClick={onClickLink}>
              {name}
            </Link>
          </li>
        ))}
      </UIList>
    </nav>
  )
}

function Navbar() {
  const [showMenu, setShowMenu] = useState(false)
  const [mobile, setMobile] = useState(false)

  const handleResize = () => {
    setMobile(window.innerWidth < 920)
  }

  useEffect(() => {
    setMobile(window.innerWidth < 920)
    window.addEventListener('resize', handleResize)
  }, [])

  return (
    <header className="navbar layout__content-full">
      <div className="navbar__header layout__content">
        {mobile ? (
          <>
            <section className="navbar__row">
              <ButtonIcon
                data-fs-button-menu
                aria-label="Open Menu"
                icon={<Icon name="List" width={32} height={32} />}
                onClick={() => setShowMenu(!showMenu)}
              />
              <LinkGatsby
                to="/"
                aria-label="Go to Faststore home"
                title="Go to Faststore home"
                className="navbar__logo"
              >
                <Logo />
              </LinkGatsby>
              <div className="navbar__buttons--content">
                <ButtonSignIn />
                <CartToggle />
              </div>
            </section>
            <Menu isOpen={showMenu} />
            <div className="navbar__container-search">
              <SearchInput />
            </div>
          </>
        ) : (
          <>
            <section className="navbar__row">
              <ButtonIcon
                data-fs-button-menu
                aria-label="Open Menu"
                icon={<Icon name="List" width={32} height={32} />}
                onClick={() => setShowMenu(!showMenu)}
              />
              <LinkGatsby
                to="/"
                aria-label="Go to Faststore home"
                title="Go to Faststore home"
                className="navbar__logo"
              >
                <Logo />
              </LinkGatsby>
              <SearchInput />
              <ButtonSignIn />
              <CartToggle />
            </section>
            <Menu isOpen={showMenu} />
          </>
        )}
      </div>
      <NavLinks />
    </header>
  )
}

Navbar.displayName = 'Navbar'

export default mark(Navbar)
