import InfoCard from 'src/components/custom-components/home/InfoCard'
import Slider from 'src/components/custom-components/home/Slider'
import Section from 'src/components/sections/Section'

export interface BrandSectionProps {
  src: string
  alt: string
  href: string
  size: 'small' | 'big'
}

export interface BrandSectionAllItems {
  allItems: BrandSectionProps[]
}

const BrandSection = ({ allItems }: BrandSectionAllItems) => {
  return (
    <Section>
      <Slider itemsPerPage={6} height={200} minWidth={200}>
        {allItems.map((card: BrandSectionProps, index: number) => (
          <InfoCard
            key={index}
            href={card.href}
            src={card.src}
            alt={card.alt}
            width="100%"
            height="auto"
            className="classSection__brand"
            brandSize={card.size}
          />
        ))}
      </Slider>
    </Section>
  )
}

export default BrandSection
