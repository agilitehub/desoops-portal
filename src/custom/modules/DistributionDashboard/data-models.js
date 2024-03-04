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
    returnAmount: null,
    lastActiveDays: null,
    originalHodlers: [],
    finalHodlers: [],
    selectedTableKeys: [],
    tokenTotal: 0,
    feePerTransactionUSD,
    nftUrl: '',
    nftMetaData: {},
    nftHodlers: [],
    openNftSearch: false,
    customListModal: customListModal(),
    paymentModal: paymentModal(),
    selectTemplateModal: selectTemplateModal(),
    templateNameModal: templateNameModal(),
    diamondOptionsModal: diamondOptionsModal()
  }
}

export const distributionSummaryState = () => {
  return {
    amountLabel: '',
    amountReadOnly: false,
    noOfPaymentTransactions: 0,
    desoOpsFeeUSD: 0,
    desoOpsFeeDESO: 0,
    desoOpsFeeDESOLabel: 0,
    desoGasFeesNanos: 0,
    totalFeeUSD: 0,
    totalFeeUSDLabel: 0,
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
    distTransaction: null,
    tips: [],
    errors: []
  }
}

export const customListModal = (isOpen = false) => {
  return {
    isOpen,
    userList: []
  }
}

export const selectTemplateModal = (isOpen = false) => {
  return {
    isOpen,
    template: null,
    templateModified: false
  }
}

export const templateNameModal = (isOpen = false) => {
  return {
    isOpen,
    id: '',
    name: '',
    isModified: true,
    forceNew: false
  }
}

export const diamondOptionsModal = (isOpen = false) => {
  return {
    isOpen,
    noOfDiamonds: 1,
    noOfPosts: 20,
    skipHours: null
  }
}
