import { useSession } from '@faststore/sdk'
import { graphql } from 'gatsby'
import { GatsbySeo, JsonLd } from 'gatsby-plugin-next-seo'
import IncentivesHeader from 'src/components/sections/Incentives/IncentivesHeader'
import ProductShelf from 'src/components/sections/ProductShelf'
import Newsletter from 'src/components/sections/Newsletter'
import { mark } from 'src/sdk/tests/mark'
import { ITEMS_PER_SECTION } from 'src/constants'
import type { PageProps } from 'gatsby'
import type { HomePageQueryQuery } from '@generated/graphql'
import IncentivesMock from 'src/components/sections/Incentives/incentivesMock'
import 'src/styles/pages/homepage.scss'
import CategorySection from 'src/components/custom-components/home/CategorySection'
import InfoCard from 'src/components/custom-components/home/InfoCard'
import SectionTitle from 'src/components/custom-components/home/SectionTitle'
import BlogSection from 'src/components/custom-components/home/BlogSection'
import Slider from 'src/components/custom-components/home/Slider'
import PromotionBanner from 'src/components/banners/PromotionBanner'
import RenderCMS from 'src/components/RenderCMS'

import MiddleBanner from '../images/home/background-middle-banner.png'

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

function Blog() {
  return (
    <Slider height={425} minWidth={424} itemsPerPage={3}>
      <BlogSection
        src="/home/blog/Image.svg"
        alt="imagee"
        width="100%"
        height="auto"
        primaryText="Decoração refrescante"
        SecondaryText="Tudo para deixar sua casa mais estilosa e fresca para o verão."
        btnText="comprar coleção de temporada"
        btnHref="/"
      />
      <BlogSection
        src="/home/blog/Image-1.svg"
        alt="imagee"
        width="100%"
        height="auto"
        primaryText="Livros inspiradores"
        SecondaryText="Explore títulos incríveis e inspiradores para viajar no espaço e no tempo nesta próxima temporada."
        btnText="comprar LIVROS DE TEMPORADA"
        btnHref="/"
      />
      <BlogSection
        src="/home/blog/Image-2.svg"
        alt="imagee"
        width="100%"
        height="auto"
        primaryText="Comida orgânica"
        SecondaryText="Manter hábitos saudáveis com produtos naturais e orgânicos seleccionados para o mercado."
        btnText="comprar ALIMENTOS ORGÂNICOS"
        btnHref="/"
      />
    </Slider>
  )
}

function Page(props: Props) {
  const {
    data: { site, cmsHome },
    location: { pathname, host },
  } = props

  const { locale } = useSession()

  const title = site?.siteMetadata?.title ?? ''
  const siteUrl = `https://${host}${pathname}`

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
      {/* <Carousel> */}
      <MainBanner />
      <Category />
      <SectionTitle
        className="classSection__container"
        border
        title="Comprar por marca"
      />
      <Brand />
      <ProductShelf
        first={20}
        selectedFacets={[{ key: 'productClusterIds', value: '139' }]}
        title="Most Wanted"
        isCarousel
      />
      <SectionTitle
        className="classSection__container"
        title="O essencial do Verão"
      />
      <Blog />
      <PromotionBanner
        image={MiddleBanner}
        title="Eletrônicos 20% OFF"
        href="/"
        linkText="compre agora"
      />
      <ProductShelf
        first={ITEMS_PER_SECTION}
        selectedFacets={[{ key: 'productClusterIds', value: '139' }]}
        title="Popular picks"
        isCarousel
      />
      <ProductShelf
        first={ITEMS_PER_SECTION}
        selectedFacets={[{ key: 'productClusterIds', value: '141' }]}
        title="What's trending"
        withDivisor
        isRowLayout
        otherBackground
      />
      <SectionTitle border title="Por que comprar com a Accenture" />
      <IncentivesHeader incentives={IncentivesMock} />
      <Newsletter
        title="Receba notícias e ofertas especiais!"
        onSubmit={() => {
          return null
        }}
      />
      <img
        src="/bannerBottom.svg"
        alt="Accenture logo"
        width="1368"
        height="328"
        loading="lazy"
        className="image__temporary"
      />
      <RenderCMS sections={cmsHome?.sections} />
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
      }
    }

    cmsHome {
      sections {
        data
        name
      }
    }
  }
`

Page.displayName = 'Page'
export default mark(Page)
