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
    followers: [],
    following: [],
    daoHodlers: [],
    ccHodlers: [],
    daoHodlings: [],
    ccHodlings: []
  },
  fetchedFollowers: false,
  fetchedFollowing: false,
  desoPrice: 0
}

const agiliteData = {
  transactionFeeUSD: 0,
  tips: []
}

export const customState = () => {
  return {
    isMobile: false,
    isTablet: false,
    isSmartphone: false,
    desoData,
    agiliteData
  }
}
