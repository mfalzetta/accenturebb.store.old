import { Link } from '@reach/router'

export interface CategoryButtonsProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
}: CategoryButtonsProps) => {
  return (
    <div className="categoryButtons">
      <div className={`classSection__container ${className ?? ''}`}>
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
