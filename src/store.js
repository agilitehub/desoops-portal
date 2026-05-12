import { legacy_createStore as createStore, combineReducers, applyMiddleware } from 'redux'
import { thunk } from 'redux-thunk'
import { composeWithDevTools } from '@redux-devtools/extension'

// Utilities
import Enums from './core/infra/enums'

// Reducers
import customReducer from './core/store/slices/custom/reducer'

const devTools =
  process.env.NODE_ENV === Enums.values.ENV_PRODUCTION
    ? applyMiddleware(thunk)
    : composeWithDevTools(applyMiddleware(thunk))

const reducers = {
  custom: customReducer
}

const store = createStore(combineReducers(reducers), {}, devTools)

export { reducers }
export default store
