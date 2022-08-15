import type { SearchInputRef } from '@faststore/ui'
import { Suspense, useRef, useState } from 'react'
import CartToggle from 'src/components/cart/CartToggle'
import SearchInput from 'src/components/search/SearchInput'
import Menu from 'src/components/menu'
import Button, {
  ButtonSignIn,
  ButtonSignInFallback,
} from 'src/components/ui/Button'
import Icon from 'src/components/ui/Icon'
import Link from 'src/components/ui/Link'
import Logo from 'src/components/ui/Logo'
import { mark } from 'src/sdk/tests/mark'

import styles from './navbar.module.scss'

function Navbar() {
  const searchMobileRef = useRef<SearchInputRef>(null)
  const [showMenu, setShowMenu] = useState(false)

  const [searchExpanded, setSearchExpanded] = useState(false)

  const handlerExpandSearch = () => {
    setSearchExpanded(true)
    searchMobileRef.current?.inputRef?.focus()
  }

  return (
    <header
      data-fs-navbar
      className={`${styles.fsNavbar} layout__content-full`}
    >
      <div className="layout__content" data-fs-navbar-header>
        <section data-fs-navbar-row>
          {!searchExpanded && (
            <>
              <Button
                variant="tertiary"
                data-fs-button-icon
                data-fs-navbar-button-menu
                aria-label="Open Menu"
                icon={<Icon name="List" width={32} height={32} />}
                onClick={() => setShowMenu(!showMenu)}
              />
              <Link
                href="/"
                aria-label="Go to Faststore home"
                title="Go to Faststore home"
                data-fs-navbar-logo
              >
                <Logo />
              </Link>
            </>
          )}
          <SearchInput />
          <div
            data-fs-navbar-buttons
            data-fs-navbar-search-expanded={searchExpanded}
          >
            {searchExpanded && (
              <Button
                variant="tertiary"
                data-fs-button-icon
                data-fs-button-collapse
                aria-label="Collapse search bar"
                icon={<Icon name="CaretLeft" width={32} height={32} />}
                onClick={() => setSearchExpanded(false)}
              />
            )}
            <SearchInput
              placeholder=""
              ref={searchMobileRef}
              testId="store-input-mobile"
              buttonTestId="store-input-mobile-button"
              onSearchClick={handlerExpandSearch}
            />
            <Suspense fallback={<ButtonSignInFallback />}>
              <ButtonSignIn />
            </Suspense>
            <CartToggle />
          </div>
        </section>
      </div>
      <div>
        <Menu isOpen={showMenu} />
      </div>
    </header>
  )
}

Navbar.displayName = 'Navbar'

export default mark(Navbar)
