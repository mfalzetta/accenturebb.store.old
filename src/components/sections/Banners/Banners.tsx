import Image from 'next/image'

import Slider from 'src/components/custom-components/home/Slider'
import Button from 'src/components/ui/Button'
import Link from 'src/components/ui/Link'

import Section from '../Section'

export interface BannersProps {
  banners: BannerProps[]
}

export interface BannerProps {
  src: string
  href?: string
  alt?: string
  title?: string
  subTitle?: string
  buttonText?: string
  color?: string
}
function Banners({ banners }: BannersProps) {
  const regexp = new RegExp('^#([a-fA-F0-9]{6}|[a-fA-F0-9]{3})$')

  return (
    <Section className="layout__section" data-main-banner>
      <Slider arrows wfull>
        {banners.map((banner: BannerProps, index: number) => (
          <div data-banner-container key={index}>
            <Link href={banner.href ? banner.href : '/#'}>
              <Image
                src={banner.src}
                alt={banner.alt ? banner.alt : 'Banner Home'}
                height={328}
                className="image__temporary"
                layout="fill"
                priority
              />
              <div
                data-banner-info
                style={{
                  ['--color' as any]: `${
                    banner.color && regexp.test(banner.color)
                      ? banner.color
                      : '#FFFFFF'
                  }`,
                }}
              >
                {banner.title && (
                  <span data-banner-info-title>{banner.title}</span>
                )}
                {banner.subTitle && (
                  <span data-banner-info-sub-title>{banner.subTitle}</span>
                )}
                {banner.buttonText && (
                  <Button data-banner-info-button>{banner.buttonText}</Button>
                )}
              </div>
            </Link>
          </div>
        ))}
      </Slider>
    </Section>
  )
}

export default Banners
