// Create a ReactJS Functional Component called StepOneCard
// Use Ant Design's Card Component, with a title of 'Start Here' and size of 'small'
// Use Ant Design's Row and Col Components to create a 2x2 grid

import React, { useEffect, useReducer } from 'react'
import { Card, Row, Col, theme, Select, message, Divider, InputNumber, Popconfirm, Button } from 'antd'
import Enums from '../../../lib/enums'
import { hexToInt } from '../../../lib/utils'
import { RightCircleOutlined, SendOutlined } from '@ant-design/icons'
import { size } from 'lodash'
import { calculateEstimatedPayment } from '../controller'
import { initDistributionSummaryState } from '../../../lib/templates'

const styleParams = {
  labelColXS: 12,
  labelColSM: 12,
  labelColMD: 10,
  valueColXS: 12,
  valueColSM: 12,
  valueColMD: 14,
  colRightXS: 24,
  labelColStyle: {},
  dividerStyle: { margin: '7px 0' }
}

const reducer = (state, newState) => ({ ...state, ...newState })

const SummaryCard = ({ desoData, parentState, onSetState }) => {
  const [state, setState] = useReducer(reducer, initDistributionSummaryState())

  const handleDistributionAmount = async (distributionAmount) => {
    let tmpHodlers = null
    let desoPrice = null

    // We need to update the estimatedPaymentToken and estimatedPaymentUSD values
    tmpHodlers = Array.from(parentState.finalHodlers)
    if (parentState.distributionType === Enums.paymentTypes.DESO) desoPrice = desoData.desoPrice
    await calculateEstimatedPayment(tmpHodlers, distributionAmount, parentState.spreadAmountBasedOn, desoPrice)
    onSetState({ distributionAmount })
  }

  // create a useEffect hook that monitors parentState.finalHodlers and desoData.desoPrice
  // if either of these values change, we need to update noOfPaymentTransactions and the totalTransactionFee
  // use the setNoOfPaymentTransactions and setTotalTransactionFee functions to update these values
  // setNoOfPaymentTransactions = parentState.finalHodlers.length where isActive and isVisible are true
  // setTotalTransactionFee = noOfPaymentTransactions * parentState.feePerTransactionUSD
  useEffect(() => {
    try {
      const noOfPaymentTransactions = parentState.finalHodlers.filter(
        (hodler) => hodler.isActive && hodler.isVisible
      ).length

      let totalFeeUSD = noOfPaymentTransactions * parentState.feePerTransactionUSD
      let totalFeeDESO = totalFeeUSD / desoData.desoPrice
      let distributionAmount = parentState.distributionAmount
      let amountExceeded = false
      let transactionFeeExceeded = false
      let selectedToken = null

      if (isNaN(totalFeeUSD)) totalFeeUSD = 0
      if (isNaN(distributionAmount)) distributionAmount = 0
      if (isNaN(totalFeeDESO)) {
        totalFeeDESO = 0
      } else {
        totalFeeDESO = Math.ceil(totalFeeDESO * 10000) / 10000
      }

      if (totalFeeDESO >= desoData.profile.desoBalance) transactionFeeExceeded = true

      if (parentState.distributionType === Enums.paymentTypes.DESO) {
        if (totalFeeDESO + distributionAmount > desoData.profile.desoBalance) amountExceeded = true
      } else {
        if (parentState.tokenToUse) {
          switch (parentState.distributionType) {
            case Enums.paymentTypes.CREATOR:
              selectedToken = desoData.profile.ccHodlings.find(
                (hodling) => hodling.publicKey === parentState.tokenToUse
              )
              break
            case Enums.paymentTypes.DAO:
              selectedToken = desoData.profile.daoHodlings.find(
                (hodling) => hodling.publicKey === parentState.tokenToUse
              )
              break
          }

          if (selectedToken) {
            if (distributionAmount > selectedToken.tokenBalance) amountExceeded = true
          }
        }
      }

      setState({ noOfPaymentTransactions, totalFeeUSD, totalFeeDESO, amountExceeded, transactionFeeExceeded })
    } catch (error) {
      console.error(error)
    }
  }, [
    parentState.finalHodlers,
    parentState.tokenToUse,
    parentState.distributionType,
    parentState.feePerTransactionUSD,
    parentState.distributionAmount,
    desoData.profile.desoBalance,
    desoData.profile.daoHodlings,
    desoData.profile.ccHodlings,
    desoData.desoPrice
  ])

  return (
    <Card title='Step 3: Distribution Summary' size='small'>
      <Row>
        <Col
          xs={styleParams.labelColXS}
          sm={styleParams.labelColSM}
          md={styleParams.labelColMD}
          style={styleParams.labelColStyle}
        >
          <span style={{ fontWeight: 'bold' }}>Total Transactions:</span>
        </Col>
        <Col xs={styleParams.valueColXS} sm={styleParams.valueColSM} md={styleParams.valueColMD}>
          <span>{state.noOfPaymentTransactions}</span>
        </Col>
      </Row>
      <Row>
        <Col
          xs={styleParams.labelColXS}
          sm={styleParams.labelColSM}
          md={styleParams.labelColMD}
          style={styleParams.labelColStyle}
        >
          <span style={{ fontWeight: 'bold' }}>DeSo Price:</span>
        </Col>
        <Col xs={styleParams.valueColXS} sm={styleParams.valueColSM} md={styleParams.valueColMD}>
          <span>{`$${desoData.desoPrice}`}</span>
        </Col>
      </Row>
      <Row>
        <Col
          xs={styleParams.labelColXS}
          sm={styleParams.labelColSM}
          md={styleParams.labelColMD}
          style={styleParams.labelColStyle}
        >
          <span style={{ fontWeight: 'bold' }}>Transaction Fee:</span>
        </Col>
        <Col xs={styleParams.valueColXS} sm={styleParams.valueColSM} md={styleParams.valueColMD}>
          <span>{`$${parentState.feePerTransactionUSD} per transaction`}</span>
        </Col>
      </Row>
      <Row>
        <Col
          xs={styleParams.labelColXS}
          sm={styleParams.labelColSM}
          md={styleParams.labelColMD}
          style={styleParams.labelColStyle}
        >
          <span style={{ fontWeight: 'bold' }}>Transaction Fee Total:</span>
        </Col>
        <Col xs={styleParams.valueColXS} sm={styleParams.valueColSM} md={styleParams.valueColMD}>
          <span
            style={{ color: state.transactionFeeExceeded ? 'red' : '' }}
          >{`$${state.totalFeeUSD} (~${state.totalFeeDESO} $DESO)`}</span>
        </Col>
      </Row>
      {parentState.distributionAmountEnabled ? (
        <>
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
                status={state.amountExceeded ? 'error' : null}
                prefix={parentState.distributionType}
                placeholder='0'
                value={parentState.distributionAmount}
                style={{ width: 250 }}
                onChange={handleDistributionAmount}
              />
            </Col>
          </Row>
        </>
      ) : null}
      <Divider style={{ margin: '10px 0' }} />
      <Row justify='center'>
        <Col>
          <Popconfirm
            title='Are you sure you want to execute payments to the below'
            okText='Yes'
            cancelText='No'
            // onConfirm={handleExecute}
            // disabled={
            //   isExecuting ||
            //   validationMessage ||
            //   !transactionType ||
            //   !paymentType ||
            //   !amount ||
            //   validateExecution()
            // }
          >
            <Button
              style={{ color: 'green', borderColor: 'green', backgroundColor: 'white' }}
              icon={<RightCircleOutlined />}
              size='large'
            >
              Execute Distribution
            </Button>
          </Popconfirm>
        </Col>
      </Row>
    </Card>
  )
}

export default SummaryCard
