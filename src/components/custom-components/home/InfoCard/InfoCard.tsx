import { Link } from '@reach/router'
import './InfoCard.scss'

export interface InfoCardProps {
  src: string
  alt: string
  width: string
  height: string
  href: string
  text?: string
  className?: string
}

const InfoCard = ({
  src,
  alt,
  text,
  width,
  height,
  href,
  className,
}: InfoCardProps) => {
  return (
    <Link to={href}>
      <div className={`infocard__container ${className ?? ''}`}>
        <img
          src={src}
          alt={alt}
          className="infocard__img"
          loading="lazy"
          width={width}
          height={height}
        />
        {text && <span className="infocard__text">{text}</span>}
      </div>
    </Link>
  )
}

export default InfoCard
