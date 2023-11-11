import { gql } from '@apollo/client'

export const GQL_GET_INITIAL_DESO_DATA = gql`
  query AccountByPublicKey($publicKey: String!, $tokenBalancesAsCreatorFilter: TokenBalanceFilter) {
    accountByPublicKey(publicKey: $publicKey) {
      tokenBalancesAsCreator(filter: $tokenBalancesAsCreatorFilter) {
        nodes {
          balanceNanos
          isDaoCoin
        }
      }
    }
  }
`

export const GQL_GET_HODLERS = gql`
  query AccountByPublicKey($publicKey: String!, $tokenBalancesAsCreatorFilter: TokenBalanceFilter) {
    accountByPublicKey(publicKey: $publicKey) {
      tokenBalancesAsCreator(filter: $tokenBalancesAsCreatorFilter) {
        nodes {
          balanceNanos
          isDaoCoin
          holder {
            username
            publicKey
          }
        }
      }
    }
  }
`
