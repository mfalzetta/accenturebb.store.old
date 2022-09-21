import Image from 'next/image'

import Section from 'src/components/sections/Section'

export interface ImageBannerProps {
  src: string
  alt?: string
  fullWidth?: boolean
}

const ImageBanner = ({ src, alt, fullWidth }: ImageBannerProps) => {
  return (
    <>
      {!fullWidth ? (
        <Section className="layout__content container__margin">
          <Image
            loading="lazy"
            className="image__temporary"
            src={src}
            alt={alt}
            layout="fill"
          />
        </Section>
      ) : (
        <Image
          loading="lazy"
          className="image__temporary"
          src={src}
          alt={alt}
          layout="fill"
        />
      )}
    </>
  )
}

export default ImageBanner
