import Enums from '../../lib/enums'

export const renderApp = async (currentUser, isLoading, state) => {
  let newState = {}

  try {
    if (!currentUser && !isLoading && !state.initializing) {
      // User logged out or was never logged in
      newState = { renderState: Enums.appRenderState.LOGIN, userReturned: false }
    } else if (isLoading && !state.userReturned) {
      // We are signing in
      newState = { renderState: Enums.appRenderState.SIGNING_IN, spinTip: Enums.spinnerMessages.SIGNING_IN }
    } else if (currentUser && !state.userReturned && !state.initializing) {
      // We need to initialize the app
      newState = {
        renderState: Enums.appRenderState.INIT,
        spinTip: Enums.spinnerMessages.INIT,
        userReturned: true,
        initializing: true
      }
    } else if (currentUser && state.userReturned && !state.initializing) {
      // We have the user and data, We can launch the app
      newState = { renderState: Enums.appRenderState.LAUNCH, appReady: true }
    }

    return newState
  } catch (e) {
    throw e
  }
}
