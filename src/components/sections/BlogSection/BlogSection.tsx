import { Button } from '@faststore/ui'
import { Link } from '@reach/router'
import Slider from 'src/components/custom-components/home/Slider'
import './BlogSection.scss'

export interface BlogSectionAllItems {
  allItems: BlogSectionProps[]
}
export interface BlogSectionProps {
  src: string
  alt: string
  btnHref?: string
  primaryText?: string
  secondaryText?: string
  btnText?: string
}

const BlogSection = ({ allItems }: BlogSectionAllItems) => {
  return (
    <Slider height={425} minWidth={424} itemsPerPage={3}>
      {allItems.map((card: BlogSectionProps, index: number) => (
        <div className="blogSection__container" key={index}>
          <img
            src={card.src}
            alt={card.alt}
            loading="lazy"
            width="100%"
            height="auto"
          />
          {card.primaryText && (
            <p className="blogSection__primaryText">{card.primaryText}</p>
          )}
          {card.secondaryText && (
            <p className="blogSection__secundaryText">{card.secondaryText}</p>
          )}
          {card.btnText && card.btnHref && (
            <Link to={card.btnHref}>
              <Button className="blogSection__button">{card.btnText}</Button>
            </Link>
          )}
        </div>
      ))}
    </Slider>
  )
}

export default BlogSection
