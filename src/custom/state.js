const desoData = {
  profile: {
    publicKey: '',
    username: '',
    profilePicUrl: '',
    desoBalance: 0,
    desoBalanceUSD: 0,
    daoBalance: 0,
    ccBalance: 0,
    totalFollowers: 0,
    totalFollowing: 0,
    totalDAOHodlers: 0,
    totalCCHodlers: 0,
    followers: [],
    following: [],
    daoHodlers: [],
    ccHodlers: []
  },
  fetchedFollowers: false,
  fetchedFollowing: false,
  desoPrice: 0
}

export const customState = () => {
  return {
    desoData
  }
}
