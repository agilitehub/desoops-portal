// These are generic enums used throughout the app.

const Enums = {
  values: {
    DESO_OPS_PUBLIC_KEY: 'BC1YLfmmgppbA2CiVvdRjX9jL7kSvGQeqJdxibXRyhpMcP9WTm7qz6R',
    ENV_PRODUCTION: 'production',
    ENV_DEVELOPMENT: 'development',
    LOGIN: 'login',
    NANO_VALUE: 1000000000,
    DESO_LIMIT_INCREASE_BUFFER: 0.01,
    DESO: 'deso',
    DAO: 'dao',
    CREATOR: 'creator',
    NFT: 'nft',
    CUSTOM: 'custom',
    POST: 'post',
    HEX_PREFIX: '0x',
    YES: 'Yes',
    NO: 'No',
    EMPTY_STRING: '',
    DIV_ROOT: 'root',
    FOLLOWERS: 'Followers',
    FOLLOWING: 'Following',
    SELECTED_USERS: 'Selected Users in Table',
    DESO_VIDEO_URL: 'https://www.youtube.com/watch?v=5jHXBYUb7X4',
    DESOOPS_VIDEO_URL: 'https://www.youtube.com/watch?v=PAQELCazfs8'
  },
  paymentTypes: {
    DESO: '$DESO',
    DAO: 'DAO',
    CREATOR: 'CC'
  },
  defaults: {
    USER_SEARCH_NUM_TO_FETCH: 50,
    UPDATE_DESO_PRICE_INTERVAL_SEC: 30000
  },
  paymentStatuses: {
    QUEUED: 'Queued',
    IN_PROGRESS: 'In Progress',
    SUCCESS: 'Success',
    FAILED: 'Failed'
  },
  appRenderState: {
    INIT: 'init',
    SIGNING_IN: 'signingIn',
    LAUNCH: 'launch',
    LOGIN: 'login'
  },
  coinSwap: {
    heroSwap: {
      title: 'HeroSwap',
      url: 'https://heroswap.com/widget',
      depositTicker: 'DESO',
      destinationTicker: 'DUSD'
    },
    stealthEX: {
      title: 'StealthEX',
      id: 'stealthex-widget',
      url: 'https://stealthex.io/widget',
      affiliateId: '1ad31d1b-1404-49dc-bf92-9287bc7703cd'
    }
  },
  spinnerMessages: {
    INIT: 'Initializing DeSoOps Portal...',
    SIGNING_IN: 'Signing In...'
  },
  messages: {
    UNKNOWN_ERROR: 'Unknown Error Occured. Please check console',
    NOT_NFT_CREATOR: 'You are not the creator of this NFT. Please revise'
  },
  transactionErrors: [
    {
      qry: 'NEED_BLOCKS',
      message:
        'A DeSo error occurred while processing your transaction (NEED_BLOCKS). Wait at least 30 seconds and try again.'
    },
    {
      qry: 'Problem getting block for blockhash',
      message:
        'A DeSo error occurred while processing your transaction (Problem getting block for blockhash). Wait at least 30 seconds and try again.'
    }
  ]
}

export default Enums
