import { List as UIList } from '@faststore/ui'
import type { AnchorHTMLAttributes } from 'react'
import { gql } from '@faststore/graphql-utils'

import { useQuery } from 'src/sdk/graphql/useQuery'
import RenderPageSections from 'src/components/cms/RenderPageSections'
import { mark } from 'src/sdk/tests/mark'
import RegionalizationBar from 'src/components/regionalization/RegionalizationBar'

import styles from './navlinks.module.scss'

interface NavLinksProps {
  onClickLink?: AnchorHTMLAttributes<HTMLAnchorElement>['onClick']
  classes?: string
}

export const query = gql`
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
  const { data } = useQuery<any, any>(query, null)

  return (
    <nav className={`${styles.fsNavlinks} ${classes}`}>
      <RegionalizationBar classes="region hidden-mobile" />
      <UIList data-fs-navlinks-list>
        <RenderPageSections sections={data?.sections} />
      </UIList>
    </nav>
  )
}

export default mark(NavLinks)
