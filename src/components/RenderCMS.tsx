import type { ComponentType } from 'react'

import BannerText from './sections/BannerText'
import Hero from './sections/Hero'
import IncentivesHeader from './sections/Incentives/IncentivesHeader'
import ProductShelf from './sections/ProductShelf'
import ProductTiles from './sections/ProductTiles'
import PromotionBanner from './sections/PromotionBanner'
import ImageBanner from './sections/ImageBanner'

/**
 * Sections: Components imported from '../components/sections' only.
 * Do not import or render components from any other folder in here.
 */
const COMPONENTS: Record<string, ComponentType<any>> = {
  Hero,
  BannerText,
  IncentivesHeader,
  ProductShelf,
  ProductTiles,
  PromotionBanner,
  ImageBanner,
}

interface Props {
  sections?: Array<{ name: string; data: any }>
}

function RenderCMS({ sections }: Props) {
  return (
    <>
      {sections?.map(({ name, data }, index) => {
        const Component = COMPONENTS[name]

        if (!Component) {
          console.info(
            `Could not find component for block ${name}. Add a new component for this block or remove it from the CMS`
          )

          return <></>
        }

        return <Component key={`cms-section-${index}`} {...data} />
      })}
    </>
  )
}

export default RenderCMS
