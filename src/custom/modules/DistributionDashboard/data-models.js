// Data Models that get used for Redux States and React Components

// Component States
export const distributionDashboardState = (feePerTransactionUSD) => {
  return {
    loading: false,
    isExecuting: false,
    activeRulesTab: '1',
    distributeTo: '',
    myHodlers: true,
    distributeDeSoUser: [],
    distributionType: '',
    distributionAmount: null,
    distributionAmountEnabled: false,
    rulesEnabled: false,
    tokenToUse: '',
    tokenToUseLabel: '',
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
    customListModal: customListModal(),
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
    executeDisabled: true,
    prevDeSoPrice: '',
    desoPriceClass: ''
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

export const customListModal = (isOpen = false) => {
  return {
    isOpen,
    autoSort: true,
    userList: []
  }
}
