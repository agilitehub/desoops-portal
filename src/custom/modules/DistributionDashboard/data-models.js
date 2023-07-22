// Data Models that get used for Redux States and React Components

// Component States
export const distributionDashboardState = (feePerTransactionUSD) => {
  return {
    loading: false,
    isExecuting: false,
    activeRulesTab: '1',
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
    feePerTransactionUSD,
    nftUrl: '',
    nftMetaData: {},
    nftHodlers: [],
    openNftSearch: false,
    paymentModal: paymentModal()
  }
}

export const distributionSummaryState = () => {
  return {
    noOfPaymentTransactions: 0,
    totalFeeUSD: 0,
    totalFeeDESO: 0,
    totalFeeDESOLabel: 0,
    tokenToDistribute: '',
    transactionFeeExceeded: false,
    amountExceeded: false,
    isExecuting: false,
    warningMessages: [],
    isInFinalStage: false,
    executeDisabled: true
  }
}

export const paymentModal = () => {
  return {
    isOpen: false,
    status: 'Preparing to execute payments...',
    paymentCount: 0,
    successCount: 0,
    failCount: 0,
    remainingCount: 0,
    progressPercent: 0,
    tips: [],
    errors: []
  }
}
