import React, { useEffect, useMemo, useRef, useState } from 'react'
import { Row, Col, Select, Divider, Space, Image, Switch, Spin, Button } from 'antd'
import { useApolloClient } from '@apollo/client'
import Enums from '../../../../lib/enums'

// App Components
import { debounce } from 'lodash'
import { Link } from 'react-scroll'
import { SEARCH_PROFILES } from 'custom/lib/graphql-models'
import { UsergroupAddOutlined } from '@ant-design/icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faGem } from '@fortawesome/free-regular-svg-icons'

const styleParams = {
  labelColXS: 24,
  labelColSM: 12,
  labelColMD: 7,
  valueColXS: 24,
  valueColSM: 12,
  valueColMD: 17,
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
  desoProfile,
  setRootState
}) => {
  const client = useApolloClient()

  const [tokenOwnerList, setTokenOwnerList] = useState([])
  const [showMyHodlers, setShowMyHodlers] = useState(false)
  const [showDeSoUser, setShowDeSoUser] = useState(false)
  const [showDistributionType, setShowDistributionType] = useState(false)
  const [showTokenToUse, setShowTokenToUse] = useState(false)
  const [myHoldersLabel, setMyHoldersLabel] = useState('')

  const styleProps = {
    select: { width: 200 },
    selectTokenToUse: { width: deviceType.isTablet ? '90%' : '100%' },
    fieldLabel: { fontSize: deviceType.isSmartphone ? 14 : 16, fontWeight: 'bold' },
    labelColStyle: { marginTop: deviceType.isSmartphone ? 0 : 4 },
    divider: { margin: deviceType.isMobile ? '3px 0' : '7px 0' },
    searchField: { width: '100%', fontSize: 16 },
    nftIcon: {
      borderRadius: 5,
      // marginLeft: deviceType.isSmartphone ? -10 : -15,
      marginTop: deviceType.isSmartphone ? -0 : -3,
      width: 25,
      height: 25
    },
    linkButton: {
      color: '#188EFF',
      fontSize: deviceType.isSmartphone ? 14 : 16,
      marginLeft: deviceType.isSmartphone ? -8 : 0
    }
  }

  // Create a useEffect that manages the state of what fields get displayed or hidden
  useEffect(() => {
    let tmpShowMyHodlers = false
    let tmpShowDeSoUser = false
    let tmpShowDistributionType = false
    let tmpShowTokenToUse = false
    let tmpMyHoldersLabel = ''

    if (rootState.distributeTo !== Enums.values.EMPTY_STRING) {
      tmpShowDistributionType = true

      if (
        [Enums.values.CREATOR, Enums.values.DAO, Enums.values.FOLLOWERS, Enums.values.FOLLOWING].includes(
          rootState.distributeTo
        )
      ) {
        tmpShowMyHodlers = true

        switch (rootState.distributeTo) {
          case Enums.values.CREATOR:
          case Enums.values.DAO:
            tmpMyHoldersLabel = 'My Holders?'
            break
          case Enums.values.FOLLOWERS:
            tmpMyHoldersLabel = 'My Followers?'
            break
          case Enums.values.FOLLOWING:
            tmpMyHoldersLabel = 'My Following?'
            break
        }

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
    setMyHoldersLabel(tmpMyHoldersLabel)
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

  const DebounceSelect = ({ debounceTimeout = 800, ...props }) => {
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

        const gqlProps = {
          filter: {
            username: {
              includesInsensitive: value
            }
          },
          first: Enums.defaults.USER_SEARCH_NUM_TO_FETCH,
          orderBy: 'USERNAME_ASC'
        }

        client.query({ query: SEARCH_PROFILES, variables: gqlProps, fetchPolicy: 'no-cache' }).then((newOptions) => {
          if (fetchId !== fetchRef.current) {
            // for fetch callback order
            return
          }

          const result = newOptions.data.profiles.nodes.map((entry) => {
            return {
              key: entry.publicKey,
              label: entry.username,
              value: entry.publicKey
            }
          })

          setOptions(result)
          setFetching(false)
        })
      }

      return debounce(loadOptions, debounceTimeout)
    }, [debounceTimeout])
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

  const handleManageList = () => {
    setRootState({ customListModal: { ...rootState.customListModal, isOpen: true } })
  }

  const handleSelectNFT = () => {
    setRootState({ openNftSearch: true })
  }

  const handleDiamondOptions = () => {
    setRootState({ diamondOptionsModal: { ...rootState.diamondOptionsModal, isOpen: true } })
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
          <Space size={0}>
            <Select
              disabled={rootState.isExecuting}
              onChange={(value) => onDistributeTo(value)}
              value={rootState.distributeTo}
              style={styleProps.select}
            >
              <Select.Option value={Enums.values.EMPTY_STRING}>- Select -</Select.Option>
              <Select.Option value={Enums.values.CREATOR}>Creator Coin Holders</Select.Option>
              <Select.Option value={Enums.values.DAO}>DAO Token Holders</Select.Option>
              <Select.Option value={Enums.values.NFT}>NFT Owners</Select.Option>
              <Select.Option value={Enums.values.FOLLOWERS}>Followers</Select.Option>
              <Select.Option value={Enums.values.FOLLOWING}>Following</Select.Option>
              <Select.Option value={Enums.values.POLL}>Poll Voters</Select.Option>
              <Select.Option value={Enums.values.CUSTOM}>Custom List</Select.Option>
            </Select>
            {rootState.distributeTo === Enums.values.CUSTOM ? (
              <Button
                type='link'
                onClick={handleManageList}
                style={styleProps.linkButton}
                icon={<UsergroupAddOutlined />}
              >
                Manage List
              </Button>
            ) : null}
            {rootState.distributeTo === Enums.values.NFT ? (
              <Button
                type='link'
                onClick={handleSelectNFT}
                style={styleProps.linkButton}
                icon={
                  rootState.nftMetaData.id ? (
                    <Image src={rootState.nftMetaData.imageUrl} style={styleProps.nftIcon} preview={false} />
                  ) : null
                }
              >
                Select NFT
              </Button>
            ) : null}
            {rootState.distributeTo === Enums.values.POLL ? (
              <Button
                type='link'
                onClick={handleSelectNFT}
                style={styleProps.linkButton}
                icon={
                  rootState.nftMetaData.id ? (
                    <Image src={rootState.nftMetaData.imageUrl} style={styleProps.nftIcon} preview={false} />
                  ) : null
                }
              >
                Select Poll
              </Button>
            ) : null}
          </Space>
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
                <b>{myHoldersLabel}</b>
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
                <b>Search DeSo User:</b>
              </span>
            </Col>
            <Col xs={styleParams.valueColXS} sm={styleParams.valueColSM} md={styleParams.valueColMD}>
              <DebounceSelect
                mode='multiple'
                value={rootState.distributeDeSoUser}
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
              <span style={styleProps.fieldLabel}>Distribution type:</span>
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
                <Select.Option value={Enums.paymentTypes.CREATOR}>Creator Coin</Select.Option>
                <Select.Option value={Enums.paymentTypes.DAO}>DAO Token</Select.Option>
                <Select.Option value={Enums.paymentTypes.DIAMONDS}>Diamonds</Select.Option>
              </Select>
              {rootState.distributionType === Enums.paymentTypes.DIAMONDS ? (
                <Button
                  type='link'
                  onClick={handleDiamondOptions}
                  style={styleProps.linkButton}
                  icon={<FontAwesomeIcon icon={faGem} />}
                >
                  Options
                </Button>
              ) : null}
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
