import React, { useReducer } from 'react'
import { App, Card, Button, Modal, Row, Col } from 'antd'
import { ReloadOutlined, CopyOutlined, RollbackOutlined, LinkOutlined } from '@ant-design/icons'
import { copyTextToClipboard } from '../../../lib/utils'
import RandomizeDialogContent from './RandomizeDialog'
import { generateOptOutLink, prepUsersForClipboard } from '../controller'
import CoinSwapModal from '../../../reusables/components/CoinSwapModal'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBitcoinSign } from '@fortawesome/free-solid-svg-icons'
import AgiliteUtils from 'agilite-utils'

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

  const styleProps = {
    title: { fontSize: deviceType.isSmartphone ? 14 : 18 },
    headStyle: { background: '#DDE6ED', minHeight: deviceType.isSmartphone ? 30 : 40 },
    bodyStyle: { height: deviceType.isTablet ? 70 : 75 },
    actionWrapper: { marginTop: deviceType.isSmartphone ? -5 : -3 },
    iconReset: { color: '#17A2B8', borderColor: '#17A2B8', backgroundColor: 'white' },
    iconRefresh: { color: '#FFC20E', borderColor: '#FFC20E', backgroundColor: 'white' },
    iconCopy: { color: '#800080', borderColor: '#800080', backgroundColor: 'white' },
    iconOptOut: { color: '#DC3847', borderColor: '#DC3847', backgroundColor: 'white' },
    labelReset: { color: '#17A2B8', fontSize: deviceType.isSmartphone ? 12 : 16 },
    labelRefresh: { color: '#FFC20E', fontSize: deviceType.isSmartphone ? 12 : 16 },
    labelCopy: { color: '#800080', fontSize: deviceType.isSmartphone ? 12 : 16 },
    labelOptOut: { color: '#DC3847', fontSize: deviceType.isSmartphone ? 12 : 16 },
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
            <Button
              shape='circle'
              style={styleProps.iconCopy}
              icon={<CopyOutlined />}
              loading={state.ctcLoading}
              disabled={state.ctcLoading || rootState.isExecuting}
              onClick={handleCopyToClipboard}
            />
            <div style={styleProps.labelCopy}>Copy</div>
          </Col>
        </Col>
        <Col span={5}>
          <Col span={24} style={styleProps.actionWrapper}>
            <Button
              shape='circle'
              style={styleProps.iconOptOut}
              icon={<LinkOutlined />}
              loading={state.ctcLoading}
              disabled={state.ctcLoading || rootState.isExecuting}
              onClick={handleOptOutLink}
            />
            <div style={styleProps.labelOptOut}>Opt Out Link</div>
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
      {state.openCoinSwapModal && (
        <CoinSwapModal isOpen={state.openCoinSwapModal} onCloseModal={() => setState({ openCoinSwapModal: false })} />
      )}
    </Card>
  )
}

const app = ({ desoData, configData, onResetDashboard, onRefreshDashboard, rootState, deviceType }) => {
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

export default app
