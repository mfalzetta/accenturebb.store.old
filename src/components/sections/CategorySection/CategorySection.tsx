import InfoCard from 'src/components/custom-components/home/InfoCard'
import Section from 'src/components/sections/Section'

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
  return (
    <Section className="category__section">
      <div className="layout__content classSection__container category-session">
        <div className="classSection__content">
          {allItems.map((card: CategorySectionProps, index: number) => (
            <InfoCard
              key={index}
              href={card.href}
              src={card.src}
              alt={card.alt ?? `${card.text} image`}
              width={card.width}
              height={card.height}
              text={card.text}
            />
          ))}
        </div>
      </div>
    </Section>
  )
}

export default CategorySection
