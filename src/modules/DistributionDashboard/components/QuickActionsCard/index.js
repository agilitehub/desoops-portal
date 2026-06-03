import React, { lazy, Suspense, useReducer } from 'react'
import { App, Card, Button, Modal, Row, Col } from 'antd'
import {
  ReloadOutlined,
  CopyOutlined,
  RollbackOutlined,
  LinkOutlined,
  SwapOutlined
} from '@ant-design/icons'
import { copyTextToClipboard } from 'core/infra/utils'
import { showConfirm } from 'core/utils/confirmModal'
import RandomizeDialogContent from './RandomizeDialog'
import { generateOptOutLink, prepUsersForClipboard } from '../../controllers'
import AgiliteUtils from 'agilite-utils'

const CoinSwapModal = lazy(() => import('core/components/CoinSwapModal'))

const initialState = {
  ctcLoading: false,
  resetLoading: false,
  refreshLoading: false,
  returnLoading: false,
  loadRandomizeModal: false,
  openCoinSwapModal: false,
  randomUserKey: null,
  randomizeInProgress: false,
  randomUsers: 0
}

const reducer = (state, newState) => ({ ...state, ...newState })

const QuickActionsCard = ({ desoData, configData, onResetDashboard, onRefreshDashboard, rootState, deviceType }) => {
  const { modal, message } = App.useApp()
  const [state, setState] = useReducer(reducer, initialState)

  const bodyMinHeight = deviceType.isSmartphone ? 64 : deviceType.isTablet ? 78 : 82

  const handleResetDashboard = () => {
    setState({ resetLoading: true })

    showConfirm(modal, {
      title: 'Reset Dashboard',
      content: 'Are you sure you want to reset the dashboard? This action cannot be undone.',
      okText: 'Reset',
      cancelText: 'Cancel',
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

    showConfirm(modal, {
      title: 'Refresh Dashboard',
      content: 'Are you sure you want to refresh the Dashboard? This action cannot be undone.',
      okText: 'Refresh',
      cancelText: 'Cancel',
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
    setState({ openCoinSwapModal: true })
  }

  const handleCopyToClipboard = async () => {
    let userList = null
    let template = null
    let params = null
    try {
      setState({ ctcLoading: true })

      // Return a list of usernames from rootState.finalHodlers.username and only where isActive and isVisible are true
      userList = rootState.finalHodlers.filter(
        (item) => item.isActive && item.isVisible && item.hasUsername && !item.optedOut
      )
      userList = await prepUsersForClipboard(userList)

      // Prep Message to be copied to clipboard
      params = {
        username: desoData.profile.username,
        optOutLink: await generateOptOutLink(desoData.profile.publicKey),
        selectedUsers: userList.data
      }

      template = AgiliteUtils.compileTemplate(configData.optOutTemplate, params)

      if (userList.length > 0) {
        await copyTextToClipboard(template)
        message.success(`${userList.length} user(s) copied to clipboard`)
      } else {
        message.warning('No user(s) to copy to clipboard')
      }

      setState({ ctcLoading: false })
    } catch (e) {
      console.error(e)
      message.error(e.message, 5)
      setState({ ctcLoading: false })
    }
  }

  const handleOptOutLink = async () => {
    let optOutLink = null

    try {
      optOutLink = await generateOptOutLink(desoData.profile.publicKey)
      await copyTextToClipboard(optOutLink)
      message.success('Your Opt Out Link has been copied to the clipboard')
    } catch (e) {
      console.error(e)
      message.error(e.message, 5)
    }
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

  return (
    <Card
      title={<span className='font-semibold text-foreground text-sm sm:text-base'>Quick Actions</span>}
      size='small'
      className='dashboard-card dashboard-card-quick-actions h-full'
      styles={{ body: { minHeight: bodyMinHeight } }}
    >
      <Row className='w-full text-center' justify='space-around' align='middle' gutter={[4, 4]}>
        <Col className='flex flex-col items-center'>
          <Button
            shape='circle'
            className='dashboard-action-btn !border-info !text-info'
            icon={<RollbackOutlined />}
            loading={state.resetLoading}
            disabled={state.resetLoading || rootState.isExecuting}
            onClick={handleResetDashboard}
          />
          <div className='dashboard-action-label text-info'>Reset</div>
        </Col>
        <Col className='flex flex-col items-center'>
          <Button
            shape='circle'
            className='dashboard-action-btn !border-warning !text-warning'
            icon={<ReloadOutlined />}
            loading={state.refreshLoading}
            disabled={state.refreshLoading || rootState.isExecuting}
            onClick={handleRefreshDashboardValues}
          />
          <div className='dashboard-action-label text-warning'>Refresh</div>
        </Col>
        <Col className='flex flex-col items-center'>
          <Button
            shape='circle'
            className='dashboard-action-btn !border-[#800080] !text-[#800080]'
            icon={<CopyOutlined />}
            loading={state.ctcLoading}
            disabled={state.ctcLoading || rootState.isExecuting}
            onClick={handleCopyToClipboard}
          />
          <div className='dashboard-action-label text-[#800080]'>Copy</div>
        </Col>
        <Col className='flex flex-col items-center'>
          <Button
            shape='circle'
            className='dashboard-action-btn !border-error !text-error'
            icon={<LinkOutlined />}
            loading={state.ctcLoading}
            disabled={state.ctcLoading || rootState.isExecuting}
            onClick={handleOptOutLink}
          />
          <div className='dashboard-action-label text-error'>Opt Out Link</div>
        </Col>
        <Col className='flex flex-col items-center'>
          <Button
            shape='circle'
            className='dashboard-action-btn !border-success !text-success'
            icon={<SwapOutlined />}
            disabled={rootState.isExecuting}
            onClick={handleCoinSwap}
          />
          <div className='dashboard-action-label text-success'>Swap</div>
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
      {state.loadRandomizeModal ? (
        <Modal
          title={`Return Random Users From - ${state.randomUserKey}`}
          open
          onOk={handleCloseRandomizeDialog}
          okText='Close'
          cancelText='Copy Users To Clipboard'
          closable={false}
          maskClosable={false}
          keyboard={false}
          destroyOnHidden
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
      ) : null}
      {state.openCoinSwapModal ? (
        <Suspense fallback={null}>
          <CoinSwapModal
            isOpen={state.openCoinSwapModal}
            onCloseModal={() => setState({ openCoinSwapModal: false })}
          />
        </Suspense>
      ) : null}
    </Card>
  )
}

const QuickActionsCardWithApp = ({
  desoData,
  configData,
  onResetDashboard,
  onRefreshDashboard,
  rootState,
  deviceType
}) => {
  return (
    <App>
      <QuickActionsCard
        desoData={desoData}
        configData={configData}
        onResetDashboard={onResetDashboard}
        onRefreshDashboard={onRefreshDashboard}
        rootState={rootState}
        deviceType={deviceType}
      />
    </App>
  )
}

export default QuickActionsCardWithApp
