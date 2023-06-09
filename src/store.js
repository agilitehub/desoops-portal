import Thunk from 'redux-thunk'
import Enums from './utils/enums'
import { legacy_createStore as createStore, combineReducers, applyMiddleware } from 'redux'
import { initCustomReducers } from './agilite-react-setup'
import { composeWithDevTools } from 'redux-devtools-extension'

// Reducers
import coreReducer from './core/utils/reducer'

const customReducers = initCustomReducers()

const devTools =
  process.env.NODE_ENV === Enums.values.ENV_PRODUCTION
    ? applyMiddleware(Thunk)
    : composeWithDevTools(applyMiddleware(Thunk))

export const store = createStore(
  combineReducers({
    core: coreReducer.reducer,
    ...customReducers
  }),
  {},
  devTools
)

export default store
