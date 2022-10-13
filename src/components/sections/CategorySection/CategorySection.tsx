import { useRef } from 'react'

import InfoCard from 'src/components/custom-components/home/InfoCard'
// import KeenSlider from 'src/components/custom-components/KeenSlider/KeenSlider'
import Section from 'src/components/sections/Section'
// import useDeviceType from 'src/data/hook/useDeviceTyps'

export interface CategorySectionAllItems {
  allItems: CategorySectionProps[]
}
export interface CategorySectionProps {
  src: string
  alt: string
  href: string
  width: string
  height: string
  text?: string
}

const CategorySection = ({ allItems }: CategorySectionAllItems) => {
  const refContainer = useRef(null)

  return (
    <Section
      ref={refContainer}
      style={{
        height: 'auto',
      }}
    >
      <div
        className="layout__content classSection__container category-session"
        data-fs-category-section
      >
        {/* <KeenSlider dots breakpoints={{ desktop: 5, tablet: 3, phone: 1 }}> */}
        {allItems.map((card: CategorySectionProps, index: number) => (
          // <div
          //   className={`keen-slider__slide number-slide${index}`}
          //   style={{ textAlign: '-webkit-center' }}
          //   key={index}
          // >
          <InfoCard
            key={index}
            href={card.href}
            src={card.src}
            alt={card.alt ?? `${card.text} image`}
            width={card.width}
            height={card.height}
            text={card.text}
          />
          // </div>
        ))}
        {/* </KeenSlider> */}
      </div>
    </Section>
  )
}

export default CategorySection
