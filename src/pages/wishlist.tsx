import { GatsbySeo } from 'gatsby-plugin-next-seo'
import useWishlist from 'src/data/hook/useWishlist'
import { useWishListProductsQuery } from 'src/components/Wishlist/useWishlistQuery'
import { useSession } from 'src/sdk/session'
import WishListDetails from 'src/components/Wishlist/WishListDetails/WishListDetails'

function Page() {
  const wishlistData = useWishlist()
  const ctxProductId = JSON.stringify(wishlistData?.productIds)
  const { locale } = useSession()
  const { data } = useWishListProductsQuery(ctxProductId)

  const products = data?.getWishListProducts

  const title = 'Pagina de Favoritos'
  const description = 'Pagina de Favoritos'
  const canonical = '/wishlist'

  return (
    <>
      <GatsbySeo
        title={title}
        description={description}
        canonical={canonical}
        language={locale}
      />
      <div data-fs-wishlist>
        <div data-fs-wishlist-content>
          <div data-fs-wishlist-header>
            <span data-fs-wishlist-title>Favoritos</span>
          </div>
          <WishListDetails products={products} />
        </div>
      </div>
    </>
  )
}

export default Page
