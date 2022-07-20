import { memo } from 'react'
import { useDiscountPercent } from 'src/sdk/product/useDiscountPercent'

import Badge from './Badge'

export type DiscountBadgeProps = {
  listPrice: number
  spotPrice: number
  big?: boolean
  galleryList?: boolean
  // Set limit percentage value to consider a low discount.
  thresholdLow?: number
  // Set limit percentage value to consider a high discount
  thresholdHigh?: number
}

const DiscountBadge = ({
  listPrice,
  spotPrice,
  big = false,
  thresholdLow = 15,
  thresholdHigh = 40,
  galleryList,
}: DiscountBadgeProps) => {
  const discountPercent = useDiscountPercent(listPrice, spotPrice)

  if (discountPercent === 0) {
    return <></>
  }

  const discountVariant =
    discountPercent <= thresholdLow
      ? 'low'
      : discountPercent <= thresholdHigh
      ? 'medium'
      : 'high'

  return (
    <Badge
      big={big}
      data-fs-discount-badge-variant={discountVariant}
      galleryList={galleryList}
    >
      {discountPercent}% off
    </Badge>
  )
}

export default memo(DiscountBadge)
