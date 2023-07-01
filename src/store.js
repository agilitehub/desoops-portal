import Thunk from 'redux-thunk'
import Enums from './utils/enums'
import { legacy_createStore as createStore, combineReducers, applyMiddleware } from 'redux'
import { composeWithDevTools } from 'redux-devtools-extension'

// Reducers
import coreReducer from './core/utils/reducer'
import customReducer from './custom/reducer'

const devTools =
  process.env.NODE_ENV === Enums.values.ENV_PRODUCTION
    ? applyMiddleware(Thunk)
    : composeWithDevTools(applyMiddleware(Thunk))

export const store = createStore(
  combineReducers({
    core: coreReducer.reducer,
    custom: customReducer
  }),
  {},
  devTools
)

export default store
