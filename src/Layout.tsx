import { lazy, Suspense } from 'react'
import Footer from 'src/components/common/Footer'
import Navbar from 'src/components/common/Navbar'
import Toast from 'src/components/common/Toast'
import RegionalizationBar from 'src/components/regionalization/RegionalizationBar'
import { useUI } from 'src/sdk/ui/Provider'
import type { PropsWithChildren } from 'react'
import 'src/styles/pages/layout.scss'
import { graphql, useStaticQuery } from 'gatsby'

import RenderCMS from './components/RenderCMS'

const CartSidebar = lazy(() => import('src/components/cart/CartSidebar'))
const RegionModal = lazy(
  () => import('src/components/regionalization/RegionalizationModal')
)

export const querySSG = graphql`
  query HeaderLinkQuery {
    cmsHeaderLink(name: { eq: "Header Links S" }) {
      sections {
        data
        name
      }
    }
  }
`

function Layout({ children }: PropsWithChildren) {
  const { cart: displayCart, modal: displayModal } = useUI()
  const { cmsHeaderLink } = useStaticQuery(querySSG)

  return (
    <>
      {/* <Alert icon="Bell" link={{ text: 'Buy now', to: '/office' }} dismissible>
        Get 10% off today:&nbsp;<span>NEW10</span>
      </Alert> */}

      <Navbar />

      <Toast />

      <main>
        <div className="headerLink">
          <div className="headerLink--content">
            <RegionalizationBar classes="hidden-mobile" />
            <RenderCMS sections={cmsHeaderLink?.sections} />
          </div>
        </div>
        {children}
      </main>

      <Footer />

      {displayCart && (
        <Suspense fallback={null}>
          <CartSidebar />
        </Suspense>
      )}

      {displayModal && (
        <Suspense fallback={null}>
          <RegionModal />
        </Suspense>
      )}
    </>
  )
}

export default Layout
