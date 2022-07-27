import { gql } from '@faststore/graphql-utils'
import { useQuery } from 'src/sdk/graphql/useQuery'
import type {
  MenuCategoryQueryQueryVariables as Variables,
  MenuCategoryQueryQuery as Query,
} from '@generated/graphql'
import { useLocalizedVariables } from 'src/sdk/product/useProductsQuery'

/**
 * This query is run on the browser and contains
 * the current search state of the user
 */
export const query = gql`
  query MenuCategoryQuery($first: Int!) {
    allCollections(first: $first) {
      edges {
        node {
          type
          breadcrumbList {
            itemListElement {
              name
              item
              position
            }
          }
        }
      }
    }
  }
`

const useCategoryQuery = (first: number) => {
  const localizedVariables = useLocalizedVariables({
    first,
  })

  return useQuery<Query, Variables>(query, localizedVariables)
}

export default useCategoryQuery
