import InfoCard from 'src/components/custom-components/home/InfoCard'
import Slider from 'src/components/custom-components/home/Slider'
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
    <Section
      style={{
        height: `${Number(allItems[0]?.height) + 50}px`,
      }}
    >
      <div className="layout__content classSection__container category-session">
        <Slider itemsPerPage={6} minWidth={200}>
          {allItems.map((card: CategorySectionProps, index: number) => (
            <InfoCard
              key={index}
              href={card.href}
              src={card.src}
              alt={card.alt}
              width={card.width}
              height={card.height}
              text={card.text}
            />
          ))}
        </Slider>
      </div>
    </Section>
  )
}

export default CategorySection
