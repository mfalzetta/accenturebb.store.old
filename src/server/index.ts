/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable  @typescript-eslint/no-explicit-any */
import {
  envelop,
  useExtendContext,
  useMaskedErrors,
  useSchema,
} from '@envelop/core'
import { useParserCache } from '@envelop/parser-cache'
import { useValidationCache } from '@envelop/validation-cache'
import {
  getContextFactory,
  getSchema,
  getTypeDefs,
  isFastStoreError,
} from '@faststore/api'
import { GraphQLError } from 'graphql'
import type { FormatErrorHandler } from '@envelop/core'
import type { Options as APIOptions, Scalars } from '@faststore/api'
import { mergeTypeDefs } from '@graphql-tools/merge'
import { makeExecutableSchema, mergeSchemas } from '@graphql-tools/schema'
// import { loadFilesSync } from '@graphql-tools/load-files'
import axios from 'axios'

import persisted from '../../@generated/graphql/persisted.json'
import storeConfig, { api } from '../../store.config'
import secrets from '../../secrets.hidden.json'

interface ExecuteOptions {
  operationName: string
  variables: Record<string, unknown>
  query?: string | null
}
type ShippingVariable = {
  country: string
  items: Array<{
    id: string
    quantity: string
    seller: string
  }>
  postalCode: string
}

type WishlistVariable = {
  email: string
  productIds: string
  id?: string
}

type GetWishListT = {
  email: string
}

type GetWishListProductsT = {
  productIds: string
}
interface InstallmentProps {
  Value: number
  InterestRate: number
  TotalValuePlusInterestRate: number
  NumberOfInstallments: number
  Name: string
  PaymentSystemName: string
}

// const typesArray = loadFilesSync('./src/server', {
//   extensions: ['gql'],
// })

// const typeDefsFromfile = mergeTypeDefs(typesArray)

const persistedQueries = new Map(Object.entries(persisted))
const apiOptions: APIOptions = {
  platform: storeConfig.platform as APIOptions['platform'],
  account: storeConfig.api.storeId,
  environment: storeConfig.api.environment as APIOptions['environment'],
  hideUnavailableItems: storeConfig.api.hideUnavailableItems,
  channel: storeConfig.session.channel,
  locale: storeConfig.session.locale,
  // flags: {
  //   enableOrderFormSync: true,
  // },
}

const apiSchemaOld = getSchema(apiOptions)

const apiContextFactory = getContextFactory(apiOptions)

export interface Seller {
  sellerId: string
  sellerName: string
  addToCartLink: string
  sellerDefault: boolean
  commertialOffer: Scalars['ObjectOrString']
}

const typeDefs = `
  type Installment {
    Value: Float!
    InterestRate: Float!
    TotalValuePlusInterestRate: Float!
    NumberOfInstallments: Float!
    PaymentSystemName: String!
    PaymentSystemGroupName: String!
    Name: String!
  }
  type DiscountHighlight {
    name: String!
  }

  type CommertialOffer {
    Installments: [Installment!]
    Price: Float
    ListPrice: Float
    discountHighlights: [DiscountHighlight!]
  }

  type Seller {
    sellerId: String
    sellerName: String
    addToCartLink: String
    sellerDefault: Boolean!
    commertialOffer: CommertialOffer
  }

  type Specification {
    originalName: String
    name: String
    values: [String]
  }

  type SpecificationGroup {
    originalName: String
    name: String
    specifications: [Specification]
  }

  extend type StoreProduct {
    Sellers: [Seller!]
    specificationGroups: [SpecificationGroup!]
  }
  type LogisticsItem {
    id: String
    requestIndex: Int
    quantity: Int
    seller: String
    sellerChain: [String]
    tax: Int
    priceValidUntil: String
    price: Int
    listPrice: Int
    rewardValue: Int
    sellingPrice: Int
    measurementUnit: String
    unitMultiplier: Int
    availability: String
  }
  
  type MessageFields {
    itemIndex: String
    ean: String
    skuName: String
  }
  
  type MessageInfo {
    code: String
    text: String
    status: String
    fields: MessageFields
  }
  
  type DeliveryIds {
    courierId: String
    warehouseId: String
    dockId: String
    courierName: String
    quantity: Int
  }
  
  type PickupAddress {
    addressType: String
    receiverName: String
    addressId: String
    postalCode: String
    city: String
    state: String
    country: String
    street: String
    number: String
    neighborhood: String
    complement: String
    reference: String
    geoCoordinates: [Float]
  }
  
  type pickupStoreInfo {
    friendlyName: String
    address: PickupAddress
    additionalInfo: String
    dockId: String
    isPickupStore: Boolean
  }
  
  type ShippingSLA {
    id: String
    name: String
    price: Float
    shippingEstimate: String
    shippingEstimateDate: String
    deliveryIds: [DeliveryIds]
    deliveryChannel: String
    friendlyName: String
    pickupPointId: String
    pickupStoreInfo: pickupStoreInfo
    pickupDistance: Float
  }
  
  type LogisticsInfo {
    itemIndex: String
    selectedSla: String
    slas: [ShippingSLA]
  }

  type NewsLetterData {
    id: String
  }
  
  type ShippingData {
    items: [LogisticsItem]
    logisticsInfo: [LogisticsInfo]
    messages: [MessageInfo]
  }

  type WishlistData {
    email: String
    productIds: String
    id: String
  }

  type WishlistDataMutation {
    message: String
  }

  input ShippingItem {
    id: String
    quantity: String
    seller: String
  }

  type WishListProductsData {
    productId: String
    productName: String
    link: String
    image: String
    price: String
    listPrice: String,
    brand: String,
    allInstallment: [Installment!]
    discountHighlights: [DiscountHighlight]
  }

  type Query {
    shipping(
      postalCode: String
      geoCoordinates: [String]
      country: String
      items: [ShippingItem]
    ): ShippingData

    newsLetter(email:String!):NewsLetterData
    getWishlist(email: String): WishlistData
    getWishListProducts(productIds: String): [WishListProductsData]
  }

  type Mutation {
    newsLetterUpdate(email:String!, id:String): NewsLetterData
    setWishlist(
      email: String
      productIds: String
      id: String
    ): WishlistDataMutation
  }
`

const resolvers = {
  StoreProduct: {
    Sellers: (root: any) => {
      return root.sellers
    },

    specificationGroups: (root: any) => {
      return root.isVariantOf.specificationGroups
    },
  },
  Query: {
    shipping,
    getWishlist,
    getWishListProducts,
    newsLetter,
  },
  Mutation: {
    setWishlist,
    newsLetterUpdate,
  },
}

const mergedTypeDefs = mergeTypeDefs([
  getTypeDefs(),
  typeDefs,
  // typeDefsFromfile,
])

const getMergedSchemas = async () =>
  mergeSchemas({
    schemas: [
      await apiSchemaOld,
      makeExecutableSchema({
        resolvers,
        typeDefs: mergedTypeDefs,
      }),
    ],
  })

export const apiSchema = getMergedSchemas()
const formatError: FormatErrorHandler = (err) => {
  if (err instanceof GraphQLError && isFastStoreError(err.originalError)) {
    return err
  }

  console.error(err)

  return new GraphQLError('Sorry, something went wrong.')
}

const getEnvelop = async () =>
  envelop({
    plugins: [
      useSchema(await getMergedSchemas()),
      useExtendContext(apiContextFactory),
      useMaskedErrors({ formatError }),
      useValidationCache(),
      useParserCache(),
    ],
  })

const envelopPromise = getEnvelop()

export const execute = async (
  options: ExecuteOptions,
  envelopContext = { req: { headers: {} } }
) => {
  const { operationName, variables, query: maybeQuery } = options
  const query = maybeQuery ?? persistedQueries.get(operationName)

  const {
    req: { headers },
  } = envelopContext

  if (query == null) {
    throw new Error(`No query found for operationName: ${operationName}`)
  }

  const enveloped = await envelopPromise
  const {
    parse,
    contextFactory,
    execute: run,
    schema,
  } = enveloped(envelopContext)

  return run({
    schema,
    document: parse(query),
    variableValues: variables,
    contextValue: await contextFactory({ headers }),
    operationName,
  })
}

async function shipping(
  _: unknown,
  { country, items, postalCode }: ShippingVariable
) {
  const { data } = await axios.post(
    `https://${api.storeId}.${api.environment}.com.br/api/checkout/pub/orderForms/simulation?RnbBehavior=0&sc=1`,
    { country, items, postalCode }
  )

  if (!data) {
    return new GraphQLError(
      'Não foi possivel calcular o frete para esse produto'
    )
  }

  return data
}

async function getWishlist(_: unknown, { email }: GetWishListT) {
  const { data } = await axios.get(
    `https://${api.storeId}.${api.environment}.com.br/api/dataentities/WS/search?email=${email}&_fields=_all`,
    {
      headers: {
        'X-VTEX-API-AppKey': process.env.API_KEY ?? secrets.API_KEY,
        'X-VTEX-API-AppToken': process.env.API_TOKEN ?? secrets.API_TOKEN,
        'Content-Type': 'application/json',
        Accept: 'application/json',
        'REST-Range': 'resources=0-10',
      },
    }
  )

  if (!data) {
    return new GraphQLError('Não foi possivel ver a wishlist desse usuario')
  }

  return data[0]
}

async function setWishlist(
  _: unknown,
  { email, productIds, id }: WishlistVariable
) {
  const { status } = await axios.put(
    id
      ? `https://${api.storeId}.${api.environment}.com.br/api/dataentities/WS/documents/${id}`
      : `https://${api.storeId}.${api.environment}.com.br/api/dataentities/WS/documents`,
    {
      email,
      productIds,
    },
    {
      headers: {
        'X-VTEX-API-AppKey': process.env.API_KEY ?? secrets.API_KEY,
        'X-VTEX-API-AppToken': process.env.API_TOKEN ?? secrets.API_TOKEN,
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
    }
  )

  if (status === 201 || status === 200 || status === 204) {
    return { message: 'Sucesso' }
  }

  return new GraphQLError('Não foi adicionar esse produto na Wishlist')
}

async function getWishListProducts(
  _: unknown,
  { productIds }: GetWishListProductsT
) {
  let path = ''

  const ObjProductsIds = JSON.parse(productIds)

  if (!ObjProductsIds) {
    return new GraphQLError('Houve um erro com sua lista de produtos')
  }

  ObjProductsIds.forEach((refId: string) => {
    path = `${path}&fq=productId:${refId}`
  })

  const { data } = await axios.get(
    `https://${api.storeId}.${api.environment}.com.br/api/catalog_system/pub/products/search?_from=0&_to=19${path}`,
    {
      headers: {
        'X-VTEX-API-AppKey': process.env.API_KEY ?? secrets.API_KEY,
        'X-VTEX-API-AppToken': process.env.API_TOKEN ?? secrets.API_TOKEN,
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
    }
  )

  if (data) {
    // there is any here because the result of this API is super big.
    const ObjetosProntos = data.map((item: any) => {
      const sellerD = item.items[0].sellers.filter(
        (element: any) => element?.sellerDefault === true
      )

      const installments = sellerD?.map(
        (el: any) => el?.commertialOffer?.Installments
      )

      const allInstallment: InstallmentProps[][] = []

      const BasediscountHighlights = sellerD
        ?.map((el: any) => el?.commertialOffer.DiscountHighLight)
        .flat()

      const discountHighlights = BasediscountHighlights.map((el: any) => {
        return { name: Object.values(el).toString() }
      })

      installments?.forEach((element: any) => {
        if (element !== undefined && element !== null) {
          allInstallment.push(element)
        }
      })

      const { pathname } = new URL(item?.link)

      return {
        productId: item.productId,
        productName: item.productName,
        link: pathname,
        image: item.items[0].images[0]?.imageUrl,
        listPrice: item.items[0].sellers[0]?.commertialOffer?.ListPrice,
        price: item.items[0].sellers[0]?.commertialOffer?.Price,
        brand: item.brand,
        allInstallment: allInstallment.flat(),
        discountHighlights,
      }
    })

    return ObjetosProntos
  }

  return new GraphQLError('Não consultar os produtos da wishlist')
}

type NewsLetterVariable = {
  email: string
  id: string
}

async function newsLetter(_: unknown, { email }: NewsLetterVariable) {
  const { data } = await axios.get(
    `https://${api.storeId}.${api.environment}.com.br/api/dataentities/CL/search?email=${email}&_fields=id`,
    {
      headers: {
        'content-type': 'application/json',
        'X-VTEX-API-APPTOKEN': process.env.API_TOKEN ?? secrets.API_TOKEN,
        'X-VTEX-API-APPKEY': process.env.API_KEY ?? secrets.API_KEY,
      },
    }
  )

  if (!data) {
    return new GraphQLError('Error get newsletter')
  }

  return data[0]
}

async function newsLetterUpdate(_: unknown, { email, id }: NewsLetterVariable) {
  const data = id
    ? {
        isNewsletterOptIn: true,
      }
    : {
        isNewsletterOptIn: true,
        email,
      }

  try {
    await axios.patch(
      `https://${api.storeId}.${api.environment}.com.br/api/dataentities/CL/documents/${id}`,
      data,
      {
        headers: {
          'content-type': 'application/json',
          'X-VTEX-API-APPTOKEN': process.env.API_TOKEN ?? '',
          'X-VTEX-API-APPKEY': process.env.API_KEY ?? '',
        },
      }
    )
  } catch (error) {
    return new GraphQLError(`Error newsletter: ${error}`)
  }

  return { id }
}
