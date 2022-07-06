import { Link } from '@reach/router'

export interface CategoryButtonsProps {
  children?: any
  title?: string
  href?: string
  linkText?: string
  className?: string
  border?: boolean
}

const CategoryButtons = ({
  children,
  title,
  className,
  href,
  linkText,
  border,
}: CategoryButtonsProps) => {
  return (
    <div className="categoryButtons">
      <div
        className={`classSection__container ${className ?? ''}`}
        border={border}
      >
        <span className={`classSection__title ${className ?? ''}`}>
          {title}
        </span>
        {href && linkText && (
          <Link to={href}>
            <span className="classSection__link ">{linkText}</span>
          </Link>
        )}
        <div className="classSection__content">{children}</div>
      </div>
    </div>
  )
}

export default CategoryButtons
