import React, { useEffect, useState } from 'react'
import { Row, Col, Select, Divider, Space, Image } from 'antd'
import Enums from '../../../../lib/enums'

// App Components
import DeSoNFTSearchModal from '../../../../reusables/components/DeSoNFTSearchModal'

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

const GenenralTab = ({
  rootState,
  onDistributeTo,
  onDistributionType,
  onTokenToUse,
  desoProfile,
  onConfirmNFT,
  onCancelNFT,
  setRootState
}) => {
  const [tokenOwnerList, setTokenOwnerList] = useState([])

  useEffect(() => {
    let tmpTokenOwnerList = []
    let tmpDAOBalance = 0
    let tmpCCBalance = 0
    let index = 0

    switch (rootState.distributionType) {
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
  }, [rootState.distributionType]) // eslint-disable-line react-hooks/exhaustive-deps

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
            disabled={rootState.isExecuting}
            onChange={(value) => onDistributeTo(value)}
            value={rootState.distributeTo}
            style={{ width: 250 }}
          >
            <Select.Option value={Enums.values.EMPTY_STRING}>- Select -</Select.Option>
            <Select.Option value={Enums.values.CREATOR}>Creator Coin Holders</Select.Option>
            <Select.Option value={Enums.values.DAO}>DAO Coin Holders</Select.Option>
            <Select.Option value={Enums.values.NFT}>NFT Owners</Select.Option>
          </Select>
        </Col>
      </Row>
      {rootState.distributeTo !== Enums.values.EMPTY_STRING ? (
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
                disabled={rootState.isExecuting}
                onChange={(value) => onDistributionType(value)}
                value={rootState.distributionType}
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
      {rootState.distributionType === Enums.paymentTypes.DAO ||
      rootState.distributionType === Enums.paymentTypes.CREATOR ? (
        <>
          <Divider style={styleParams.dividerStyle} />
          <Row>
            <Col
              xs={styleParams.labelColXS}
              sm={styleParams.labelColSM}
              md={styleParams.labelColMD}
              style={styleParams.labelColStyle}
            >
              <span style={{ fontWeight: 'bold' }}>{`${rootState.distributionType} Token to use:`}</span>
            </Col>
            <Col xs={styleParams.valueColXS} sm={styleParams.valueColSM} md={styleParams.valueColMD}>
              <Select
                disabled={rootState.isExecuting}
                onChange={(value) => onTokenToUse(value)}
                value={rootState.tokenToUse}
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
      <DeSoNFTSearchModal
        isOpen={rootState.openNftSearch}
        publicKey={desoProfile.publicKey}
        rootState={rootState}
        setRootState={setRootState}
        onConfirmNFT={onConfirmNFT}
        onCancelNFT={onCancelNFT}
      />
    </>
  )
}

export default GenenralTab
