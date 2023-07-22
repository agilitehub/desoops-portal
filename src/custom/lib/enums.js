// These are generic enums used throughout the app.

const Enums = {
  values: {
    DESO_OPS_PUBLIC_KEY: 'BC1YLfmmgppbA2CiVvdRjX9jL7kSvGQeqJdxibXRyhpMcP9WTm7qz6R',
    ENV_PRODUCTION: 'production',
    ENV_DEVELOPMENT: 'development',
    LOGIN: 'login',
    NANO_VALUE: 1000000000,
    DESO: 'deso',
    DAO: 'dao',
    CREATOR: 'creator',
    NFT: 'nft',
    POST: 'post',
    HEX_PREFIX: '0x',
    YES: 'Yes',
    NO: 'No',
    EMPTY_STRING: '',
    DIV_ROOT: 'root',
    FOLLOWERS: 'Followers',
    FOLLOWING: 'Following',
    SELECTED_USERS: 'Selected Users in Table'
  },
  defaults: {
    DEFAULT_FEE_PER_TRANSACTION_USD: 0.001
  },
  paymentTypes: {
    DESO: '$DESO',
    DAO: 'DAO',
    CREATOR: 'CC'
  },
  messages: {
    UNKNOWN_ERROR: 'Unknown Error Occured. Please check console',
    NOT_NFT_CREATOR: 'You are not the creator of this NFT. Please revise'
  },
  tips: [
    'You can filter the list of users in the table based on their Token balance.',
    'You can select / deselect users in the Table individually, or as a whole.',
    'You can copy the list of selected users in the Table to your clipboard. Tap on the "Copy" icon in the Quick Actions section.'
  ]
}

export default Enums
