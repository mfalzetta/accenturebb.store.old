import Image from 'next/image'

import Section from 'src/components/sections/Section'

export interface ImageBannerProps {
  src: string
  alt?: string
  fullWidth?: boolean
  height?: number
}

const ImageBanner = ({ src, alt, fullWidth, height }: ImageBannerProps) => {
  return (
    <>
      {!fullWidth ? (
        <Section
          className="layout__content container__margin"
          style={{ height: `${height}px` }}
        >
          <Image
            loading="eager"
            className="image__temporary"
            src={src}
            alt={alt}
            layout="fill"
            priority
          />
        </Section>
      ) : (
        <Section
          className="layout__content-full"
          style={{ height: `${height}px` }}
        >
          <Image
            className="image__temporary"
            src={src}
            alt={alt}
            layout="fill"
            loading="eager"
            priority
          />
        </Section>
      )}
    </>
  )
}

export default ImageBanner
