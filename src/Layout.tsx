import { lazy, Suspense } from 'react'
import Footer from 'src/components/common/Footer'
import Navbar from 'src/components/common/Navbar'
import Toast from 'src/components/common/Toast'
import RegionalizationModal from 'src/components/regionalization/RegionalizationModal'
import { useUI } from 'src/sdk/ui'
import type { PropsWithChildren } from 'react'
import { useModal } from 'src/sdk/ui/modal/Provider'

import 'src/styles/pages/layout.scss'

const CartSidebar = lazy(() => import('src/components/cart/CartSidebar'))

function Layout({ children }: PropsWithChildren<unknown>) {
  const { displayMinicart } = useUI()
  const { isRegionalizationModalOpen, setIsRegionalizationModalOpen } =
    useModal()

  return (
    <>
      <div id="layout">
        <Navbar />

        <main>{children}</main>

        <Footer />

        <Toast />

        {displayMinicart && (
          <Suspense fallback={null}>
            <CartSidebar />
          </Suspense>
        )}
      </div>
      <RegionalizationModal
        isOpen={isRegionalizationModalOpen}
        onDismiss={() => setIsRegionalizationModalOpen(false)}
      />
    </>
  )
}

export default Layout
