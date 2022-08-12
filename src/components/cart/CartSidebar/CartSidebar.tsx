import { List } from '@faststore/ui'
import { Badge } from 'src/components/ui/Badge'
import Button from 'src/components/ui/Button'
import Icon from 'src/components/ui/Icon'
import SlideOver from 'src/components/ui/SlideOver'
import { useCart } from 'src/sdk/cart/useCart'
import { useCheckoutButton } from 'src/sdk/cart/useCheckoutButton'
import { useUI } from 'src/sdk/ui/Provider'
import { useFadeEffect } from 'src/sdk/ui/useFadeEffect'

import CartItem from '../CartItem'
import EmptyCart from '../EmptyCart'
import OrderSummary from '../OrderSummary'

function CartSidebar() {
  const btnProps = useCheckoutButton()
  const cart = useCart()
  const { cart: displayCart, closeCart } = useUI()
  const { fade, fadeOut } = useFadeEffect()

  const { items, totalItems, isValidating, subTotal, total } = cart

  const isEmpty = items.length === 0

  return (
    <SlideOver
      fade={fade}
      isOpen={displayCart}
      onDismiss={fadeOut}
      size="partial"
      direction="rightSide"
      className="cart-sidebar"
      onTransitionEnd={() => fade === 'out' && closeCart()}
    >
      <header data-testid="cart-sidebar">
        <div className="cart-sidebar__title">
          <p className="text__lead">Carrinho</p>
          <Badge variant="info">{totalItems}</Badge>
        </div>
        <Button
          variant="tertiary"
          data-fs-button-icon
          data-testid="cart-sidebar-button-close"
          aria-label="Close Cart"
          icon={<Icon name="X" width={32} height={32} />}
          onClick={fadeOut}
        />
      </header>

      {isEmpty ? (
        <EmptyCart onDismiss={fadeOut} />
      ) : (
        <>
          <List>
            {items.map((item) => (
              <li key={item.id}>
                <CartItem item={item} />
              </li>
            ))}
          </List>

          <footer>
            <OrderSummary
              subTotal={subTotal}
              total={total}
              numberOfItems={totalItems}
              checkoutButton={
                <Button
                  variant="primary"
                  icon={
                    !isValidating && (
                      <Icon name="ArrowRight" width={18} height={18} />
                    )
                  }
                  iconPosition="right"
                  {...btnProps}
                >
                  {isValidating ? 'Carregando...' : 'Checkout'}
                </Button>
              }
            />
          </footer>
        </>
      )}
    </SlideOver>
  )
}

export default CartSidebar
