import { Button } from '@faststore/ui'
import Image from 'next/image'

import Link from 'src/components/ui/Link'
import Slider from 'src/components/custom-components/home/Slider'

import Section from '../Section'

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
  width: string
  height: string
}

const BlogSection = ({ allItems }: BlogSectionAllItems) => {
  return (
    <Section
      style={{
        height: `${Number(allItems[0]?.height) + 200}px`,
      }}
    >
      <Slider minWidth={424} itemsPerPage={3}>
        {allItems.map((card: BlogSectionProps, index: number) => (
          <div className="blogSection__container" key={index}>
            <Image
              src={card.src}
              alt={card.alt}
              loading="lazy"
              width={parseInt(card.width, 10)}
              height={parseInt(card.height, 10)}
            />
            {card.primaryText && (
              <p className="blogSection__primaryText">{card.primaryText}</p>
            )}
            {card.secondaryText && (
              <p className="blogSection__secundaryText">{card.secondaryText}</p>
            )}
            {card.btnText && card.btnHref && (
              <Link as="a" href={card.btnHref} target="_blank">
                <Button className="blogSection__button">{card.btnText}</Button>
              </Link>
            )}
          </div>
        ))}
      </Slider>
    </Section>
  )
}

export default BlogSection
