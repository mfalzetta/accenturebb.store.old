import { useCallback, useEffect, useRef, useState } from 'react'
import InputText from 'src/components/ui/InputText'
import { sessionStore, useSession } from 'src/sdk/session'

import './product-shipping.scss'
import useShippingQuery from './useShippingQuery'

type ShippingQueryT = {
  shippingEstimate: string | null
  price: number | null
  name: string | null
  shippingEstimateDate: string | null
  friendlyName: string | null
}
interface ItemsProps {
  seller: string
  id: string
  quantity: string
}
interface ShippingItemsProps {
  items: ItemsProps
}

const ProductShipping = ({ items }: ShippingItemsProps) => {
  const inputRef = useRef<HTMLInputElement>(null)
  const { isValidating, ...session } = useSession()
  const [errorMessage, setErrorMessage] = useState<string>('')
  const [shippingQuery, setShippingQuery] = useState<ShippingQueryT | null>(
    null
  )

  const [postalCode, setPostalCode] = useState('')

  useEffect(() => {
    if (session.postalCode) {
      setPostalCode(session?.postalCode)
    }
  }, [session.postalCode])

  const [estimatedDate, setEstimatedDate] = useState({
    day: '',
    month: '',
    weekDay: '',
  })

  const {
    data,
    error: queryError,
    isValidating: loading,
  } = useShippingQuery('BRA', [items], postalCode)

  const getDate = useCallback(() => {
    const currentDate = new Date()

    const estimate =
      data?.shipping?.logisticsInfo?.[0]?.slas?.[0]?.shippingEstimate

    if (!estimate) {
      return null
    }

    const parsed = parseInt(estimate, 10)

    currentDate.setDate(currentDate.getDate() + parsed)
    setEstimatedDate({
      day: currentDate.toLocaleDateString(undefined, { day: 'numeric' }),
      month: currentDate.toLocaleDateString('pt-BR', { month: 'long' }),
      weekDay: currentDate.toLocaleDateString('pt-BR', { weekday: 'long' }),
    })

    return true
  }, [data?.shipping?.logisticsInfo])

  useEffect(() => {
    if (data?.shipping?.logisticsInfo) {
      setShippingQuery(data?.shipping?.logisticsInfo?.[0]?.slas?.[0] ?? null)
      getDate()
    }
  }, [data, getDate])

  const handleSubmit = async () => {
    const value = inputRef?.current?.value

    if (typeof value !== 'string') {
      return
    }

    setErrorMessage('')

    try {
      if (value) {
        sessionStore.set({ ...session, postalCode: value })
      }
    } catch (error) {
      setErrorMessage('CEP inválido')
    }
  }

  useEffect(() => {
    setErrorMessage('CEP inválido')
    setTimeout(() => {
      setErrorMessage('')
    }, 1500)
  }, [queryError])

  return (
    <div data-fs-product-shipping>
      <div data-fs-product-shipping-input>
        <span className="product-shipping-title">Valor e prazo de entrega</span>
        <div>
          <InputText
            inputRef={inputRef}
            id="postal-code-input"
            error={errorMessage}
            label="CEP"
            actionable
            onSubmit={handleSubmit}
            buttonActionText="Buscar"
            onClear={() => {}}
          />
        </div>
      </div>
      {loading ? (
        <span> loading..</span>
      ) : (
        session.postalCode &&
        shippingQuery &&
        !errorMessage &&
        data && (
          <div data-fs-product-shipping-container>
            <div data-fs-product-shipping-img>
              <img src="/shipping-truck.png" alt="shipping-truck" />
            </div>

            <div data-fs-product-shipping-content>
              <span className="product-shipping-title">
                {shippingQuery?.name}
              </span>
              <span className="product-shipping-text">
                Chega até {estimatedDate?.weekDay}, {estimatedDate?.day} de{' '}
                {estimatedDate?.month} por R$ {shippingQuery?.price}
              </span>
              <a href="/#">Ver mais opções de envio</a>
            </div>
          </div>
        )
      )}
    </div>
  )
}

export default ProductShipping
