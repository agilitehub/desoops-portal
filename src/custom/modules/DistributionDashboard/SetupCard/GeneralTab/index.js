import React, { useEffect, useState } from 'react'
import { Row, Col, Select, Divider, Space, Image } from 'antd'
import Enums from '../../../../lib/enums'

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

const GenenralTab = ({ state, onDistributeTo, onDistributionType, onTokenToUse, onSetState, desoProfile }) => {
  const [tokenOwnerList, setTokenOwnerList] = useState([])

  useEffect(() => {
    let tmpTokenOwnerList = []
    let tmpDAOBalance = 0
    let tmpCCBalance = 0
    let index = 0

    switch (state.distributionType) {
      case Enums.paymentTypes.DAO:
        for (const entry of desoProfile.daoHodlings) {
          tmpTokenOwnerList.push({
            index: index.toString(),
            key: entry.publicKey,
            value: entry.publicKey,
            username: entry.username,
            imageUrl: entry.profilePicUrl,
            balance: entry.tokenBalance
          })

          index++
        }

        break
      case Enums.paymentTypes.CREATOR:
        for (const entry of desoProfile.ccHodlings) {
          tmpTokenOwnerList.push({
            index: index.toString(),
            key: entry.publicKey,
            value: entry.publicKey,
            username: entry.username,
            imageUrl: entry.profilePicUrl,
            balance: entry.tokenBalance
          })

          index++
        }

        break
      default:
        tmpTokenOwnerList = []
    }

    setTokenOwnerList(tmpTokenOwnerList)
  }, [state.distributionType]) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <>
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
      {state.distributionType === Enums.paymentTypes.DAO || state.distributionType === Enums.paymentTypes.CREATOR ? (
        <>
          <Divider style={styleParams.dividerStyle} />
          <Row>
            <Col
              xs={styleParams.labelColXS}
              sm={styleParams.labelColSM}
              md={styleParams.labelColMD}
              style={styleParams.labelColStyle}
            >
              <span style={{ fontWeight: 'bold' }}>{`${state.distributionType} Token to use:`}</span>
            </Col>
            <Col xs={styleParams.valueColXS} sm={styleParams.valueColSM} md={styleParams.valueColMD}>
              <Select
                disabled={state.isExecuting}
                onChange={(value) => onTokenToUse(value)}
                value={state.tokenToUse}
                style={{ width: 250 }}
              >
                <Select.Option value={Enums.values.EMPTY_STRING}>- Select -</Select.Option>
                {tokenOwnerList
                  .sort((a, b) => a.index.localeCompare(b.index))
                  .map((entry) => {
                    return (
                      <Select.Option key={entry.key} value={entry.value}>
                        <Space>
                          <Image
                            src={entry.imageUrl}
                            width={20}
                            height={20}
                            style={{ borderRadius: '50%', marginTop: -3 }}
                            fallback='https://openfund.com/images/ghost-profile-image.svg'
                            preview={false}
                          />
                          {`${entry.username} (~${entry.balance})`}
                        </Space>
                      </Select.Option>
                    )
                  })}
              </Select>
            </Col>
          </Row>
        </>
      ) : null}
    </>
  )
}

export default GenenralTab