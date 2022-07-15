import { List as UIList } from '@faststore/ui'
import type { AnchorHTMLAttributes } from 'react'
import RegionalizationButton from 'src/components/regionalization/RegionalizationButton'
import Link from 'src/components/ui/Link'
import { mark } from 'src/sdk/tests/mark'

import styles from './navlinks.module.scss'

interface NavLinksProps {
  onClickLink?: AnchorHTMLAttributes<HTMLAnchorElement>['onClick']
  classes?: string
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

function NavLinks({ onClickLink, classes = '' }: NavLinksProps) {
  return (
    <nav className={`${styles.fsNavlinks} ${classes}`}>
      <RegionalizationButton />
      <UIList data-fs-navlinks-list>
        {collections.map(({ href, name }) => (
          <li key={name} data-fs-navlinks-list-item>
            <Link
              data-fs-navlinks-link
              variant="display"
              href={href}
              onClick={onClickLink}
            >
              {name}
            </Link>
          </li>
        ))}
      </UIList>
    </nav>
  )
}

export default mark(NavLinks)
