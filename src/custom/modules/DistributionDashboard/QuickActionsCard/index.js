import React, { useReducer } from 'react'
import { App, Card, Button, Dropdown, Modal, Row, Col } from 'antd'
import {
  DownOutlined,
  UserOutlined,
  ReloadOutlined,
  CopyOutlined,
  RollbackOutlined,
  UploadOutlined
} from '@ant-design/icons'
import { copyTextToClipboard } from '../../../lib/utils'
import RandomizeDialogContent from './RandomizeDialog'
import Enums from '../../../lib/enums'
import { processFollowersOrFollowing } from '../../../lib/deso-controller-graphql'
import { prepUsersForClipboard } from '../controller'
import { updateFollowers, updateFollowing } from '../../../reducer'
import { useDispatch } from 'react-redux'
import HeroSwapModal from '../../../reusables/components/HeroSwapModal'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBitcoinSign } from '@fortawesome/free-solid-svg-icons'
import { useApolloClient } from '@apollo/client'
import { GET_FOLLOWERS, GET_FOLLOWING } from 'custom/lib/graphql-models'

const initialState = {
  ctcLoading: false,
  resetLoading: false,
  refreshLoading: false,
  returnLoading: false,
  loadRandomizeModal: false,
  openHeroSwapModal: false,
  randomUserKey: null,
  randomizeInProgress: false,
  randomUsers: 0
}

const reducer = (state, newState) => ({ ...state, ...newState })

const QuickActionsCard = ({ desoData, onResetDashboard, onRefreshDashboard, rootState, deviceType, setRootState }) => {
  const dispatch = useDispatch()
  const { modal, message } = App.useApp()
  const [state, setState] = useReducer(reducer, initialState)
  const client = useApolloClient()

  const styleProps = {
    title: { fontSize: deviceType.isSmartphone ? 14 : 18 },
    headStyle: { minHeight: deviceType.isSmartphone ? 30 : 40 },
    bodyStyle: { height: deviceType.isSmartphone ? 58 : deviceType.isTablet ? 70 : 75 },
    actionWrapper: { marginTop: deviceType.isSmartphone ? -5 : -3 },
    iconLoad: { color: '#188EFF', borderColor: '#188EFF', backgroundColor: 'white' },
    iconReset: { color: '#DC3847', borderColor: '#DC3847', backgroundColor: 'white' },
    iconRefresh: { color: '#FFC20E', borderColor: '#FFC20E', backgroundColor: 'white' },
    iconCopy: { color: '#800080', borderColor: '#800080', backgroundColor: 'white' },
    labelLoad: { color: '#188EFF', fontSize: deviceType.isSmartphone ? 12 : 16 },
    labelReset: { color: '#DC3847', fontSize: deviceType.isSmartphone ? 12 : 16 },
    labelRefresh: { color: '#FFC20E', fontSize: deviceType.isSmartphone ? 12 : 16 },
    labelCopy: { color: '#800080', fontSize: deviceType.isSmartphone ? 12 : 16 },
    iconSwap: { color: '#4CAF50', borderColor: '#4CAF50', backgroundColor: 'white' },
    labelSwap: { color: '#4CAF50', fontSize: deviceType.isSmartphone ? 12 : 16 }
  }

  const handleLoadSetup = () => {
    setRootState({ selectTemplateModal: { ...rootState.selectTemplateModal, isOpen: true } })
  }

  const handleResetDashboard = () => {
    setState({ resetLoading: true })

    modal.confirm({
      title: 'Reset Dashboard',
      content: 'Are you sure you want to reset the dashboard? This action cannot be undone.',
      okText: 'Confirm',
      okType: 'danger',
      onOk: async () => {
        await onResetDashboard()
        setState({ resetLoading: false })
        message.success('Reset Confirmed')
      },
      onCancel: () => {
        setState({ resetLoading: false })
      }
    })
  }

  const handleRefreshDashboardValues = () => {
    setState({ refreshLoading: true })

    modal.confirm({
      title: 'Refresh Dashboard',
      content: 'Are you sure you want to refresh the Dashboard? This action cannot be undone.',
      okText: 'Confirm',
      okType: 'danger',
      onOk: () => {
        handleRefreshDashboardValuesExtended()
      },
      onCancel: () => {
        setState({ refreshLoading: false })
      }
    })
  }

  const handleRefreshDashboardValuesExtended = async () => {
    await onRefreshDashboard()
    message.success('Refresh Confirmed')
    setState({ refreshLoading: false })
  }

  const handleCoinSwap = () => {
    setState({ openHeroSwapModal: true })
  }

  const handleCopyToClipboard = async (item) => {
    let userList = null
    let alreadyFetched = false
    let gqlProps = null

    try {
      setState({ ctcLoading: true })

      switch (item.key) {
        case Enums.values.SELECTED_USERS:
          // Return a list of usernames from rootState.finalHodlers.username and only where isActive and isVisible are true
          userList = rootState.finalHodlers.filter((item) => item.isActive && item.isVisible)
          userList = await prepUsersForClipboard(userList)
          break
        case Enums.values.FOLLOWERS:
        case Enums.values.FOLLOWING:
          if (item.key === Enums.values.FOLLOWERS) {
            alreadyFetched = desoData.fetchedFollowers
            userList = desoData.profile.followers
          } else {
            alreadyFetched = desoData.fetchedFollowing
            userList = desoData.profile.following
          }

          if (!alreadyFetched) {
            gqlProps = {
              publicKey: desoData.profile.publicKey
            }

            // Update State that we received followers/following
            if (item.key === Enums.values.FOLLOWERS) {
              userList = await client.query({ query: GET_FOLLOWERS, variables: gqlProps, fetchPolicy: 'no-cache' })
              userList = userList.data.accountByPublicKey.followers.nodes
              userList = await processFollowersOrFollowing(item.key, userList)
              dispatch(updateFollowers({ data: userList }))
            } else {
              userList = await client.query({ query: GET_FOLLOWING, variables: gqlProps, fetchPolicy: 'no-cache' })
              userList = userList.data.accountByPublicKey.following.nodes
              userList = await processFollowersOrFollowing(item.key, userList)
              dispatch(updateFollowing({ data: userList }))
            }
          }

          userList = await prepUsersForClipboard(userList)
          break
      }

      if (userList.length > 0) {
        await copyTextToClipboard(userList.data)
        message.success(`${userList.length} ${item.key} copied to clipboard`)
      } else {
        message.warning(`No ${item.key} to copy to clipboard`)
      }

      setState({ ctcLoading: false })
    } catch (e) {
      console.error(e)
      message.error(e.message, 5)
      setState({ ctcLoading: false })
    }
  }

  // const handleLoadRandomizeDialog = (item) => {
  //   setState({
  //     returnLoading: true,
  //     loadRandomizeModal: true,
  //     randomUserKey: item.key
  //   })
  // }

  const handleCloseRandomizeDialog = () => {
    setState({
      returnLoading: false,
      loadRandomizeModal: false,
      randomUserKey: null
    })
  }

  const setRandomizeState = (randomizeInProgress, randomUsers) => {
    setState({
      randomizeInProgress,
      randomUsers
    })
  }

  const dropdownItems = [
    {
      label: Enums.values.SELECTED_USERS,
      key: Enums.values.SELECTED_USERS,
      icon: <UserOutlined />
    },
    {
      label: Enums.values.FOLLOWERS,
      key: Enums.values.FOLLOWERS,
      icon: <UserOutlined />
    },
    {
      label: Enums.values.FOLLOWING,
      key: Enums.values.FOLLOWING,
      icon: <UserOutlined />
    }
  ]

  return (
    <Card
      title={<span style={styleProps.title}>Quick Actions</span>}
      size='small'
      bodyStyle={styleProps.bodyStyle}
      headStyle={styleProps.headStyle}
    >
      <Row style={{ textAlign: 'center' }}>
        <Col span={5}>
          <Col span={24} style={styleProps.actionWrapper}>
            <Button
              shape='circle'
              style={styleProps.iconLoad}
              icon={<UploadOutlined />}
              disabled={rootState.isExecuting}
              onClick={handleLoadSetup}
            />
            <div style={styleProps.labelLoad}>Load</div>
          </Col>
        </Col>
        <Col span={5}>
          <Col span={24} style={styleProps.actionWrapper}>
            <Button
              shape='circle'
              style={styleProps.iconReset}
              icon={<RollbackOutlined />}
              loading={state.resetLoading}
              disabled={state.resetLoading || rootState.isExecuting}
              onClick={handleResetDashboard}
            />
            <div style={styleProps.labelReset}>Reset</div>
          </Col>
        </Col>
        <Col span={5}>
          <Col span={24} style={styleProps.actionWrapper}>
            <Button
              shape='circle'
              style={styleProps.iconRefresh}
              icon={<ReloadOutlined />}
              loading={state.refreshLoading}
              disabled={state.refreshLoading || rootState.isExecuting}
              onClick={handleRefreshDashboardValues}
            />
            <div style={styleProps.labelRefresh}>Refresh</div>
          </Col>
        </Col>
        <Col span={5}>
          <Col span={24} style={styleProps.actionWrapper}>
            <Dropdown
              menu={{ items: dropdownItems, onClick: handleCopyToClipboard }}
              icon={<DownOutlined />}
              loading={state.ctcLoading}
              disabled={state.ctcLoading || rootState.isExecuting}
              trigger={['click']}
            >
              <Button shape='circle' style={styleProps.iconCopy} icon={<CopyOutlined />} loading={state.ctcLoading} />
            </Dropdown>
            <div style={styleProps.labelCopy}>Copy</div>
          </Col>
        </Col>
        <Col span={4}>
          <Col span={24} style={styleProps.actionWrapper}>
            <Button
              shape='circle'
              style={styleProps.iconSwap}
              icon={<FontAwesomeIcon icon={faBitcoinSign} />}
              disabled={rootState.isExecuting}
              onClick={handleCoinSwap}
            />
            <div style={styleProps.labelSwap}>Swap</div>
          </Col>
        </Col>
      </Row>
      {/* <Divider style={styleParams.dividerStyle} />
      <Row>
        <Col
          xs={styleParams.labelColXS}
          sm={styleParams.labelColSM}
          md={styleParams.labelColMD}
          style={styleParams.labelColStyle}
        >
          <Dropdown
            menu={{ items: dropdownItems, onClick: handleLoadRandomizeDialog }}
            icon={<DownOutlined />}
            loading={state.returnLoading}
            disabled={state.returnLoading || rootState.isExecuting}
          >
            <Button>
              <Space>
                Return Random Users From...
                <DownOutlined />
              </Space>
            </Button>
          </Dropdown>
        </Col>
      </Row> */}
      <Modal
        title={`Return Random Users From - ${state.randomUserKey}`}
        open={state.loadRandomizeModal}
        onOk={handleCloseRandomizeDialog}
        okText='Close'
        cancelText='Copy Users To Clipboard'
        closable={false}
        maskClosable={false}
        keyboard={false}
        okButtonProps={{
          disabled: state.randomizeInProgress
        }}
        cancelButtonProps={{
          disabled: !state.randomUsers || state.randomizeInProgress,
          style: { color: 'orange' }
        }}
      >
        <RandomizeDialogContent
          copyToClipboard={copyTextToClipboard}
          setRandomizeState={setRandomizeState}
          randomUserKey={state.randomUserKey}
        />
      </Modal>
      {state.openHeroSwapModal && (
        <HeroSwapModal isOpen={state.openHeroSwapModal} onCloseModal={() => setState({ openHeroSwapModal: false })} />
      )}
    </Card>
  )
}

const app = ({ desoData, onResetDashboard, onRefreshDashboard, rootState, deviceType, setRootState }) => {
  return (
    <App>
      <QuickActionsCard
        desoData={desoData}
        onResetDashboard={onResetDashboard}
        onRefreshDashboard={onRefreshDashboard}
        rootState={rootState}
        deviceType={deviceType}
        setRootState={setRootState}
      />
    </App>
  )
}

export default app
