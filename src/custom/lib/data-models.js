// Generate Data Models that are used generically across the app
export const desoUserModel = () => {
  return {
    isActive: true,
    isVisible: true,
    isError: false,
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
