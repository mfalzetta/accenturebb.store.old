import { Link } from '@reach/router'
import Section from 'src/components/sections/Section'
import './SectionTitle.scss'

export interface SectionTitleProps {
  title: string
  href?: string
  linkText?: string
  border?: boolean
  description?: string
  className?: string
}

const SectionTitle = ({
  title,
  href,
  linkText,
  border,
  description,
  className,
}: SectionTitleProps) => {
  return (
    <Section>
      <div
        className={`layout__content classSection__title--content ${
          border ? 'border--active' : ''
        } ${className ?? ''}`}
      >
        <span className={`classSection__title ${className ?? ''}`}>
          {title}
        </span>
        {href && linkText && (
          <Link to={href}>
            <span className="classSection__link ">{linkText}</span>
          </Link>
        )}
        {description && (
          <span className="classSection__description">{description}</span>
        )}
      </div>
    </Section>
  )
}

export default SectionTitle
