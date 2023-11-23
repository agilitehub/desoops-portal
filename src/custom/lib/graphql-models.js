import { gql } from '@apollo/client'

export const GQL_GET_INITIAL_DESO_DATA = gql`
  query AccountByPublicKey($publicKey: String!) {
    accountByPublicKey(publicKey: $publicKey) {
      tokenBalancesAsCreator {
        nodes {
          balanceNanos
          isDaoCoin
          holder {
            username
            publicKey
            transactionStats {
              latestTransactionTimestamp
            }
          }
        }
      }
      tokenBalances {
        nodes {
          isDaoCoin
          balanceNanos
          creator {
            username
            publicKey
            transactionStats {
              latestTransactionTimestamp
            }
          }
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
