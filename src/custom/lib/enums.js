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
    DESO_ESSENTIALS_PLAYLIST_URL: 'https://www.youtube.com/playlist?list=PLuSeo-NlSN_lXF3wXTmLxnsQQsyIqlb8r'
  },
  paymentTypes: {
    DESO: '$DESO',
    DAO: 'DAO',
    CREATOR: 'CC'
  },
  defaults: {
    USER_SEARCH_NUM_TO_FETCH: 20
  },
  paymentStatuses: {
    QUEUED: 'Queued',
    IN_PROGRESS: 'In Progress',
    SUCCESS: 'Success',
    FAILED: 'Failed'
  },
  messages: {
    UNKNOWN_ERROR: 'Unknown Error Occured. Please check console',
    NOT_NFT_CREATOR: 'You are not the creator of this NFT. Please revise'
  }
}

export default Enums
