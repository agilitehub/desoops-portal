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
  desoPrice: 0,
  diamondLevels: null
}

const configData = {
  feePerTransactionUSD: 0,
  desoGasFeesSendDESONanos: 0,
  desoGasFeesSendDAONanos: 0,
  desoGasFeesSendCCNanos: 0,
  tips: [],
  optOutTemplate: '',
  optOutProfile: null,
  userProfile: null
}

const userAgent = {
  isMobile: false,
  isTablet: false,
  isSmartphone: false
}

const leftMenu = {
  open: false,
  activeMenu: 'home'
}

export const customState = () => {
  return {
    desoData,
    configData,
    distributionTemplates: [],
    userAgent,
    leftMenu,
    editProfileVisible: false,
    comingSoonVisible: false,
    editNotificationsVisible: false
  }
}
