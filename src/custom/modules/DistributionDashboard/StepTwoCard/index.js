// Create a ReactJS Functional Component called StepOneCard
// Use Ant Design's Card Component, with a title of 'Start Here' and size of 'small'
// Use Ant Design's Row and Col Components to create a 2x2 grid

import React, { useReducer } from 'react'
import { Card, Row, Col, theme, Select, message, Divider, InputNumber, Typography, Radio, Switch } from 'antd'
import Enums from '../../../lib/enums'
import { hexToInt } from '../../../lib/utils'

const initialState = {
  loading: false,
  isExecuting: false,
  distributeTo: Enums.values.EMPTY_STRING,
  distributionType: Enums.values.EMPTY_STRING,
  distributionAmount: Enums.values.EMPTY_STRING,
  inputAmountLabel: '$DESO'
}

const styleParams = {
  col1XS: 24,
  labelColSM: 12,
  labelColMD: 9,
  valueColXS: 24,
  valueColSM: 12,
  valueColMD: 15,
  colRightXS: 24,
  labelColStyle: { marginTop: 4 },
  dividerStyle: { margin: '7px 0' }
}

const { Title } = Typography
const reducer = (state, newState) => ({ ...state, ...newState })

const StepTwoCard = ({ desoData }) => {
  const { token } = theme.useToken()
  const [state, setState] = useReducer(reducer, initialState)

  const resetState = () => {
    setState(initialState)
  }

  const handleDistributeToChange = async (value) => {
    let tmpHodlers = []
    let finalHodlers = []
    let tmpCoinTotal = 0
    let isDAOCoin = null
    let noOfCoins = 0
    let tmpRowKeys = []

    try {
      // If user selects the current value, do nothing
      if (value === state.distributeTo) return

      // First Reset Dashboard State
      resetState()

      // Then, if user selects NFT or Post, no extra work is needed
      if (!value || value === Enums.values.NFT || value === Enums.values.POST) return

      setState({ loading: true })

      // If user selects DAO or Creator Coin Hodlers, we need to get the relevant users
      isDAOCoin = value === Enums.values.DAO
      tmpHodlers = desoData.profile.daoHodlers

      if (tmpHodlers.Hodlers.length > 0) {
        // Determine Coin Total and valid Hodlers
        tmpHodlers.Hodlers.map((entry) => {
          // Ignore entry if it does not have a Profile OR if it is the same as current logged in user
          if (entry.ProfileEntryResponse && entry.ProfileEntryResponse.Username !== desoData.profile.username) {
            // Set Defaults
            entry.status = Enums.values.EMPTY_STRING

            // Determine Number of Coins
            if (isDAOCoin) {
              noOfCoins = entry.BalanceNanosUint256
              noOfCoins = hexToInt(noOfCoins)
              noOfCoins = noOfCoins / Enums.values.NANO_VALUE / Enums.values.NANO_VALUE
            } else {
              noOfCoins = entry.BalanceNanos
              noOfCoins = noOfCoins / Enums.values.NANO_VALUE
            }

            entry.noOfCoins = noOfCoins
            tmpCoinTotal += noOfCoins
            finalHodlers.push(entry)
          }

          return null
        })

        tmpRowKeys = finalHodlers.map((hodler) => hodler.ProfileEntryResponse.Username)
        // updateHolderAmounts(finalHodlers.concat(), tmpCoinTotal, 0, tmpRowKeys, tmpCoinTotal)
      }

      // Update State
      setState({ distributeTo: value })

      // setHodlers(finalHodlers)
      // setOriginalHodlers(finalHodlers)
      // setSelectedRows(finalHodlers)
      // setSelectedRowKeys(tmpRowKeys)
      // setOriginalCoinTotal(tmpCoinTotal)
    } catch (e) {
      message.error(e)
    }

    setState({ loading: false })
  }

  const handleDistributionTypeChange = (value) => {
    // const tmpCoinTotal = calculateCoinTotal(selectedRows)
    // setPaymentType(value)
    // setAmount('')
    // if (state.distributeTo === Enums.values.NFT) {
    //   handleGetNFT(nftUrl, '')
    // } else if (state.distributeTo === Enums.values.POST) {
    //   handleGetPost(postUrl, '')
    // } else {
    //   updateHolderAmounts(hodlers.concat(), tmpCoinTotal, 0, selectedRowKeys, originalCoinTotal)
    // }
    // const generatePaymentTypeFieldTitle = () => {
    //   switch (paymentType) {
    //     case Enums.values.EMPTY_STRING:
    //       return ''
    //     case Enums.values.DESO:
    //       return '$DESO'
    //     case Enums.values.DAO:
    //       return 'DAO'
    //     case Enums.values.CREATOR:
    //       return 'Creator Coin'
    //     default:
    //       break
    //   }
    // }
  }

  return (
    <Card title='Step 2: Conditions' size='small'>
      <Row>
        <Col xs={styleParams.col1XS} style={{ marginBottom: 5 }}>
          <span style={{ fontSize: 16 }}>
            <b>Spread amount based on:</b>
          </span>
        </Col>
        <Col xs={styleParams.col1XS}>
          <Radio.Group value={'percentage'} buttonStyle='solid'>
            <Radio.Button value={'percentage'}>% Ownership</Radio.Button>
            <Radio.Button value={'equal'}>Equal Spread</Radio.Button>
          </Radio.Group>
        </Col>
      </Row>
      <Divider style={styleParams.dividerStyle} />
      <Row>
        <Col xs={styleParams.col1XS} style={{ marginBottom: 5 }}>
          <span style={{ fontSize: 16 }}>
            <b>Filter users based on Coins/Tokens owned?</b>
          </span>
        </Col>
        <Col xs={styleParams.col1XS}>
          <Switch
            style={{ width: 65 }}
            checkedChildren='Yes'
            unCheckedChildren='No'
            // onChange={(checked) => {
            //   setFilterCoin(checked)
            //   setFilterCoinType('')
            //   handleCoinValueChange('', '')
            // }}
          />
        </Col>
      </Row>
      <Divider style={styleParams.dividerStyle} />
      <Row>
        <Col xs={24} sm={7} md={5} lg={24} style={{ paddingTop: 3, paddingBottom: 3 }}>
          <span style={{ fontSize: 16 }}>
            <b>Where amount is</b>
          </span>
        </Col>
        <Col xs={5} sm={4} md={3} lg={5}>
          <Select style={{ width: 70 }} defaultValue={'1'}>
            <Select.Option value={'1'}>{'>'}</Select.Option>
            <Select.Option value={'2'}>{'>='}</Select.Option>
            <Select.Option value={'3'}>{'<'}</Select.Option>
            <Select.Option value={'4'}>{'<='}</Select.Option>
          </Select>
        </Col>
        <Col>
          <InputNumber addonBefore='CC' min={0} placeholder='Enter amount' style={{ width: 225 }} />
        </Col>
      </Row>
    </Card>
  )
}

export default StepTwoCard
