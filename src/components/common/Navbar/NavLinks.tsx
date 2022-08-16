import { List as UIList } from '@faststore/ui'
import type { AnchorHTMLAttributes } from 'react'
import RenderCMS from 'src/components/RenderCMS'
import { mark } from 'src/sdk/tests/mark'
import { graphql, useStaticQuery } from 'gatsby'
import RegionalizationBar from 'src/components/regionalization/RegionalizationBar'

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
      <RegionalizationBar classes="region" />
      <UIList data-fs-navlinks-list>
        <RenderCMS sections={cmsHeaderLink?.sections} />
      </UIList>
    </nav>
  )
}

export default mark(NavLinks)
