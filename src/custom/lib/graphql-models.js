import { gql } from '@apollo/client'

export const GQL_GET_INITIAL_DESO_DATA = gql`
  query AccountByPublicKey($publicKey: String!) {
    accountByPublicKey(publicKey: $publicKey) {
      publicKey
      username
      desoBalance {
        balanceNanos
      }
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

export const SEARCH_PROFILES = gql`
  query Profiles($filter: ProfileFilter, $first: Int!) {
    profiles(filter: $filter, first: $first) {
      nodes {
        username
        publicKey
      }
    }
  }
`

export const GET_HODLERS = gql`
  query AccountByPublicKey($publicKey: String!, $filter: TokenBalanceFilter) {
    accountByPublicKey(publicKey: $publicKey) {
      tokenBalancesAsCreator(filter: $filter) {
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
    }
  }
`
