// Generate Data Models that are used generically across the app
export const desoUserModel = () => {
  return {
    isActive: true,
    isVisible: true,
    isError: false,
    isCustom: false,
    errorMessage: '',
    publicKey: '',
    username: '',
    profilePicUrl: '',
    paymentStatus: '',
    tokenBalance: 0,
    tokenBalanceLabel: '',
    estimatedPaymentToken: 0,
    estimatedPaymentUSD: 0,
    estimatedPaymentLabel: 0,
    percentOwnership: 0,
    percentOwnershipLabel: ''
  }
}

export const distributionTransactionModel = () => {
  return {
    startedAt: null,
    completedAt: null,
    isError: false,
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
    rules: {
      spreadAmountBasedOn: '',
      filterUsers: false,
      filterAmountIs: '',
      filterAmount: 0
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
    errorMessage: '',
    tokenBalance: 0,
    estimatedPaymentToken: 0,
    estimatedPaymentUSD: 0,
    percentOwnership: 0
  }
}
