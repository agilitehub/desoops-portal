// Create a ReactJS Functional Component called StepOneCard
// Use Ant Design's Card Component, with a title of 'Start Here' and size of 'small'
// Use Ant Design's Row and Col Components to create a 2x2 grid

import React, { useEffect, useReducer } from 'react'
import { Card, Row, Col, Divider, InputNumber, Popconfirm, Button, Alert } from 'antd'
import Enums from '../../../lib/enums'
import { RightCircleOutlined } from '@ant-design/icons'
import { calculateEstimatedPayment } from '../controller'
import { distributionSummaryState } from '../data-models'
import { cloneDeep } from 'lodash'

const styleParams = {
  labelColXS: 12,
  labelColSM: 12,
  labelColMD: 10,
  valueColXS: 12,
  valueColSM: 12,
  valueColMD: 14,
  colRightXS: 24,
  labelColStyle: {},
  dividerStyle: { margin: '7px 0' },
  btnExecuteActive: { color: 'green', borderColor: 'green', backgroundColor: 'white' },
  btnExecuteInactive: { color: '#D5D5D5', borderColor: '#D5D5D5', backgroundColor: 'white' }
}

const reducer = (state, newState) => ({ ...state, ...newState })

const SummaryCard = ({ desoData, parentState, onSetState }) => {
  const [state, setState] = useReducer(reducer, distributionSummaryState())

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
      let warningMessages = []
      let isInFinalStage = false
      let executeDisabled = false
      let warningMsg = null
      let tokenToDistribute = ''

      if (isNaN(totalFeeUSD)) totalFeeUSD = 0
      if (isNaN(distributionAmount)) distributionAmount = 0
      if (isNaN(totalFeeDESO)) {
        totalFeeDESO = 0
      } else {
        totalFeeDESO = Math.ceil(totalFeeDESO * 10000) / 10000
      }

      if (totalFeeDESO >= desoData.profile.desoBalance) transactionFeeExceeded = true

      if (parentState.distributionType === Enums.paymentTypes.DESO) {
        tokenToDistribute = `${Enums.paymentTypes.DESO} (~${desoData.profile.desoBalance})`
        isInFinalStage = true

        if (totalFeeDESO + distributionAmount > desoData.profile.desoBalance) {
          amountExceeded = true
          warningMsg = 'The Amount exceeds your DESO Balance.'
        }
      } else {
        if (parentState.tokenToUse) {
          isInFinalStage = true

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
            tokenToDistribute = `${selectedToken.username} (~${selectedToken.tokenBalance})`

            if (distributionAmount > selectedToken.tokenBalance) {
              amountExceeded = true
              warningMsg = `The Amount exceeds your ${parentState.distributionType} Balance.`
            }
          }
        }
      }

      // Check to see if we need to display any warning messages, but only if most of the setup has been provided
      if (isInFinalStage) {
        if (transactionFeeExceeded) {
          warningMessages.push({ key: '1', value: 'The Transaction Fee exceeds your DESO Balance.' })
        }

        if (warningMsg) {
          warningMessages.push({ key: '2', value: warningMsg })
        }

        if (noOfPaymentTransactions === 0) {
          warningMessages.push({ key: '3', value: 'There are no users to distribute to.' })
        }
      }

      if (!parentState.distributionAmount || (isInFinalStage && warningMessages.length > 0)) {
        executeDisabled = true
      }

      setState({
        noOfPaymentTransactions,
        totalFeeUSD,
        totalFeeDESO,
        amountExceeded,
        transactionFeeExceeded,
        warningMessages,
        isInFinalStage,
        executeDisabled,
        tokenToDistribute
      })
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

  const handleDistributionAmount = async (distributionAmount) => {
    let desoPrice = null
    let finalHodlers = null

    // We need to update the estimatedPaymentToken and estimatedPaymentUSD values
    finalHodlers = cloneDeep(parentState.finalHodlers)
    if (parentState.distributionType === Enums.paymentTypes.DESO) desoPrice = desoData.desoPrice
    await calculateEstimatedPayment(finalHodlers, distributionAmount, parentState.spreadAmountBasedOn, desoPrice)
    onSetState({ distributionAmount, finalHodlers })
  }

  const handleExecute = async () => {}

  return (
    <Card title='Step 3: Distribution Summary' size='small'>
      <Row>
        <Col
          xs={styleParams.labelColXS}
          sm={styleParams.labelColSM}
          md={styleParams.labelColMD}
          style={styleParams.labelColStyle}
        >
          <span style={{ fontWeight: 'bold' }}>Total transactions:</span>
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
          <span style={{ fontWeight: 'bold' }}>DeSo price:</span>
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
          <span style={{ fontWeight: 'bold' }}>Transaction fee:</span>
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
          <span style={{ fontWeight: 'bold' }}>Distribution cost:</span>
        </Col>
        <Col xs={styleParams.valueColXS} sm={styleParams.valueColSM} md={styleParams.valueColMD}>
          <span
            style={{ color: state.transactionFeeExceeded ? 'red' : '' }}
          >{`$${state.totalFeeUSD} (~${state.totalFeeDESO} $DESO)`}</span>
        </Col>
      </Row>
      <Row>
        <Col
          xs={styleParams.labelColXS}
          sm={styleParams.labelColSM}
          md={styleParams.labelColMD}
          style={styleParams.labelColStyle}
        >
          <span style={{ fontWeight: 'bold' }}>Token to distribute:</span>
        </Col>
        <Col xs={styleParams.valueColXS} sm={styleParams.valueColSM} md={styleParams.valueColMD}>
          <span>{state.tokenToDistribute}</span>
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
                addonBefore={parentState.distributionType}
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
            onConfirm={handleExecute}
            disabled={state.isExecuting || state.executeDisabled}
          >
            <Button
              style={
                state.isExecuting || state.executeDisabled
                  ? styleParams.btnExecuteInactive
                  : styleParams.btnExecuteActive
              }
              icon={<RightCircleOutlined />}
              size='large'
              disabled={state.isExecuting || state.executeDisabled}
            >
              Execute Distribution
            </Button>
          </Popconfirm>
        </Col>
      </Row>
      {state.warningMessages.length > 0 ? (
        <>
          <Divider style={{ margin: '10px 0' }} />
          <Row justify='center'>
            <Col span={18}>
              <Alert
                message={<span style={{ fontWeight: 'bold', fontSize: 14 }}>Warning</span>}
                description={
                  <ul style={{ paddingInlineStart: 20, marginTop: -5, marginBottom: 0 }}>
                    {state.warningMessages.map((entry) => (
                      <li key={entry.key}>{entry.value}</li>
                    ))}
                  </ul>
                }
                type='warning'
                style={{ fontSize: 13, paddingBlock: 3, paddingInline: 10 }}
              />
            </Col>
          </Row>
        </>
      ) : null}
    </Card>
  )
}

export default SummaryCard
