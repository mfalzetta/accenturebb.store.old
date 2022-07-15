import Section from 'src/components/sections/Section'

import SectionTitle from '../SectionTitle'
import './CategorySection.scss'

export interface CategorySectionProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  children: any
  title: string
  href?: string
  linkText?: string
  className?: string
  border?: boolean
}

const CategorySection = ({
  children,
  title,
  className,
  href,
  linkText,
  border,
}: CategorySectionProps) => {
  return (
    <Section>
      <div
        className={`layout__content classSection__container ${className ?? ''}`}
      >
        <SectionTitle
          title={title}
          href={href}
          linkText={linkText}
          border={border}
        />
        <div className="classSection__content">{children}</div>
      </div>
    </Section>
  )
}

export default CategorySection
