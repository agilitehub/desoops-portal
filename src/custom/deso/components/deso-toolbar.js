import { Button, Col, Row } from 'antd'
import { useContext } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { DeSoIdentityContext } from 'react-deso-protocol'

import { desoLogout } from '../controller'
import AgiliteReactEnums from '../../../agilite-react/resources/enums'
import Enums from '../../../utils/enums'

// Components
import DeSoLoginForm from './deso-login-form'

const DesoToolbar = () => {
  const dispatch = useDispatch()
  const { currentUser } = useContext(DeSoIdentityContext)
  const userData = useSelector((state) => state.custom.userData)

  const handleDesoLogout = async () => {
    try {
      await desoLogout(userData.profile.PublicKeyBase58Check)
      dispatch({ type: AgiliteReactEnums.reducers.SIGN_OUT_DESO })

      dispatch({
        type: AgiliteReactEnums.reducers.ADD_TAB,
        payload: {
          key: Enums.tabKeys.DESO_LOGIN,
          closable: false,
          title: Enums.values.EMPTY_STRING,
          content: <DeSoLoginForm />
        }
      })
    } catch (e) {
      console.log(e)
    }
  }

  return (
    <div>
      <div>
        {currentUser ? (
          <Row justify='space-between'>
            <Col style={{ marginRight: 20, cursor: 'auto' }}>
              <div>@{userData?.profile?.Username}</div>
            </Col>
            <Col style={{ marginRight: 20 }}>
              <Button type='primary' onClick={handleDesoLogout}>
                Logout
              </Button>
            </Col>
          </Row>
        ) : null}
      </div>
    </div>
  )
}

export default DesoToolbar
