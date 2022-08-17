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
  flags: {
    enableOrderFormSync: true,
  },
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
  
  type ShippingData {
    items: [LogisticsItem]
    logisticsInfo: [LogisticsInfo]
    messages: [MessageInfo]
  }

  input ShippingItem {
    id: String
    quantity: String
    seller: String
  }
  
  type Query {
    shipping(
      postalCode: String
      geoCoordinates: [String]
      country: String
      items: [ShippingItem]
    ): ShippingData
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
