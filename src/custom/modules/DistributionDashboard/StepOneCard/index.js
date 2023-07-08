// Create a ReactJS Functional Component called StepOneCard
// Use Ant Design's Card Component, with a title of 'Start Here' and size of 'small'
// Use Ant Design's Row and Col Components to create a 2x2 grid

import React, { useReducer } from 'react'
import { Card, Row, Col, theme, Select, message, Divider, InputNumber } from 'antd'
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
  labelColXS: 24,
  labelColSM: 12,
  labelColMD: 9,
  valueColXS: 24,
  valueColSM: 12,
  valueColMD: 15,
  colRightXS: 24,
  labelColStyle: { marginTop: 4 },
  dividerStyle: { margin: '7px 0' }
}

const reducer = (state, newState) => ({ ...state, ...newState })

const StepOneCard = ({ desoData }) => {
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
      tmpHodlers = desoData.profile.daoHolders

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
    <Card title='Step 1: Start Here' size='small'>
      <Row>
        <Col
          xs={styleParams.labelColXS}
          sm={styleParams.labelColSM}
          md={styleParams.labelColMD}
          style={styleParams.labelColStyle}
        >
          <span style={{ fontWeight: 'bold' }}>Distribute to:</span>
        </Col>
        <Col xs={styleParams.valueColXS} sm={styleParams.valueColSM} md={styleParams.valueColMD}>
          <Select
            disabled={state.isExecuting}
            onChange={(value) => handleDistributeToChange(value)}
            value={state.distributeTo}
            style={{ width: 250 }}
          >
            <Select.Option value={Enums.values.EMPTY_STRING}>- Select -</Select.Option>
            <Select.Option value={Enums.values.CREATOR}>Creator Coin Holders</Select.Option>
            <Select.Option value={Enums.values.DAO}>DAO Coin Holders</Select.Option>
            <Select.Option value={Enums.values.NFT}>NFT Owners</Select.Option>
          </Select>
        </Col>
      </Row>
      <Divider style={styleParams.dividerStyle} />
      <Row>
        <Col
          xs={styleParams.labelColXS}
          sm={styleParams.labelColSM}
          md={styleParams.labelColMD}
          style={styleParams.labelColStyle}
        >
          <span style={{ fontWeight: 'bold' }}>Type of distribution:</span>
        </Col>
        <Col xs={styleParams.valueColXS} sm={styleParams.valueColSM} md={styleParams.valueColMD}>
          <Select
            disabled={state.isExecuting}
            onChange={(value) => handleDistributionTypeChange(value)}
            value={state.distributionType}
            style={{ width: 250 }}
          >
            <Select.Option value={Enums.values.EMPTY_STRING}>- Select -</Select.Option>
            <Select.Option value={Enums.values.DESO}>$DESO</Select.Option>
            <Select.Option value={Enums.values.DAO}>DAO Token</Select.Option>
            <Select.Option value={Enums.values.CREATOR}>Creator Coin</Select.Option>
          </Select>
        </Col>
      </Row>
      <Divider style={styleParams.dividerStyle} />
      <Row>
        <Col
          xs={styleParams.labelColXS}
          sm={styleParams.labelColSM}
          md={styleParams.labelColMD}
          style={styleParams.labelColStyle}
        >
          <span style={{ fontWeight: 'bold' }}>Amount to distribute:</span>
        </Col>
        <Col xs={styleParams.valueColXS} sm={styleParams.valueColSM} md={styleParams.valueColMD}>
          <InputNumber
            addonBefore={state.inputAmountLabel}
            // disabled={state.distributeTo && state.distributionType && !state.isExecuting ? false : true}
            placeholder='Enter amount'
            value={state.distributionAmount}
            style={{ width: 250 }}
            onChange={(distributionAmount) => {
              setState({ distributionAmount })
            }}
          />
        </Col>
      </Row>
    </Card>
  )
}

export default StepOneCard
