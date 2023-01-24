import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
import { Form, Button, Row, Col, Spin } from 'antd'

import { desoLogin, getSingleProfile, getDaoBalance } from '../controller'
import BatchTransactions from '../../batch-transactions/components/app-wrapper'
import DeSoOpsBanner from '../../../agilite-react/resources/deso-ops-logo-transparent.png'
import AgiliteReactEnums from '../../../agilite-react/resources/enums'
import theme from '../../../agilite-react/resources/theme'
import Enums from '../../../utils/enums'
import { getHodlers } from '../../batch-transactions/controller'

const DeSoLoginForm = () => {
  const dispatch = useDispatch()
  const [loading, setLoading] = useState(false)

  const handleDesoLogin = async () => {
    let response = null
    let result = null
    let profile = null

    setLoading(true)

    try {
      response = await desoLogin()
      profile = await getSingleProfile(response.key)
      result = await getDaoBalance(profile.Profile.PublicKeyBase58Check)
      response = { profile, daoBalance: result.daoBalance, desoPrice: result.desoPrice, creatorCoinBalance: 0 }

      handleGetDoaBalance(profile)

      dispatch({
        type: AgiliteReactEnums.reducers.SIGN_IN_DESO,
        payload: response
      })
      dispatch({
        type: AgiliteReactEnums.reducers.ADD_TAB,
        payload: {
          key: Enums.tabKeys.BATCH_TRANSACTIONS,
          closable: false,
          title: Enums.values.EMPTY_STRING,
          content: <BatchTransactions />
        }
      })
    } catch (e) {
      console.log(e)
    }

    setLoading(false)
  }

  const handleGetDoaBalance = async (profile) => {
    let daoData = null
    let creatorCoinData = null
    let creatorCoinBalance = 0

    try {
      daoData = await getDaoBalance(profile.Profile.PublicKeyBase58Check)
      creatorCoinData = await getHodlers(profile.Profile.Username, false)

      creatorCoinData.Hodlers.map((entry) => {
        if (entry.HODLerPublicKeyBase58Check === profile.Profile.PublicKeyBase58Check) {
          creatorCoinBalance = entry.BalanceNanos
        }

        return null
      })

      dispatch({
        type: AgiliteReactEnums.reducers.SET_DESO_DATA,
        payload: { desoPrice: daoData.desoPrice, daoBalance: daoData.daoBalance, creatorCoinBalance }
      })
    } catch (e) {
      console.log(e)
    }
  }

  return (
    <div style={{ marginTop: 50 }}>
      <Row type='flex' justify='center'>
        <Col xs={24} sm={16} md={12} lg={8}>
          <div>
            <center>
              <h1 style={{ color: '#7d7e81' }}>WELCOME TO</h1>
              <img src={DeSoOpsBanner} alt='DeSo Ops' style={{ width: 300 }} />
            </center>
          </div>
          <br />
          <Row type='flex' justify='center'>
            <Col>
              <Form.Item>
                <Button
                  onClick={handleDesoLogin}
                  size='large'
                  disabled={loading}
                  style={{
                    backgroundColor: loading ? theme.custom.lightgrey : theme.custom.blue,
                    color: loading ? theme.custom.grey : theme.white,
                    width: 250,
                    borderRadius: 5,
                    fontSize: 20,
                    height: 'auto'
                  }}
                >
                  Sign In With DeSo
                  {loading ? <Spin size='medium' style={{ position: 'absolute', top: '28%', right: '5%' }} /> : null}
                </Button>
              </Form.Item>
            </Col>
          </Row>
        </Col>
      </Row>
    </div>
  )
}

export default DeSoLoginForm
