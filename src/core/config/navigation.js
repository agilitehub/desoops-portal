import { faCommentsDollar, faMoneyBillTransfer, faWallet } from '@fortawesome/free-solid-svg-icons'

import { ROUTE_SEGMENTS } from '../../constants/paths'

/** Items rendered in the main app toolbar (desktop header + mobile footer). */
export const MAIN_TOOLBAR_ITEMS = [
  {
    key: 'wallet',
    segment: ROUTE_SEGMENTS.WALLET,
    icon: faWallet,
    label: 'Wallet'
  },
  {
    key: 'distribute',
    segment: ROUTE_SEGMENTS.DISTRIBUTE,
    icon: faMoneyBillTransfer,
    label: 'Distribute'
  },
  {
    key: 'deposits',
    icon: faCommentsDollar,
    label: 'Deposits',
    deposits: true
  }
]
