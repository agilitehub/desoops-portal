import React from 'react'
import { Card, Row, Col, theme, Select, message, Divider, InputNumber } from 'antd'
import Enums from '../../../lib/enums'

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

const StepOneCard = ({ state, onDistributeTo, onDistributionType, onSetState }) => {
  const { token } = theme.useToken()

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
            onChange={(value) => onDistributeTo(value)}
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
                onChange={(value) => onDistributionType(value)}
                value={state.distributionType}
                style={{ width: 250 }}
              >
                <Select.Option value={Enums.values.EMPTY_STRING}>- Select -</Select.Option>
                <Select.Option value={Enums.paymentTypes.DESO}>$DESO</Select.Option>
                <Select.Option value={Enums.paymentTypes.DAO}>DAO Token</Select.Option>
                <Select.Option value={Enums.paymentTypes.CREATOR}>Creator Coin</Select.Option>
              </Select>
            </Col>
          </Row>
        </>
      ) : null}
      {state.distributionType !== Enums.values.EMPTY_STRING ? (
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
                addonBefore={state.distributionType}
                // disabled={state.distributeTo && state.distributionType && !state.isExecuting ? false : true}
                placeholder='Enter amount'
                value={state.distributionAmount}
                style={{ width: 250 }}
                onChange={(distributionAmount) => {
                  onSetState({ distributionAmount })
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
