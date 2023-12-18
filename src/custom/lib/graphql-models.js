import { gql } from '@apollo/client'

export const GQL_GET_INITIAL_DESO_DATA_OLD = gql`
  query AccountByPublicKey($publicKey: String!, $orderBy: [TokenBalancesOrderBy!]) {
    accountByPublicKey(publicKey: $publicKey) {
      publicKey
      username
      desoBalance {
        balanceNanos
      }
      tokenBalancesAsCreator(orderBy: $orderBy) {
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

export const GQL_GET_INITIAL_DESO_DATA = gql`
  query AccountByPublicKey($publicKey: String!) {
    accountByPublicKey(publicKey: $publicKey) {
      publicKey
      username
      desoBalance {
        balanceNanos
      }
      tokenBalances {
        nodes {
          isDaoCoin
          balanceNanos
          creator {
            username
            publicKey
          }
        }
      }
    }
  }
`

export const SEARCH_PROFILES = gql`
  query Profiles($filter: ProfileFilter, $first: Int!, $orderBy: [ProfilesOrderBy!]) {
    profiles(filter: $filter, first: $first, orderBy: $orderBy) {
      nodes {
        username
        publicKey
        account {
          transactionStats {
            latestTransactionTimestamp
          }
        }
      }
    }
  }
`

export const GET_HODLERS = gql`
  query AccountByPublicKey($publicKey: String!, $filter: TokenBalanceFilter, $orderBy: [TokenBalancesOrderBy!]) {
    accountByPublicKey(publicKey: $publicKey) {
      tokenBalancesAsCreator(filter: $filter, orderBy: $orderBy) {
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

export const GET_NFT_POST = gql`
  query Profiles($filter: NftFilter, $first: Int) {
    nfts(filter: $filter, first: $first) {
      nodes {
        post {
          body
          imageUrls
        }
        id
      }
    }
  }
`

export const GET_NFT_ENTRIES = gql`
  query Profiles($filter: NftFilter) {
    nfts(filter: $filter) {
      nodes {
        owner {
          username
          publicKey
          transactionStats {
            latestTransactionTimestamp
          }
        }
      }
    }
  }
`

export const GET_FOLLOWERS = gql`
  query AccountByPublicKey($publicKey: String!) {
    accountByPublicKey(publicKey: $publicKey) {
      followers {
        nodes {
          follower {
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

export const GET_FOLLOWING = gql`
  query AccountByPublicKey($publicKey: String!) {
    accountByPublicKey(publicKey: $publicKey) {
      following {
        nodes {
          followee {
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
