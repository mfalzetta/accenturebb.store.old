import { navigate } from 'gatsby'

export type SkuVariantsByName = Record<
  string,
  Array<{ alt: string; src: string; label: string; value: string }>
>

export function getSkuSlug(
  slugsMap: Record<string, string>,
  selectedVariations: Record<string, string>,
  dominantVariation: string
) {
  const slugsMapKey = Object.entries(selectedVariations).flat().join('-')

  if (slugsMapKey in slugsMap) {
    return slugsMap[slugsMapKey]
  }

  const possibleVariants = Object.keys(slugsMap)

  const variant = Object.keys(selectedVariations)
  const selectedValue = variant[0]
    ? `${variant[0]}-${selectedVariations[variant[0]]}`
    : `${dominantVariation}-${selectedVariations[dominantVariation]}`

  const firstVariationForDominantValue = possibleVariants.find((slug) =>
    slug.includes(selectedValue)
  )

  return slugsMap[firstVariationForDominantValue ?? possibleVariants[0]]
}

export function navigateToSku({
  slugsMap,
  dominantSku,
  selectorsState,
  updatedVariationName,
  updatedVariationValue,
}: {
  dominantSku: string
  slugsMap: Record<string, string>
  selectorsState: Record<string, string>
  updatedVariationName: string
  updatedVariationValue: string
}) {
  const whereTo = `/${getSkuSlug(
    slugsMap,
    {
      ...selectorsState,
      [updatedVariationName]: updatedVariationValue,
    },
    dominantSku
  )}/p`

  if (whereTo === window.location.pathname) {
    return
  }

  navigate(whereTo)
}
