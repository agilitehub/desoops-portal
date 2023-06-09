const Enums = {
  moduleTitles: {
    BATCH_PAYMENTS: 'Batch Payments'
  },
  desoUrls: {
    DAO_BALANCE: 'https://blockproducer.deso.org/api/v0/get-hodlers-for-public-key',
    EXCHANGE_RATE: 'https://blockproducer.deso.org/api/v0/get-exchange-rate',
    GET_HODLERS: 'https://desocialworld.com/api/v0/get-hodlers-for-public-key'
  },
  values: {
    ENV_PRODUCTION: 'production',
    ENV_DEVELOPMENT: 'development',
    LOGIN: 'login',
    NANO_VALUE: 1000000000,
    DESO: 'deso',
    DAO: 'dao',
    CREATOR: 'creator',
    DESO_TYPE: '$DESO',
    DAO_TYPE: 'DAO',
    CREATOR_TYPE: 'Creator Coin',
    NFT: 'nft',
    POST: 'post',
    HEX_PREFIX: '0x',
    YES: 'Yes',
    NO: 'No',
    EMPTY_STRING: '',
    DIV_ROOT: 'root'
  },
  messages: {
    UNKNOWN_ERROR: 'Unknown Error Occured. Please check console',
    NOT_NFT_CREATOR: 'You are not the creator of this NFT. Please revise'
  },
  tabKeys: {
    BATCH_PAYMENTS: 'batch_payments',
    DESO_LOGIN: 'deso-login'
  },
  facets: {
    OPTIONS: 'options',
    EMAIL_LINK: 'emailLink',
    EMAIL_LINK_SUCCESS: 'emailLinkSuccess',
    PHONE: 'phone',
    CODE_CONFIRM: 'codeConfirm'
  }
}

export default Enums
