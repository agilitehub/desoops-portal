// Data Models that get used for Redux States and React Components
// Component States
export const distributionDashboardState = () => {
  return {
    loading: false,
    isExecuting: false,
    distributeTo: '',
    distributionType: '',
    distributionAmount: null,
    distributionAmountEnabled: false,
    rulesEnabled: false,
    tokenToUse: '',
    spreadAmountBasedOn: 'Ownership',
    filterUsers: false,
    filterAmountIs: '>',
    filterAmount: null,
    finalHodlers: [],
    selectedTableKeys: [],
    tokenTotal: 0,
    feePerTransactionUSD: 0.001
  }
}

export const distributionSummaryState = () => {
  return {
    noOfPaymentTransactions: 0,
    totalFeeUSD: 0,
    totalFeeDESO: 0,
    tokenToDistribute: '',
    transactionFeeExceeded: false,
    amountExceeded: false,
    isExecuting: false,
    warningMessages: [],
    isInFinalStage: false,
    executeDisabled: true
  }
}