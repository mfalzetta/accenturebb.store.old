import { Button } from '@faststore/ui'
import { Link } from '@reach/router'
import './BlogSection.scss'

export interface BlogSectionProps {
  src: string
  alt: string
  width: string
  height: string
  btnHref?: string
  primaryText?: string
  SecondaryText?: string
  btnText?: string
}

const BlogSection = ({
  src,
  alt,
  width,
  height,
  btnHref,
  primaryText,
  SecondaryText,
  btnText,
}: BlogSectionProps) => {
  return (
    <div className="blogSection__container">
      <img src={src} alt={alt} loading="lazy" width={width} height={height} />
      {primaryText && <p className="blogSection__primaryText">{primaryText}</p>}
      {SecondaryText && (
        <p className="blogSection__secundaryText">{SecondaryText}</p>
      )}
      {btnText && btnHref && (
        <Link to={btnHref}>
          <Button className="blogSection__button">{btnText}</Button>
        </Link>
      )}
    </div>
  )
}

export default BlogSection
