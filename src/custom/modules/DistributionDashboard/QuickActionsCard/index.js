import React, { useReducer } from 'react'
import { Card, Button, Dropdown, message, Modal, Space, Row, Col, Divider } from 'antd'
import { DownOutlined, UserOutlined, ReloadOutlined, CopyOutlined } from '@ant-design/icons'
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

const QuickActionsCard = ({ desoData }) => {
  const dispatch = useDispatch()
  const [state, setState] = useReducer(reducer, initialState)

  const handleResetDashboard = () => {
    setState({ resetLoading: true })

    Modal.confirm({
      title: 'Reset Dashboard',
      content: 'Are you sure you want to reset the dashboard? This action cannot be undone.',
      okText: 'Confirm',
      okType: 'danger',
      onOk: () => {
        setState({ resetLoading: false })
        message.success('Reset Confirmed')
      },
      onCancel: () => {
        setState({ resetLoading: false })
        message.warning('Reset Cancelled')
      }
    })
  }

  const handleRefreshDashboardValues = () => {
    setState({ refreshLoading: true })

    Modal.confirm({
      title: 'Refresh Dashboard Values',
      content: 'Are you sure you want to refresh values in this Dashboard? This action cannot be undone.',
      okText: 'Confirm',
      okType: 'danger',
      onOk: () => {
        setState({ refreshLoading: false })
        message.success('Refresh Confirmed')
      },
      onCancel: () => {
        setState({ refreshLoading: false })
        message.warning('Refresh Cancelled')
      }
    })
  }

  const handleCopyToClipboard = async (item) => {
    let userList = null
    let numberToFetch = 0
    let alreadyFetched = false

    try {
      console.log(desoData)
      setState({ ctcLoading: true })

      switch (item.key) {
        case Enums.values.SELECTED_USERS:
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

          userList = await prepUsersForClipboard(userList, item.key)

          if (userList.length > 0) {
            await copyTextToClipboard(userList.data)
            message.success(`${userList.length} ${item.key} copied to clipboard`)
          } else {
            message.warning(`No ${item.key} to copy to clipboard`)
          }

          break
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
    <Card title='Quick Actions' size='small'>
      <Row>
        <Col xs={24} md={10}>
          <Button
            danger
            style={{ backgroundColor: 'white' }}
            icon={<ReloadOutlined />}
            loading={state.resetLoading}
            disabled={state.resetLoading}
            onClick={handleResetDashboard}
          >
            Reset Dashboard
          </Button>
        </Col>
        <Col xs={24} md={14}>
          <Button
            style={{ color: 'green', borderColor: 'green', backgroundColor: 'white' }}
            icon={<ReloadOutlined />}
            loading={state.refreshLoading}
            disabled={state.refreshLoading}
            onClick={handleRefreshDashboardValues}
          >
            Refresh Dashboard Values
          </Button>
        </Col>
      </Row>
      <Divider style={styleParams.dividerStyle} />
      <Row>
        <Col xs={24}>
          <Dropdown
            menu={{ items: dropdownItems, onClick: handleCopyToClipboard }}
            icon={<DownOutlined />}
            loading={state.ctcLoading}
            disabled={state.ctcLoading}
          >
            <Button
              type='primary'
              loading={state.ctcLoading}
              icon={
                state.ctcLoading ? (
                  <ReloadOutlined style={{ marginRight: 10 }} />
                ) : (
                  <CopyOutlined style={{ marginRight: 10 }} />
                )
              }
            >
              <Space>
                Copy To Clipboard
                <DownOutlined />
              </Space>
            </Button>
          </Dropdown>
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
            disabled={state.returnLoading}
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

export default QuickActionsCard
