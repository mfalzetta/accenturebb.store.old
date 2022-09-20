import { List as UIList } from '@faststore/ui'
import type { AnchorHTMLAttributes } from 'react'

import RenderPageSections from 'src/components/cms/RenderPageSections'
import { mark } from 'src/sdk/tests/mark'
import RegionalizationBar from 'src/components/regionalization/RegionalizationBar'

import styles from './navlinks.module.scss'
import useCmsPage from '../../../data/hook/useCmsPage'

interface NavLinksProps {
  onClickLink?: AnchorHTMLAttributes<HTMLAnchorElement>['onClick']
  classes?: string
}

function NavLinks({ classes = '' }: NavLinksProps) {
  const cmsHeaderLink = useCmsPage('HeaderLink')

  return (
    <nav className={`${styles.fsNavlinks} ${classes}`}>
      <RegionalizationBar classes="region hidden-mobile" />
      <UIList data-fs-navlinks-list>
        <RenderPageSections sections={cmsHeaderLink?.sections} />
      </UIList>
    </nav>
  )
}

export default mark(NavLinks)
