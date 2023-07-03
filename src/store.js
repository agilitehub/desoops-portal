import Thunk from 'redux-thunk'
import Enums from './custom/utils/enums'
import { legacy_createStore as createStore, combineReducers, applyMiddleware } from 'redux'
import { composeWithDevTools } from 'redux-devtools-extension'

// Reducers
import coreReducer from './core/utils/reducer'
import customReducer from './custom/reducer'

const devTools =
  process.env.NODE_ENV === Enums.values.ENV_PRODUCTION
    ? applyMiddleware(Thunk)
    : composeWithDevTools(applyMiddleware(Thunk))

const reducers = {
  core: coreReducer.reducer,
  custom: customReducer
}

const store = createStore(combineReducers(reducers), {}, devTools)

export { reducers }
export default store
