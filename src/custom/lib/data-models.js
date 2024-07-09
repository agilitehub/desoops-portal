// Generate Data Models that are used generically across the app
export const desoUserModel = () => {
  return {
    isActive: true,
    isVisible: true,
    isError: false,
    isKnownError: false,
    isCustom: false,
    optedOut: false,
    hasUsername: true,
    errorMessage: '',
    publicKey: '',
    username: '',
    desoBalance: 0,
    profilePicUrl: '',
    paymentStatus: '',
    tokenBalance: 0,
    tokenBalanceLabel: '',
    estimatedPaymentToken: 0,
    estimatedPaymentUSD: 0,
    estimatedPaymentLabel: 0,
    percentOwnership: 0,
    percentOwnershipLabel: '',
    lastActiveDays: 0,
    diamondPosts: []
  }
}

export const distributionTransactionModel = () => {
  return {
    startedAt: null,
    completedAt: null,
    isError: false,
    isKnownError: false,
    errorDetails: null,
    publicKey: '',
    desoPriceUSD: 0,
    feePerTransactionUSD: 0,
    distributeTo: '',
    myHodlers: true,
    distributeDeSoUser: '',
    distributionType: '',
    distributionAmount: 0,
    tokenToUse: '',
    nftId: '',
    nftExtraData: null,
    rules: {
      spreadAmountBasedOn: '',
      filterUsers: false,
      filterAmountIs: '',
      filterAmount: 0,
      filterDeSoBalanceIs: '',
      filterDeSoBalance: 0,
      returnAmount: 0,
      lastActiveDays: 0
    },
    totalFeeUSD: 0,
    totalFeeDESO: 0,
    paymentCount: 0,
    successCount: 0,
    failCount: 0,
    remainingCount: 0,
    recipients: []
  }
}

export const distributionRecipientModel = () => {
  return {
    publicKey: '',
    isActive: true,
    isVisible: true,
    isError: false,
    isKnownError: false,
    errorMessage: '',
    tokenBalance: 0,
    estimatedPaymentToken: 0,
    estimatedPaymentUSD: 0,
    percentOwnership: 0
  }
}

export const distributionTemplateModel = () => {
  return {
    createdAt: null,
    modifiedAt: null,
    publicKey: '',
    name: '',
    distributeTo: '',
    myHodlers: true,
    distributeDeSoUser: '',
    distributionType: '',
    tokenToUse: '',
    distributionAmount: 0,
    nftId: '',
    nftUrl: '',
    nftImageUrl: '',
    nftDescription: '',
    nftHodlers: [],
    customList: [],
    diamondOptions: {
      noOfDiamonds: 1,
      noOfPosts: 20,
      skipHours: null
    },
    rules: {
      enabled: true,
      spreadAmountBasedOn: '',
      filterUsers: false,
      filterAmountIs: '',
      filterAmount: 0,
      filterDeSoBalanceIs: '',
      filterDeSoBalance: 0,
      returnAmount: 0,
      lastActiveDays: 0
    },
    isPoll: false,
    pollOptions: []
  }
}

export const optOutModel = (publicKey = '', optOutKey = '') => {
  return {
    createdAt: new Date(),
    updatedAt: new Date(),
    publicKey: publicKey,
    recipients: [
      {
        publicKey: optOutKey,
        timestamp: new Date()
      }
    ]
  }
}

export const diamondPostModel = (postHash = '') => {
  return {
    isError: false,
    isKnownError: false,
    errorMessage: '',
    postHash
  }
}
