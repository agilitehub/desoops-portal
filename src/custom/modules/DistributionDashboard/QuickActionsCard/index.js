import React, { useReducer } from 'react'
import { App, Card, Button, Modal, Row, Col } from 'antd'
import { ReloadOutlined, CopyOutlined, RollbackOutlined } from '@ant-design/icons'
import { copyTextToClipboard } from '../../../lib/utils'
import RandomizeDialogContent from './RandomizeDialog'
import { prepUsersForClipboard } from '../controller'
import HeroSwapModal from '../../../reusables/components/HeroSwapModal'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBitcoinSign } from '@fortawesome/free-solid-svg-icons'

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
  const { modal, message } = App.useApp()
  const [state, setState] = useReducer(reducer, initialState)

  const styleProps = {
    title: { fontSize: deviceType.isSmartphone ? 14 : 18 },
    headStyle: { minHeight: deviceType.isSmartphone ? 30 : 40 },
    bodyStyle: { height: deviceType.isSmartphone ? 58 : deviceType.isTablet ? 70 : 75 },
    actionWrapper: { marginTop: deviceType.isSmartphone ? -5 : -3 },
    iconReset: { color: '#DC3847', borderColor: '#DC3847', backgroundColor: 'white' },
    iconRefresh: { color: '#FFC20E', borderColor: '#FFC20E', backgroundColor: 'white' },
    iconCopy: { color: '#800080', borderColor: '#800080', backgroundColor: 'white' },
    labelReset: { color: '#DC3847', fontSize: deviceType.isSmartphone ? 12 : 16 },
    labelRefresh: { color: '#FFC20E', fontSize: deviceType.isSmartphone ? 12 : 16 },
    labelCopy: { color: '#800080', fontSize: deviceType.isSmartphone ? 12 : 16 },
    iconSwap: { color: '#4CAF50', borderColor: '#4CAF50', backgroundColor: 'white' },
    labelSwap: { color: '#4CAF50', fontSize: deviceType.isSmartphone ? 12 : 16 }
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

  const handleCopyToClipboard = async () => {
    let userList = null

    try {
      setState({ ctcLoading: true })

      // Return a list of usernames from rootState.finalHodlers.username and only where isActive and isVisible are true
      userList = rootState.finalHodlers.filter((item) => item.isActive && item.isVisible)
      userList = await prepUsersForClipboard(userList)

      if (userList.length > 0) {
        await copyTextToClipboard(userList.data)
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
      title={<span style={styleProps.title}>Quick Actions</span>}
      size='small'
      bodyStyle={styleProps.bodyStyle}
      headStyle={styleProps.headStyle}
    >
      <Row style={{ textAlign: 'center' }}>
        <Col span={6}>
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
        <Col span={6}>
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
        <Col span={6}>
          <Col span={24} style={styleProps.actionWrapper}>
            <Button
              shape='circle'
              style={styleProps.iconCopy}
              icon={<CopyOutlined onClick={handleCopyToClipboard} />}
              loading={state.ctcLoading}
              disabled={state.ctcLoading || rootState.isExecuting}
            />
            <div style={styleProps.labelCopy}>Copy Users</div>
          </Col>
        </Col>
        <Col span={6}>
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
