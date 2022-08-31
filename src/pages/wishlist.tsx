import { GatsbySeo } from 'gatsby-plugin-next-seo'
import WishListDetails from 'src/components/Wishlist/WishListDetails/WishListDetails'
import useWishlist from 'src/data/hook/useWishlist'
import { useWishListProductsQuery } from 'src/components/Wishlist/useWishlistQuery'
import { useSession } from 'src/sdk/session'

function Page() {
  const wishlistData = useWishlist()
  const ctxProductId = JSON.stringify(wishlistData?.productIds)
  const { locale } = useSession()
  const { data } = useWishListProductsQuery(ctxProductId)

  const products = data?.getWishListProducts

  if (!products) {
    return <div> Loading...</div>
  }

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

      <WishListDetails products={products} />
    </>
  )
}

export default Page
