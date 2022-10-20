/* eslint-disable @typescript-eslint/no-explicit-any */
import type { ComponentType } from 'react'

import Hero from 'src/components/sections/Hero'
import BannerText from 'src/components/sections/BannerText'
import IncentivesHeader from 'src/components/sections/Incentives/IncentivesHeader'
import ProductShelf from 'src/components/sections/ProductShelf'
import ProductTiles from 'src/components/sections/ProductTiles'

import PromotionBanner from '../sections/PromotionBanner'
import ImageBanner from '../sections/ImageBanner'
import BlogSection from '../sections/BlogSection'
import HeaderLink from '../sections/HeaderLink/HeaderLink'
import Title from '../sections/Title/Title'
import CategorySection from '../sections/CategorySection/CategorySection'
import BrandSection from '../sections/BrandSection/BrandSection'
import Banners from '../sections/Banners'
import CategoryImage from '../sections/CategoryImage'
import SectionBoundary from './SectionBoundary'
import Newsletter from '../sections/Newsletter'

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
  BlogSection,
  HeaderLink,
  Title,
  CategorySection,
  BrandSection,
  Banners,
  CategoryImage,
  Newsletter,
}

interface Props {
  sections?: Array<{ name: string; data: any }>
}

const RenderPageSections = ({ sections }: Props) => (
  <>
    {sections?.map(({ name, data }, index) => {
      const Component = COMPONENTS[name]

      if (!Component) {
        console.info(
          `Could not find component for block ${name}. Add a new component for this block or remove it from the CMS`
        )

        return <></>
      }

      return (
        <SectionBoundary key={`cms-section-${index}`} name={name}>
          <Component {...data} />
        </SectionBoundary>
      )
    })}
  </>
)

export default RenderPageSections
