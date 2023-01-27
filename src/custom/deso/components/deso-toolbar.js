import { Button, Col, Row } from 'antd'
import { useDispatch, useSelector } from 'react-redux'

import { desoLogout } from '../controller'
import AgiliteReactEnums from '../../../agilite-react/resources/enums'
import Enums from '../../../utils/enums'

// Components
import DeSoLoginForm from './deso-login-form'

const DesoToolbar = () => {
  const desoState = useSelector((state) => state.agiliteReact.deso)
  const loggedIn = useSelector((state) => state.agiliteReact.deso.loggedIn)
  const dispatch = useDispatch()

  const handleDesoLogout = async () => {
    try {
      await desoLogout(desoState.profile.Profile.PublicKeyBase58Check)
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
        {loggedIn ? (
          <Row justify='space-between'>
            <Col style={{ marginRight: 20, cursor: 'auto' }}>
              <div>@{desoState?.profile?.Profile?.Username}</div>
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
