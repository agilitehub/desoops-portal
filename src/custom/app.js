import { useContext, useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { DeSoIdentityContext } from 'react-deso-protocol'

// App Components
import DistributionDashboard from './modules/DistributionDashboard'
import Login from './modules/Login'

// Utils
// import { desoLogout } from './deso/controller'
import { setDeSoData, resetState } from './reducer'
import { getDeSoData } from './deso/controller'
import Enums from './utils/enums'
import Spinner from './reusables/components/Spinner'
import Toolbar from './modules/Toolbar'

const App = () => {
  const dispatch = useDispatch()
  const { currentUser, isLoading } = useContext(DeSoIdentityContext)
  const [initCompleted, setInitCompleted] = useState(true)

  // useEffect(() => {
  //   if (currentUser) desoLogout()
  // }, []) // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    const getDeSoDataHook = async () => {
      let desoData = null

      try {
        setInitCompleted(false)
        desoData = await getDeSoData(currentUser.PublicKeyBase58Check)
        desoData.profile = {
          publicKey: currentUser.PublicKeyBase58Check,
          username: currentUser.ProfileEntryResponse.Username,
          desoBalance: currentUser.ProfileEntryResponse.DESOBalanceNanos / Enums.values.NANO_VALUE
        }
        console.log('desoData', desoData)
        dispatch(setDeSoData(desoData))
        setInitCompleted(true)
      } catch (e) {
        console.error(e)
      }
    }

    if (currentUser) {
      getDeSoDataHook()
    } else {
      resetState()
    }
  }, [currentUser]) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <>
      {isLoading ? (
        <Spinner tip='Initializing DeSo Ops Portal...' />
      ) : currentUser && !initCompleted ? (
        <Spinner tip='Fetching DeSo Data...' />
      ) : currentUser ? (
        <>
          <Toolbar />
          <DistributionDashboard />
        </>
      ) : (
        <Login />
      )}
    </>
  )
}

export default App
