// DATA MODELS
export const initDeSoUserModel = () => {
  return {
    isActive: true,
    isVisible: true,
    publicKey: '',
    username: '',
    profilePicUrl: '',
    paymentStatus: '',
    tokenBalance: 0,
    tokenBalanceLabel: '',
    estimatedPaymentToken: 0,
    estimatedPaymentUSD: 0,
    estimatedPaymentLabel: '0',
    percentOwnership: 0,
    percentOwnershipLabel: ''
  }
}

// COMPONENT STATES
export const initDistributionDashboardState = () => {
  return {
    loading: false,
    isExecuting: false,
    distributeTo: '',
    distributionType: '',
    distributionAmount: '',
    rulesEnabled: false,
    tokenToUse: '',
    spreadAmountBasedOn: 'Ownership',
    filterUsers: false,
    filterAmountIs: '>',
    filterAmount: '',
    finalHodlers: [],
    selectedTableKeys: [],
    tokenTotal: 0
  }
}
