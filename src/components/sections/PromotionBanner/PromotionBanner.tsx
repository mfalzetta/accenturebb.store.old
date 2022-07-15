import Section from 'src/components/sections/Section'
import './PromotionBanner.scss'

export interface PromotionBannerProps {
  src: string
  title?: string
  href?: string
  linkText?: string
}

const PromotionBanner = ({
  src,
  title,
  href,
  linkText,
}: PromotionBannerProps) => {
  return (
    <Section className="layout__content container__margin">
      <div className="background" style={{ backgroundImage: `url(${src})` }}>
        <h2 className="title">{title}</h2>
        <a className="button-link" href={href}>
          {linkText}
        </a>
      </div>
    </Section>
  )
}

export default PromotionBanner
