import InfoCard from 'src/components/custom-components/home/InfoCard'
import Slider from 'src/components/custom-components/home/Slider'
import Section from 'src/components/sections/Section'

export interface BrandSectionProps {
  src: string
  alt: string
  href: string
  width: string
  height: string
  size: 'small' | 'big'
}

export interface BrandSectionAllItems {
  allItems: BrandSectionProps[]
}

const BrandSection = ({ allItems }: BrandSectionAllItems) => {
  return (
    <Section>
      <Slider itemsPerPage={6} minWidth={200}>
        {allItems.map((card: BrandSectionProps, index: number) => (
          <InfoCard
            key={index}
            href={card.href}
            src={card.src}
            alt={card.alt}
            width={card.width}
            height={card.height}
            className="classSection__brand"
            brandSize={card.size}
          />
        ))}
      </Slider>
    </Section>
  )
}

export default BrandSection
