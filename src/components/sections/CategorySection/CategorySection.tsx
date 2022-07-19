import InfoCard from 'src/components/custom-components/home/InfoCard'
import Section from 'src/components/sections/Section'

import './CategorySection.scss'

export interface CategorySectionAllItems {
  allItems: CategorySectionProps[]
}
export interface CategorySectionProps {
  src: string
  alt: string
  href: string
  text?: string
}

const CategorySection = ({ allItems }: CategorySectionAllItems) => {
  return (
    <Section>
      <div className="layout__content classSection__container category-session">
        <div className="classSection__content">
          {allItems.map((card: CategorySectionProps, index: number) => (
            <InfoCard
              key={index}
              href={card.href}
              src={card.src}
              alt={card.alt}
              width="204"
              height="192"
              text={card.text}
            />
          ))}
        </div>
      </div>
    </Section>
  )
}

export default CategorySection
