const Enums = {
  appTitles: {
    BATCH_TRANSACTIONS: 'Batch Transactions'
  },
  urls: {
    LOGIN_URL: 'https://identity.deso.org/log-in?accessLevelRequest=4',
    IDENTITY_URL: 'https://identity.deso.org',
    DAO_BALANCE: 'https://blockproducer.deso.org/api/v0/get-hodlers-for-public-key',
    EXCHANGE_RATE: 'https://blockproducer.deso.org/api/v0/get-exchange-rate',
    GET_HODLERS: 'https://desocialworld.com/api/v0/get-hodlers-for-public-key'
  },
  routes: {
    CREATE_PAYMENT_TRANSACTION: '/api/createPaymentTransaction'
  },
  headers: {
    RECORD_ID: 'record-id',
    GHOST_ID: 'ghost-id',
    TASK_ID: 'task-id'
  },
  values: {
    ENV_PRODUCTION: 'production',
    ENV_DEVELOPMENT: 'development',
    IDENTITY: 'identity',
    LOGIN: 'login',
    NANO_VALUE: 1000000000,
    DESO: 'deso',
    DAO: 'dao',
    CREATOR: 'creator',
    DESO_TYPE: '$DESO',
    DAO_TYPE: 'DAO',
    CREATOR_TYPE: 'Creator Coin',
    NFT: 'nft',
    HEX_PREFIX: '0x',
    YES: 'Yes',
    NO: 'No',
    EMPTY_STRING: ''
  },
  events: {
    MESSAGE: 'message'
  },
  methods: {
    INIT: 'initialize'
  },
  messages: {
    UNKNOWN_ERROR: 'Unknown Error Occured. Please check console'
  },
  tabKeys: {
    BATCH_TRANSACTIONS: 'batch_transactions',
    DESO_LOGIN: 'deso-login'
  }
}

export default Enums
