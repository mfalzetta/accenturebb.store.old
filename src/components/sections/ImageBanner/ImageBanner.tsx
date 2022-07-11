import Section from 'src/components/sections/Section'
import './ImageBanner.scss'

export interface ImageBannerProps {
  src: string
  alt?: string
  fullWidth?: string
}

const ImageBanner = ({ src, alt, fullWidth }: ImageBannerProps) => {
  return (
    <>
      {!fullWidth ? (
        <Section className="layout__content container__margin">
          <img
            loading="lazy"
            className="image__temporary"
            src={src}
            alt={alt}
          />
        </Section>
      ) : (
        <img loading="lazy" className="image__temporary" src={src} alt={alt} />
      )}
    </>
  )
}

export default ImageBanner
