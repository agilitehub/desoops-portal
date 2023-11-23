import React, { useEffect, useMemo, useRef, useState } from 'react'
import { Row, Col, Select, Divider, Space, Image, Switch, Spin } from 'antd'
import Enums from '../../../../lib/enums'

// App Components
import { debounce } from 'lodash'
import { searchForUsers } from '../../../../lib/deso-controller-graphql'
import { Link } from 'react-scroll'

const styleParams = {
  labelColXS: 24,
  labelColSM: 12,
  labelColMD: 9,
  valueColXS: 24,
  valueColSM: 12,
  valueColMD: 15,
  colRightXS: 24
}

const GeneralTab = ({
  rootState,
  deviceType,
  onDistributeTo,
  onDistributeMyHodlers,
  onDistributeDeSoUser,
  onDistributionType,
  onTokenToUse,
  desoProfile
}) => {
  const [tokenOwnerList, setTokenOwnerList] = useState([])
  const [showMyHodlers, setShowMyHodlers] = useState(false)
  const [showDeSoUser, setShowDeSoUser] = useState(false)
  const [showDistributionType, setShowDistributionType] = useState(false)
  const [showTokenToUse, setShowTokenToUse] = useState(false)

  const styleProps = {
    select: { width: 200 },
    selectTokenToUse: { width: deviceType.isTablet ? '90%' : '100%' },
    fieldLabel: { fontSize: deviceType.isSmartphone ? 14 : 16, fontWeight: 'bold' },
    labelColStyle: { marginTop: deviceType.isSmartphone ? 0 : 4 },
    divider: { margin: deviceType.isMobile ? '3px 0' : '7px 0' },
    searchField: { width: '100%', fontSize: 16 }
  }

  // Create a useEffect that manages the state of what fields get displayed or hidden
  useEffect(() => {
    let tmpShowMyHodlers = false
    let tmpShowDeSoUser = false
    let tmpShowDistributionType = false
    let tmpShowTokenToUse = false

    if (rootState.distributeTo !== Enums.values.EMPTY_STRING) {
      tmpShowDistributionType = true

      if ([Enums.values.CREATOR, Enums.values.DAO].includes(rootState.distributeTo)) {
        tmpShowMyHodlers = true

        if (!rootState.myHodlers) {
          tmpShowDeSoUser = true

          if (rootState.distributeDeSoUser.length === 0) {
            tmpShowDistributionType = false
            tmpShowTokenToUse = false
          }
        }
      }

      if (
        tmpShowDistributionType &&
        [Enums.paymentTypes.CREATOR, Enums.paymentTypes.DAO].includes(rootState.distributionType)
      ) {
        tmpShowTokenToUse = true
      }
    }

    setShowMyHodlers(tmpShowMyHodlers)
    setShowDeSoUser(tmpShowDeSoUser)
    setShowDistributionType(tmpShowDistributionType)
    setShowTokenToUse(tmpShowTokenToUse)
  }, [
    rootState.distributeTo,
    rootState.myHodlers,
    rootState.distributeDeSoUser,
    rootState.distributionType,
    rootState.tokenToUse
  ])

  useEffect(() => {
    let tmpTokenOwnerList = []
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

  const DebounceSelect = ({ fetchOptions, debounceTimeout = 800, ...props }) => {
    const [fetching, setFetching] = useState(false)
    const [options, setOptions] = useState([])
    const fetchRef = useRef(0)

    const debounceFetcher = useMemo(() => {
      const loadOptions = (value) => {
        // Only allow one value in field
        if (rootState.distributeDeSoUser.length > 0) return
        fetchRef.current += 1
        const fetchId = fetchRef.current
        setOptions([])
        setFetching(true)

        fetchOptions(value).then((newOptions) => {
          if (fetchId !== fetchRef.current) {
            // for fetch callback order
            return
          }
          setOptions(newOptions)
          setFetching(false)
        })
      }
      return debounce(loadOptions, debounceTimeout)
    }, [fetchOptions, debounceTimeout])
    return (
      <Link to='distributeDeSoUser' smooth={true} duration={500} offset={-100}>
        <Select
          id='distributeDeSoUser'
          labelInValue
          filterOption={false}
          onSearch={debounceFetcher}
          notFoundContent={fetching ? <Spin size='small' /> : null}
          {...props}
          options={options}
        />
      </Link>
    )
  }

  const fetchUserList = async (search) => {
    return await searchForUsers(desoProfile.publicKey, search, Enums.defaults.USER_SEARCH_NUM_TO_FETCH)
  }

  return (
    <>
      <Row>
        <Col
          xs={styleParams.labelColXS}
          sm={styleParams.labelColSM}
          md={styleParams.labelColMD}
          style={styleProps.labelColStyle}
        >
          <span style={styleProps.fieldLabel}>Distribute to:</span>
        </Col>
        <Col xs={styleParams.valueColXS} sm={styleParams.valueColSM} md={styleParams.valueColMD}>
          <Select
            disabled={rootState.isExecuting}
            onChange={(value) => onDistributeTo(value)}
            value={rootState.distributeTo}
            style={styleProps.select}
          >
            <Select.Option value={Enums.values.EMPTY_STRING}>- Select -</Select.Option>
            <Select.Option value={Enums.values.CREATOR}>Creator Coin Holders</Select.Option>
            <Select.Option value={Enums.values.DAO}>DAO Coin Holders</Select.Option>
            <Select.Option value={Enums.values.NFT}>NFT Owners</Select.Option>
            <Select.Option value={Enums.values.CUSTOM}>Custom List</Select.Option>
          </Select>
        </Col>
      </Row>
      {showMyHodlers ? (
        <>
          <Divider style={styleProps.divider} />
          <Row>
            <Col
              xs={styleParams.labelColXS}
              sm={styleParams.labelColSM}
              md={styleParams.labelColMD}
              style={styleProps.labelColStyle}
            >
              <span style={styleProps.fieldLabel}>
                <b>My Holders?</b>
              </span>
            </Col>
            <Col xs={styleParams.col1XS}>
              <Switch
                disabled={rootState.isExecuting}
                checked={rootState.myHodlers}
                checkedChildren='Yes'
                unCheckedChildren='No'
                onChange={onDistributeMyHodlers}
              />
            </Col>
          </Row>
        </>
      ) : null}
      {showDeSoUser ? (
        <>
          <Divider style={styleProps.divider} />
          <Row>
            <Col
              xs={styleParams.labelColXS}
              sm={styleParams.labelColSM}
              md={styleParams.labelColMD}
              style={styleProps.labelColStyle}
            >
              <span style={styleProps.fieldLabel}>
                <b>Search DeSo User</b>
              </span>
            </Col>
            <Col xs={styleParams.valueColXS} sm={styleParams.valueColSM} md={styleParams.valueColMD}>
              <DebounceSelect
                mode='multiple'
                value={rootState.distributeDeSoUser}
                fetchOptions={fetchUserList}
                onChange={(desoUser) => {
                  onDistributeDeSoUser(desoUser)
                }}
                style={styleProps.searchField}
              />
            </Col>
          </Row>
        </>
      ) : null}
      {showDistributionType ? (
        <>
          <Divider style={styleProps.divider} />
          <Row>
            <Col
              xs={styleParams.labelColXS}
              sm={styleParams.labelColSM}
              md={styleParams.labelColMD}
              style={styleProps.labelColStyle}
            >
              <span style={styleProps.fieldLabel}>Type of distribution:</span>
            </Col>
            <Col xs={styleParams.valueColXS} sm={styleParams.valueColSM} md={styleParams.valueColMD}>
              <Select
                disabled={rootState.isExecuting}
                onChange={(value) => onDistributionType(value)}
                value={rootState.distributionType}
                style={styleProps.select}
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
      {showTokenToUse ? (
        <>
          <Divider style={styleProps.divider} />
          <Row>
            <Col
              xs={styleParams.labelColXS}
              sm={styleParams.labelColSM}
              md={styleParams.labelColMD}
              style={styleProps.labelColStyle}
            >
              <span style={styleProps.fieldLabel}>{`${rootState.distributionType} Token to use:`}</span>
            </Col>
            <Col xs={styleParams.valueColXS} sm={styleParams.valueColSM} md={styleParams.valueColMD}>
              <Select
                disabled={rootState.isExecuting}
                onChange={(value, item) => onTokenToUse(value, item.label)}
                value={rootState.tokenToUse}
                style={styleProps.selectTokenToUse}
              >
                <Select.Option value={Enums.values.EMPTY_STRING}>- Select -</Select.Option>
                {tokenOwnerList
                  .sort((a, b) => a.index.localeCompare(b.index))
                  .map((entry) => {
                    return (
                      <Select.Option key={entry.key} value={entry.value} label={entry.username}>
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

export default GeneralTab
