import { List as UIList } from '@faststore/ui'
import type { AnchorHTMLAttributes } from 'react'
import RegionalizationButton from 'src/components/regionalization/RegionalizationButton'
import RenderCMS from 'src/components/RenderCMS'
import { mark } from 'src/sdk/tests/mark'
import { graphql, useStaticQuery } from 'gatsby'

import styles from './navlinks.module.scss'

interface NavLinksProps {
  onClickLink?: AnchorHTMLAttributes<HTMLAnchorElement>['onClick']
  classes?: string
}

export const querySSG = graphql`
  query HeaderLinkQuery {
    cmsHeaderLink {
      sections {
        data
        name
      }
    }
  }
`

function NavLinks({ classes = '' }: NavLinksProps) {
  const { cmsHeaderLink } = useStaticQuery(querySSG)

  return (
    <nav className={`${styles.fsNavlinks} ${classes}`}>
      <RegionalizationButton />
      <UIList data-fs-navlinks-list>
        <RenderCMS sections={cmsHeaderLink?.sections} />
      </UIList>
    </nav>
  )
}

export default mark(NavLinks)
