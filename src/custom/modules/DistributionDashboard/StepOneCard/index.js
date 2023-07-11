import React, { useReducer } from 'react'
import { Card, Row, Col, theme, Select, message, Divider, InputNumber } from 'antd'
import Enums from '../../../lib/enums'
import { setupHodlers } from '../controller'

const initialState = {
  loading: false,
  isExecuting: false,
  distributeTo: Enums.values.EMPTY_STRING,
  distributionType: Enums.values.EMPTY_STRING,
  distributionAmount: Enums.values.EMPTY_STRING,
  inputAmountLabel: '$DESO',
  allHodlers: [],
  finalHodlers: []
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

  const handleDistributeToChange = async (distributeTo) => {
    let tmpResult = []
    let allHodlers = []
    let coinTotal = 0

    try {
      // If user selects the current value, do nothing
      if (distributeTo === state.distributeTo) return

      // First Reset Dashboard State, as all values depend on this selection
      resetState()

      // Then, if user selects NFT or Post, no extra work is needed
      if (!distributeTo || distributeTo === Enums.values.NFT || distributeTo === Enums.values.POST) return

      setState({ loading: true })
      tmpResult = await setupHodlers(desoData.profile, distributeTo)

      allHodlers = tmpResult.allHodlers
      coinTotal = tmpResult.coinTotal

      // Update State
      setState({ distributeTo, allHodlers, finalHodlers: allHodlers, coinTotal })
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

    // Update State
    setState({ distributionType: value })
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
      {state.distributeTo !== Enums.values.EMPTY_STRING ? (
        <>
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
        </>
      ) : null}
    </Card>
  )
}

export default StepOneCard
