import React, { useReducer } from 'react'
import { App, Card, Button, Dropdown, Space, Modal, Row, Col, Divider, Tooltip } from 'antd'
import { DownOutlined, UserOutlined, ReloadOutlined, CopyOutlined, RollbackOutlined } from '@ant-design/icons'
import { copyTextToClipboard } from '../../../lib/utils'
import RandomizeDialogContent from './RandomizeDialog'
import Enums from '../../../lib/enums'
import { getFollowersOrFollowing } from '../../../lib/deso-controller'
import { prepUsersForClipboard } from '../controller'
import { updateFollowers, updateFollowing } from '../../../reducer'
import { useDispatch } from 'react-redux'

const initialState = {
  ctcLoading: false,
  resetLoading: false,
  refreshLoading: false,
  returnLoading: false,
  loadRandomizeModal: false,
  randomUserKey: null,
  randomizeInProgress: false,
  randomUsers: 0
}

const styleParams = {
  labelColStyle: { marginTop: 4 },
  dividerStyle: { margin: '7px 0' }
}

const reducer = (state, newState) => ({ ...state, ...newState })

const QuickActionsCard = ({ desoData, onResetDashboard, onRefreshWallet, rootState }) => {
  const dispatch = useDispatch()
  const { modal, message } = App.useApp()
  const [state, setState] = useReducer(reducer, initialState)

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
      title: 'Refresh Dashboard Values',
      content: 'Are you sure you want to refresh the Dashboard values? This action cannot be undone.',
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
    await onRefreshWallet()
    message.success('Refresh Confirmed')
    setState({ refreshLoading: false })
  }

  const handleCopyToClipboard = async (item) => {
    let userList = null
    let numberToFetch = 0
    let alreadyFetched = false

    try {
      setState({ ctcLoading: true })

      switch (item.key) {
        case Enums.values.SELECTED_USERS:
          // Return a list of usernames from rootState.finalHodlers.username and only where isActive and isVisible are true
          userList = rootState.finalHodlers
            .filter((item) => item.isActive && item.isVisible)
            .map((item) => item.username)

          userList = await prepUsersForClipboard(userList)
          break
        case Enums.values.FOLLOWERS:
        case Enums.values.FOLLOWING:
          if (item.key === Enums.values.FOLLOWERS) {
            alreadyFetched = desoData.fetchedFollowers
            numberToFetch = desoData.profile.totalFollowers
            userList = desoData.profile.followers
          } else {
            alreadyFetched = desoData.fetchedFollowing
            numberToFetch = desoData.profile.totalFollowing
            userList = desoData.profile.following
          }

          if (!alreadyFetched) {
            userList = await getFollowersOrFollowing(desoData.profile.publicKey, item.key, numberToFetch)

            // Update State that we received followers/following
            if (item.key === Enums.values.FOLLOWERS) {
              dispatch(updateFollowers({ data: userList }))
            } else {
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
      message.error(e.message)
    }
  }

  const handleLoadRandomizeDialog = (item) => {
    setState({
      returnLoading: true,
      loadRandomizeModal: true,
      randomUserKey: item.key
    })
  }

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
    <Card title='Quick Actions' size='small' bodyStyle={{ height: 75 }}>
      <Row gutter={[16, 16]} style={{ textAlign: 'center' }}>
        <Col span={8}>
          <Col span={24}>
            <Button
              shape='circle'
              danger
              style={{ backgroundColor: 'white' }}
              icon={<RollbackOutlined />}
              loading={state.resetLoading}
              disabled={state.resetLoading || rootState.isExecuting}
              onClick={handleResetDashboard}
            />
            <div style={{ color: '#DC3847' }}>Reset</div>
          </Col>
        </Col>
        <Col span={8}>
          <Col span={24}>
            <Button
              shape='circle'
              style={{ color: '#FFC20E', borderColor: '#FFC20E', backgroundColor: 'white' }}
              icon={<ReloadOutlined />}
              loading={state.refreshLoading}
              disabled={state.refreshLoading || rootState.isExecuting}
              onClick={handleRefreshDashboardValues}
            />
            <div style={{ color: '#FFC20E' }}>Refresh</div>
          </Col>
        </Col>
        <Col span={8}>
          <Col span={24}>
            <Dropdown
              menu={{ items: dropdownItems, onClick: handleCopyToClipboard }}
              icon={<DownOutlined />}
              loading={state.ctcLoading}
              disabled={state.ctcLoading || rootState.isExecuting}
              trigger={['click']}
            >
              <Button
                shape='circle'
                style={{ color: '#800080', borderColor: '#800080' }}
                icon={<CopyOutlined />}
                loading={state.ctcLoading}
              />
            </Dropdown>
            <div style={{ color: '#800080' }}>Copy</div>
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
    </Card>
  )
}

const app = ({ desoData, onResetDashboard, onRefreshWallet, rootState }) => {
  return (
    <App>
      <QuickActionsCard
        desoData={desoData}
        onResetDashboard={onResetDashboard}
        onRefreshWallet={onRefreshWallet}
        rootState={rootState}
      />
    </App>
  )
}

export default app
