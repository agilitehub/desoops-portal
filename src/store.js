import { legacy_createStore as createStore, combineReducers, applyMiddleware } from 'redux'
import Thunk from 'redux-thunk'
import { composeWithDevTools } from 'redux-devtools-extension'

import Enums from 'lib/enums'
import coreReducer from 'reducer'

const devTools =
  process.env.NODE_ENV === Enums.values.ENV_PRODUCTION
    ? applyMiddleware(Thunk)
    : composeWithDevTools(applyMiddleware(Thunk))

const reducers = {
  core: coreReducer
}

const store = createStore(combineReducers(reducers), {}, devTools)

export { reducers }
export default store
