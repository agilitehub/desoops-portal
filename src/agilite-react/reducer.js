import State from './state'
import Enums from './resources/enums'
import { closeTab, loadContent } from './controller'

const reducer = (state = State, action) => {
  let tmpObj = null

  switch (action.type) {
    case Enums.reducers.ADD_TAB:
    case Enums.reducers.MENU_ITEM_CLICK:
      return loadContent(action.payload, state)
    case Enums.reducers.CHANGE_TAB:
      return {
        ...state,
        tabNavigation: {
          ...state.tabNavigation,
          activeKey: action.key
        }
      }
    case Enums.reducers.CLOSE_TAB:
      tmpObj = closeTab(state.tabNavigation.tabs, action.key)

      return {
        ...state,
        tabNavigation: {
          ...state.tabNavigation,
          ...tmpObj
        }
      }
    case Enums.reducers.LEFT_MENU_OPEN:
      return {
        ...state,
        leftMenu: {
          ...state.leftMenu,
          visible: true
        }
      }
    case Enums.reducers.LEFT_MENU_CLOSE:
      return {
        ...state,
        leftMenu: {
          ...state.leftMenu,
          visible: false
        }
      }
    case Enums.reducers.SIGN_IN_DESO:
      tmpObj = action.payload
      if (tmpObj) {
        tmpObj.loggedIn = true
      } else {
        tmpObj = {
          ...state.deso,
          loggedIn: true
        }
      }

      return {
        ...state,
        deso: tmpObj
      }
    case Enums.reducers.SIGN_OUT_DESO:
      return {
        ...state,
        deso: {
          ...state.deso,
          loggedIn: false
        }
      }
    case Enums.reducers.SET_PROFILE_DESO:
      return {
        ...state,
        deso: {
          ...state.deso,
          profile: action.payload
        }
      }
    case Enums.reducers.SET_DESO_DATA:
      return {
        ...state,
        deso: {
          ...state.deso,
          desoPrice: action.payload.desoPrice,
          daoBalance: action.payload.daoBalance,
          creatorCoinBalance: action.payload.creatorCoinBalance
        }
      }
    default:
      return state
  }
}

export default reducer
