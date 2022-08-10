import { sendAnalyticsEvent, useSession } from '@faststore/sdk'
import { graphql, navigate } from 'gatsby'
import { useEffect, useMemo, useState } from 'react'
import { DiscountBadge } from 'src/components/ui/Badge'
import Breadcrumb from 'src/components/ui/Breadcrumb'
import { ButtonBuy } from 'src/components/ui/Button'
import { ImageGallery } from 'src/components/ui/ImageGallery'
import Price from 'src/components/ui/Price'
import ProductTitle from 'src/components/ui/ProductTitle'
import QuantitySelector from 'src/components/ui/QuantitySelector'
import { useBuyButton } from 'src/sdk/cart/useBuyButton'
import { useFormattedPrice } from 'src/sdk/product/useFormattedPrice'
import { useProduct } from 'src/sdk/product/useProduct'
import type { ProductDetailsFragment_ProductFragment } from '@generated/graphql'
import type { CurrencyCode, ViewItemEvent } from '@faststore/sdk'
import type { AnalyticsItem } from 'src/sdk/analytics/types'
import OutOfStock from 'src/components/product/OutOfStock'
import SkuSelector from 'src/components/ui/SkuSelector'
import Accordion, { AccordionItem } from 'src/components/ui/Accordion'

import Section from '../Section'
import LinksAndDownloads from './LinksAndDownloads'
import ProductSpecifications from './ProductSpecifications'

interface Props {
  product: ProductDetailsFragment_ProductFragment
}

interface TreatmentType {
  name: string
  label: string
  value: string
  src: string
  alt: string
  disabled: boolean
}

export interface AllUsableSpecsType {
  values: string[]
  originalName: string
  name: string
  others?: AllUsableSpecsType[]
}

function ProductDetails({ product: staleProduct }: Props) {
  const { currency } = useSession()
  const [addQuantity, setAddQuantity] = useState(1)
  const [indexes, setIndexes] = useState([0])

  // Stale while revalidate the product for fetching the new price etc
  const { data, isValidating } = useProduct(staleProduct.id, {
    product: staleProduct,
  })

  if (!data) {
    throw new Error('NotFound')
  }

  const {
    product: {
      id,
      sku,
      gtin,
      description,
      name: variantName,
      brand,
      isVariantOf,
      isVariantOf: { productGroupID: productId },
      image: productImages,
      offers: {
        offers: [{ availability, price, listPrice, seller }],
        lowPrice,
      },
      breadcrumbList: breadcrumbs,
      additionalProperty,
    },
  } = data

  const buyDisabled = availability !== 'https://schema.org/InStock'

  const buyProps = useBuyButton({
    id,
    price,
    listPrice,
    seller,
    quantity: addQuantity,
    itemOffered: {
      sku,
      name: variantName,
      gtin,
      image: productImages,
      brand,
      isVariantOf,
      additionalProperty,
    },
  })

  useEffect(() => {
    sendAnalyticsEvent<ViewItemEvent<AnalyticsItem>>({
      name: 'view_item',
      params: {
        currency: currency.code as CurrencyCode,
        value: price,
        items: [
          {
            item_id: isVariantOf.productGroupID,
            item_name: isVariantOf.name,
            item_brand: brand.name,
            item_variant: sku,
            price,
            discount: listPrice - price,
            currency: currency.code as CurrencyCode,
            item_variant_name: variantName,
            product_reference_id: gtin,
          },
        ],
      },
    })
  }, [
    isVariantOf.productGroupID,
    isVariantOf.name,
    brand.name,
    sku,
    price,
    listPrice,
    currency.code,
    variantName,
    gtin,
  ])

  const cor = data?.product?.additionalProperty[0]?.value
  const tamanho = data?.product?.additionalProperty[1]?.value
  const firstOptionName = data?.product?.additionalProperty[0]?.name

  const findDisable = data?.product?.isVariantOf?.hasVariant
    .map((element) => {
      return (
        element.additionalProperty.filter((el) => el.value === cor).length >
          0 && element.additionalProperty
      )
    })
    .filter((el) => el)
    .flat()

  const defaultSelected = data?.product?.isVariantOf?.hasVariant
    .map((element) => {
      const findColor = element.additionalProperty.filter(
        (el) => el.value === cor
      )

      const findSize = element.additionalProperty.filter(
        (el) => el.value === tamanho
      )

      if (findColor.length > 0 && findSize.length > 0) {
        return element.additionalProperty.map((el) => el.value)
      }

      return undefined
    })
    .filter((el) => el)
    .flat()

  const treatment = data?.product?.isVariantOf?.hasVariant
    .reduce((acumulador: TreatmentType[], elemento) => {
      let newItem: TreatmentType[] = []

      elemento?.additionalProperty.forEach((item) => {
        if (
          acumulador?.filter((el) => el?.label === item?.value).length === 0
        ) {
          newItem = [
            ...newItem,
            {
              name: item?.name?.toString(),
              label: item?.value?.toString(),
              value: item?.value?.toString(),
              src: elemento?.image[0]?.url,
              alt: elemento?.image[0]?.alternateName,
              disabled:
                data?.product?.additionalProperty[0]?.name === item?.name
                  ? false
                  : findDisable?.filter((el: any) => el?.value === item?.value)
                      ?.length === 0,
            },
          ]
        }
      })

      return [...acumulador, ...newItem]
    }, [])
    .sort((a, b) => (a.value < b.value ? -1 : a.value > b.value ? 1 : 0))

  function handleChange(params: React.FormEvent<HTMLInputElement>) {
    const param = params?.currentTarget?.value
    const findBySize = data?.product?.isVariantOf?.hasVariant
      .map((element) =>
        element.additionalProperty.map((el) => {
          if (
            el?.name === firstOptionName &&
            el?.value !== cor &&
            el?.value === param
          ) {
            return element?.slug
          }

          return undefined
        })
      )
      .flat()
      .filter((el) => el)

    if (findBySize && findBySize?.length > 0) {
      navigate(`/${findBySize[0]}/p`)
    } else {
      const filterByColor = data?.product?.isVariantOf?.hasVariant
        .map((element) =>
          element?.additionalProperty.map((el) => {
            if (el?.value === cor) {
              return element
            }

            return undefined
          })
        )
        .flat()
        .filter((el) => el)

      const slugByColor = filterByColor
        ?.map((item) => {
          if (item) {
            return (
              item?.additionalProperty?.filter((el) => el?.value === param)
                ?.length > 0 && item?.slug
            )
          }

          return undefined
        })
        .filter((el) => el)

      if (slugByColor) {
        navigate(`/${slugByColor[0]}/p`)
      }
    }
  }

  const specs = useMemo(() => {
    return data?.product?.specificationGroups?.filter(
      (item) => item.name !== 'allSpecifications'
    )
  }, [data?.product?.specificationGroups])

  const allUsableSpecs = useMemo(() => {
    const obj = specs
      ?.reduce((acumulador: AllUsableSpecsType[] | any, spec) => {
        const allSpecs = spec?.specifications?.map((element) => element)

        const links = allSpecs?.filter((el) => el?.name === 'Links e Downloads')

        const details = allSpecs?.filter(
          (el) => el?.name === 'Características e Detalhes'
        )

        const others = allSpecs?.filter(
          (el) =>
            el?.name !== 'Características e Detalhes' &&
            el?.name !== 'Links e Downloads'
        )

        const especificacoes = others?.length
          ? { name: 'Especificações', others }
          : []

        if (especificacoes && links && details) {
          return [...acumulador, ...details, ...links, especificacoes]
        }

        return [...acumulador]
      }, [])
      .flat()
      .sort((a: { name: number }, b: { name: number }) =>
        a.name < b.name ? -1 : a.name > b.name ? 1 : 0
      )

    return obj
  }, [specs])

  // const allUsableSpecs = specs
  //   ?.reduce((acumulador: AllUsableSpecsType[] | any, spec) => {
  //     const allSpecs = spec?.specifications?.map((element) => element)

  //     const links = allSpecs?.filter((el) => el?.name === 'Links e Downloads')

  //     const details = allSpecs?.filter(
  //       (el) => el?.name === 'Características e Detalhes'
  //     )

  //     const others = allSpecs?.filter(
  //       (el) =>
  //         el?.name !== 'Características e Detalhes' &&
  //         el?.name !== 'Links e Downloads'
  //     )

  //     const especificacoes = others?.length
  //       ? { name: 'Especificações', others }
  //       : []

  //     if (especificacoes && links && details) {
  //       return [...acumulador, ...details, ...links, especificacoes]
  //     }

  //     return [...acumulador]
  //   }, [])
  //   .flat()
  //   .sort((a: { name: number }, b: { name: number }) =>
  //     a.name < b.name ? -1 : a.name > b.name ? 1 : 0
  //   )

  useEffect(() => {
    const indexs = allUsableSpecs?.map((_: null, index: number) => index)

    setIndexes(indexs)
  }, [allUsableSpecs])

  return (
    <Section className="product-details layout__content-full layout__section">
      <Breadcrumb breadcrumbList={breadcrumbs.itemListElement} />

      <section className="product-details__body">
        <header className="product-details__title">
          <ProductTitle title={<h1>{variantName}</h1>} refNumber={productId} />
        </header>

        <ImageGallery images={productImages} />
        {additionalProperty.map((property, index: number) => (
          <SkuSelector
            key={index}
            options={treatment?.filter((el) => el.name === property.name)}
            variant={property.name === 'Cor' ? 'image' : 'label'}
            label={property.name}
            defaultSku={defaultSelected.length ? defaultSelected[index] : cor}
            onChange={(e) => handleChange(e)}
          />
        ))}

        <section className="product-details__settings">
          <section className="product-details__values">
            <div className="product-details__prices">
              {listPrice !== lowPrice && (
                <div className="product-details__prices--badge">
                  <Price
                    value={listPrice}
                    formatter={useFormattedPrice}
                    testId="list-price"
                    data-value={listPrice}
                    variant="listing"
                    classes="text__legend"
                    SRText="Original price:"
                  />
                  <DiscountBadge listPrice={listPrice} spotPrice={lowPrice} />
                </div>
              )}

              <Price
                value={lowPrice}
                formatter={useFormattedPrice}
                testId="price"
                data-value={lowPrice}
                variant="spot"
                classes="text__lead"
                SRText="Sale Price:"
              />
            </div>
            {/* <div className="prices">
              <p className="price__old text__legend">{formattedListPrice}</p>
              <p className="price__new">{isValidating ? '' : formattedPrice}</p>
            </div> */}
            <QuantitySelector min={1} max={10} onChange={setAddQuantity} />
          </section>
          {/* NOTE: A loading skeleton had to be used to avoid a Lighthouse's
              non-composited animation violation due to the button transitioning its
              background color when changing from its initial disabled to active state.
              See full explanation on commit https://git.io/JyXV5. */}
          {isValidating ? (
            <AddToCartLoadingSkeleton />
          ) : (
            <ButtonBuy disabled={buyDisabled} {...buyProps}>
              adicionar ao carrinho
            </ButtonBuy>
          )}
          {!availability && (
            <OutOfStock
              onSubmit={(email) => {
                console.info(email)
              }}
            />
          )}
        </section>

        <section className="product-details__content">
          <article className="product-details__description">
            <h2 className="text__title-subsection">Informações do produto</h2>
            <p className="text__body">{description}</p>
          </article>
          <article>
            <Accordion expandedIndices={indexes} onChange={() => {}}>
              {allUsableSpecs.map((spec: AllUsableSpecsType, index: number) => {
                const isExpanded =
                  indexes.filter((el) => el === index).length > 0

                return (
                  <AccordionItem
                    key={index}
                    isExpanded={isExpanded}
                    buttonLabel={spec.name}
                    onClick={() =>
                      !isExpanded
                        ? setIndexes([...indexes, index])
                        : setIndexes(indexes.filter((el) => el !== index))
                    }
                    itemType="normal"
                  >
                    {spec.name === 'Links e Downloads' && (
                      <LinksAndDownloads values={spec.values} />
                    )}
                    {spec.name === 'Características e Detalhes' && (
                      <span> {spec.values} </span>
                    )}
                    {spec.name === 'Especificações' && (
                      <ProductSpecifications specifications={spec.others} />
                    )}
                  </AccordionItem>
                )
              })}
            </Accordion>
          </article>
        </section>
      </section>
    </Section>
  )
}

function AddToCartLoadingSkeleton() {
  // Generated via https://skeletonreact.com/.
  return (
    <svg
      role="img"
      width="100%"
      height="48"
      aria-labelledby="loading-aria"
      viewBox="0 0 112 48"
      preserveAspectRatio="none"
    >
      <title id="loading-aria">Loading...</title>
      <rect
        x="0"
        y="0"
        width="100%"
        height="100%"
        clipPath="url(#clip-path)"
        style={{ fill: 'url("#fill")' }}
      />
      <defs>
        <clipPath id="clip-path">
          <rect x="0" y="0" rx="2" ry="2" width="112" height="48" />
        </clipPath>
        <linearGradient id="fill">
          <stop offset="0.599964" stopColor="#f3f3f3" stopOpacity="1">
            <animate
              attributeName="offset"
              values="-2; -2; 1"
              keyTimes="0; 0.25; 1"
              dur="2s"
              repeatCount="indefinite"
            />
          </stop>
          <stop offset="1.59996" stopColor="#ecebeb" stopOpacity="1">
            <animate
              attributeName="offset"
              values="-1; -1; 2"
              keyTimes="0; 0.25; 1"
              dur="2s"
              repeatCount="indefinite"
            />
          </stop>
          <stop offset="2.59996" stopColor="#f3f3f3" stopOpacity="1">
            <animate
              attributeName="offset"
              values="0; 0; 3"
              keyTimes="0; 0.25; 1"
              dur="2s"
              repeatCount="indefinite"
            />
          </stop>
        </linearGradient>
      </defs>
    </svg>
  )
}

export const fragment = graphql`
  fragment ProductDetailsFragment_product on StoreProduct {
    id: productID
    sku
    name
    gtin
    description
    specificationGroups {
      name
      originalName
      specifications {
        values
        originalName
        name
      }
    }
    isVariantOf {
      productGroupID
      name
      hasVariant {
        additionalProperty {
          name
          propertyID
          value
          valueReference
        }
        slug
        image {
          url
          alternateName
        }
      }
    }
    image {
      url
      alternateName
    }
    brand {
      name
    }
    offers {
      lowPrice
      offers {
        availability
        price
        listPrice
        seller {
          identifier
        }
      }
    }
    breadcrumbList {
      itemListElement {
        item
        name
        position
      }
    }
    additionalProperty {
      propertyID
      name
      value
      valueReference
    }
  }
`

export default ProductDetails
