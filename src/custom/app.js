import { useContext, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
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
  const desoData = useSelector((state) => state.custom.desoData)
  const { currentUser, isLoading } = useContext(DeSoIdentityContext)
  const [initCompleted, setInitCompleted] = useState(false)
  const [userReturned, setUserReturned] = useState(false)

  useEffect(() => {
    const getDeSoDataHook = async () => {
      let tmpDeSoData = null
      let desoBalance = 0
      let desoBalanceUSD = 0

      try {
        tmpDeSoData = await getDeSoData(currentUser.PublicKeyBase58Check, desoData)
        desoBalance = currentUser.ProfileEntryResponse.DESOBalanceNanos / Enums.values.NANO_VALUE
        desoBalanceUSD = Math.floor(desoBalance * tmpDeSoData.desoPrice * 100) / 100
        desoBalance = Math.floor(desoBalance * 10000) / 10000

        tmpDeSoData.profile = {
          ...tmpDeSoData.profile,
          username: currentUser.ProfileEntryResponse.Username,
          profilePicUrl: `https://blockproducer.deso.org/api/v0/get-single-profile-picture/${tmpDeSoData.profile.publicKey}`,
          desoBalance,
          desoBalanceUSD,
          totalFollowing: currentUser.PublicKeysBase58CheckFollowedByUser.length
        }

        console.log('tmpDeSoData', tmpDeSoData)
        dispatch(setDeSoData(tmpDeSoData))
        setInitCompleted(true)
      } catch (e) {
        console.error(e)
      }
    }

    if (currentUser) {
      console.log('currentUser', currentUser)
      if (!userReturned) {
        setUserReturned(true)
        getDeSoDataHook()
      }
    } else if (!currentUser) {
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
