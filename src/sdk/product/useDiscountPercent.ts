import { useMemo } from 'react'

export const useDiscountPercent = (listPrice: number, spotPrice: number) => {
  return useMemo(() => {
    const diff = listPrice - spotPrice
    const discount = (diff * 100) / listPrice

    return Math.round(discount)
  }, [spotPrice, listPrice])
}

export const useDiscountValue = (listPrice: number, spotPrice: number) => {
  return useMemo(() => {
    const diff = listPrice - spotPrice

    return Math.round(diff)
  }, [spotPrice, listPrice])
}
