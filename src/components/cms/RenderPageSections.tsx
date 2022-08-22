import type { ComponentType } from 'react'
import BannerText from 'src/components/sections/BannerText'
import Hero from 'src/components/sections/Hero'
import IncentivesHeader from 'src/components/sections/Incentives/IncentivesHeader'
import ProductShelf from 'src/components/sections/ProductShelf'
import ProductTiles from 'src/components/sections/ProductTiles'
import PromotionBanner from 'src/components/sections/PromotionBanner'
import ImageBanner from 'src/components/sections/ImageBanner'
import BlogSection from 'src/components/sections/BlogSection'
import HeaderLink from 'src/components/sections/HeaderLink/HeaderLink'
import Title from 'src/components/sections/Title/Title'
import CategorySection from 'src/components/sections/CategorySection/CategorySection'
import BrandSection from 'src/components/sections/BrandSection/BrandSection'
import Banners from 'src/components/sections/Banners'
/**
 * Sections: Components imported from '../components/sections' only.
 * Do not import or render components from any other folder in here.
 */

/* eslint-disable  @typescript-eslint/no-explicit-any */
const COMPONENTS: Record<string, ComponentType<any>> = {
  Hero,
  BannerText,
  IncentivesHeader,
  ProductShelf,
  ProductTiles,
  PromotionBanner,
  ImageBanner,
  BlogSection,
  HeaderLink,
  Title,
  CategorySection,
  BrandSection,
  Banners,
}

interface Props {
  sections?: Array<{ name: string; data: unknown }>
}

function RenderPageSections({ sections }: Props) {
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

        return <Component key={`cms-section-${index}`} {...(data as any)} />
      })}
    </>
  )
}

export default RenderPageSections
