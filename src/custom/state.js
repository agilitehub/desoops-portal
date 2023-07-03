const desoData = {
  profile: {
    username: '',
    publicKey: '',
    desoBalance: 0
  },
  desoPrice: 0,
  daoBalance: 0,
  daoHodlers: [],
  creatorCoinBalance: 0,
  creatorCoinHodlers: []
}

export const customState = () => {
  return {
    desoData
  }
}
