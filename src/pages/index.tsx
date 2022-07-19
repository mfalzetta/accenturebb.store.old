import 'src/styles/pages/homepage.scss'

import { useSession } from '@faststore/sdk'
import { graphql } from 'gatsby'
import { GatsbySeo, JsonLd } from 'gatsby-plugin-next-seo'
import { mark } from 'src/sdk/tests/mark'
import type { PageProps } from 'gatsby'
import type { HomePageQueryQuery } from '@generated/graphql'
import Newsletter from 'src/components/sections/Newsletter'
import CategorySection from 'src/components/custom-components/home/CategorySection'
import InfoCard from 'src/components/custom-components/home/InfoCard'
import Slider from 'src/components/custom-components/home/Slider'
import SectionTitle from 'src/components/custom-components/home/SectionTitle'
import RenderCMS from 'src/components/RenderCMS'

export type Props = PageProps<HomePageQueryQuery>

function MainBanner() {
  return (
    <Slider arrows wfull height={328}>
      <img
        src="/home/BannerImage.svg"
        alt="Accenture logo"
        width="1368"
        height="328"
        loading="lazy"
        className="image__temporary"
      />
      <img
        src="/home/BannerImage.svg"
        alt="Accenture logo"
        width="1368"
        height="328"
        loading="lazy"
        className="image__temporary"
      />
    </Slider>
  )
}

function Category() {
  return (
    <CategorySection title="Categorias" className="category-session">
      <InfoCard
        href="/"
        src="/home/Image-1.svg"
        alt="imagee"
        width="204"
        height="192"
        text="Moda"
      />
      <InfoCard
        href="/"
        src="/home/Image-2.svg"
        alt="imagee"
        width="204"
        height="192"
        text="Costméticos"
      />
      <InfoCard
        href="/"
        src="/home/Image-3.svg"
        alt="imagee"
        width="204"
        height="192"
        text="Mercado"
      />
      <InfoCard
        href="/"
        src="/home/Image-4.svg"
        alt="imagee"
        width="204"
        height="192"
        text="Livros"
      />
      <InfoCard
        href="/"
        src="/home/Image-5.svg"
        alt="imagee"
        width="204"
        height="192"
        text="Decoração"
      />
      <InfoCard
        href="/"
        src="/home/Image.svg"
        alt="imagee"
        width="204"
        height="192"
        text="Eletronicos"
      />
    </CategorySection>
  )
}

function Brand() {
  return (
    <Slider itemsPerPage={6} height={200}>
      <InfoCard
        href="/"
        src="/home/acc-vetor.svg"
        alt="imagee"
        width="36"
        height="40"
        className="classSection__brand"
      />
      <InfoCard
        href="/"
        src="/home/acc-vetor.svg"
        alt="imagee"
        width="36"
        height="40"
        className="classSection__brand"
      />
      <InfoCard
        href="/"
        src="/home/acc-vetor.svg"
        alt="imagee"
        width="36"
        height="40"
        className="classSection__brand"
      />
      <InfoCard
        href="/"
        src="/home/acc-vetor.svg"
        alt="imagee"
        width="36"
        height="40"
        className="classSection__brand"
      />
      <InfoCard
        href="/"
        src="/home/acc-vetor.svg"
        alt="imagee"
        width="36"
        height="40"
        className="classSection__brand"
      />
      <InfoCard
        href="/"
        src="/home/acc-vetor.svg"
        alt="imagee"
        width="36"
        height="40"
        className="classSection__brand"
      />
    </Slider>
  )
}

function Page(props: Props) {
  const {
    data: { site, cmsHome },
  } = props

  const { locale } = useSession()

  const title = site?.siteMetadata?.title ?? ''
  const siteUrl = `${site?.siteMetadata?.siteUrl}`

  return (
    <>
      {/* SEO */}
      <GatsbySeo
        title={title}
        description={site?.siteMetadata?.description ?? ''}
        titleTemplate={site?.siteMetadata?.titleTemplate ?? ''}
        language={locale}
        canonical={siteUrl}
        openGraph={{
          type: 'website',
          url: siteUrl,
          title: title ?? '',
          description: site?.siteMetadata?.description ?? '',
        }}
      />
      <JsonLd
        json={{
          '@context': 'https://schema.org',
          '@type': 'WebSite',
          url: siteUrl,
          potentialAction: {
            '@type': 'SearchAction',
            target: `${siteUrl}/s/?q={search_term_string}`,
            'query-input': 'required name=search_term_string',
          },
        }}
      />

      {/*
        WARNING: Do not import or render components from any
        other folder than '../components/sections' in here.

        This is necessary to keep the integration with the CMS
        easy and consistent, enabling the change and reorder
        of elements on this page.

        If needed, wrap your component in a <Section /> component
        (not the HTML tag) before rendering it here.
      */}
      <MainBanner />
      <Category />
      <SectionTitle
        className="classSection__container"
        border
        title="Comprar por marca"
      />
      <Brand />
      <RenderCMS sections={cmsHome?.sections} />
      <Newsletter
        title="Receba notícias e ofertas especiais!"
        onSubmit={() => {
          return null
        }}
      />
    </>
  )
}

export const querySSG = graphql`
  query HomePageQuery {
    site {
      siteMetadata {
        title
        description
        titleTemplate
        siteUrl
      }
    }
    cmsHome(name: { eq: "HomePage" }) {
      sections {
        data
        name
      }
    }
  }
`

Page.displayName = 'Page'
export default mark(Page)
