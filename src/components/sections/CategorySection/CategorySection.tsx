import InfoCard from 'src/components/custom-components/home/InfoCard'
import KeenSlider from 'src/components/custom-components/KeenSlider/KeenSlider'
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
        height: `${Number(allItems[0]?.height) + 80}px`,
      }}
    >
      <div className="layout__content classSection__container category-session">
        <KeenSlider dots breakpoints={{ desktop: 5, tablet: 3, phone: 1 }}>
          {allItems.map((card: CategorySectionProps, index: number) => (
            <div
              className={`keen-slider__slide number-slide${index}`}
              style={{ textAlign: '-webkit-center' }}
              key={index}
            >
              <InfoCard
                href={card.href}
                src={card.src}
                alt={card.alt ?? `${card.text} image`}
                width={card.width}
                height={card.height}
                text={card.text}
              />
            </div>
          ))}
        </KeenSlider>
      </div>
    </Section>
  )
}

export default CategorySection
