import { gql } from '@apollo/client'

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
          creatorPkid
          creator {
            username
            transactionStats {
              latestTransactionTimestamp
            }
          }
        }
      }
    }
  }
`

export const GQL_GET_TOKEN_HOLDERS = gql`
  query AccountByPublicKey($publicKey: String!, $orderBy: [TokenBalancesOrderBy!], $condition: TokenBalanceCondition) {
    accountByPublicKey(publicKey: $publicKey) {
      tokenBalancesAsCreator(orderBy: $orderBy, condition: $condition) {
        nodes {
          balanceNanos
          isDaoCoin
          hodlerPkid
          holder {
            username
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
  query Profiles($filter: ProfileFilter, $first: Int, $orderBy: [ProfilesOrderBy!]) {
    profiles(filter: $filter, first: $first, orderBy: $orderBy) {
      nodes {
        publicKey
        username
        account {
          transactionStats {
            latestTransactionTimestamp
          }
        }
      }
    }
  }
`

export const FETCH_MULTIPLE_PROFILES = gql`
  query Profiles($filter: ProfileFilter) {
    profiles(filter: $filter) {
      nodes {
        publicKey
        username
        account {
          transactionStats {
            latestTransactionTimestamp
          }
        }
      }
    }
  }
`

export const GET_NFT_POST = gql`
  query Profiles($postHash: String!) {
    post(postHash: $postHash) {
      body
      imageUrls
      isNft
    }
  }
`

export const GET_NFT_ENTRIES = gql`
  query Profiles($condition: NftCondition) {
    nfts(condition: $condition) {
      nodes {
        ownerPkid
        owner {
          username
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
          followerPkid
          follower {
            username
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
          followedPkid
          followee {
            username
            transactionStats {
              latestTransactionTimestamp
            }
          }
        }
      }
    }
  }
`
