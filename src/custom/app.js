import { useContext, useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { DeSoIdentityContext } from 'react-deso-protocol'

// App Components
import DistributionDashboard from './modules/DistributionDashboard'
import Login from './modules/Login'

// Utils
import { setDeSoData, resetState } from './reducer'
import { getDeSoData } from './lib/deso-controller'
import Enums from './lib/enums'
import Spinner from './reusables/components/Spinner'
import Toolbar from './modules/Toolbar'

const App = () => {
  const dispatch = useDispatch()
  const { currentUser, isLoading } = useContext(DeSoIdentityContext)
  const [initCompleted, setInitCompleted] = useState(false)
  const [userReturned, setUserReturned] = useState(false)

  useEffect(() => {
    const getDeSoDataHook = async () => {
      let desoData = null
      console.log('getDeSoDataHook')
      try {
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
      if (!userReturned) {
        setUserReturned(true)
        getDeSoDataHook()
      }
    } else if (!currentUser) {
      console.log('resetState')
      resetState()
      setInitCompleted(false)
      setUserReturned(false)
    }
  }, [currentUser]) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <>
      {isLoading && !initCompleted ? (
        <Spinner tip='Initializing DeSo Ops Portal...' />
      ) : currentUser && !initCompleted ? (
        <Spinner tip='Fetching DeSo Data...' />
      ) : currentUser && initCompleted ? (
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
