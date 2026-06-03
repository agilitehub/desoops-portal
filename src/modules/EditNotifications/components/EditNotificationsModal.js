import React, { useEffect, useState } from 'react'
import { Modal, Form, Switch, Select, Card, Row, Col, Divider, Space, message, Alert } from 'antd'
import { useDispatch, useSelector } from 'react-redux'
import { setEditNotificationsVisible } from 'core/store/slices/custom/reducer'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBell, faBellSlash } from '@fortawesome/free-regular-svg-icons'
import { updateUserRecord } from 'core/infra/agilite-controller'
import { showStaticConfirm } from 'core/utils/confirmModal'
import { usePwaFeatures } from '../../PWADetector/hooks'

/** Default rule rows — merged with API payload so older profiles missing keys (e.g. socialTokens) never break the form. */
const DEFAULT_NOTIFICATION_RULES = {
  diamonds: {
    enabled: 2,
    pushEnabled: true
  },
  deso: {
    enabled: true,
    pushEnabled: true
  },
  creatorCoins: {
    enabled: true,
    pushEnabled: true
  },
  socialTokens: {
    enabled: true,
    pushEnabled: true
  },
  otherCrypto: {
    enabled: true,
    pushEnabled: true
  }
}

function mergeNotificationsFromProfile(saved) {
  const rules = JSON.parse(JSON.stringify(DEFAULT_NOTIFICATION_RULES))
  const incoming = saved && typeof saved === 'object' ? saved : {}
  const incomingRules = incoming.rules && typeof incoming.rules === 'object' ? incoming.rules : {}

  for (const key of Object.keys(DEFAULT_NOTIFICATION_RULES)) {
    const patch = incomingRules[key]
    rules[key] =
      patch && typeof patch === 'object'
        ? { ...DEFAULT_NOTIFICATION_RULES[key], ...patch }
        : rules[key]
  }

  const { rules: _r, ...rest } = incoming
  return { ...rest, rules }
}

const EditNotifications = ({ isVisible }) => {
  // Hooks
  const dispatch = useDispatch()
  const profile = useSelector((state) => state.custom.desoData.profile)
  const userProfileState = useSelector((state) => state.custom.configData.userProfile)
  const [form] = Form.useForm()
  const { notificationPermission, support } = usePwaFeatures()

  // State
  const [formState, setFormState] = React.useState(() => ({ rules: JSON.parse(JSON.stringify(DEFAULT_NOTIFICATION_RULES)) }))
  const [loading, setLoading] = React.useState(false)
  const [errorMessage, setErrorMessage] = useState('')

  useEffect(() => {
    if (userProfileState?.notifications) {
      setFormState(mergeNotificationsFromProfile(userProfileState.notifications))
    }
  }, [userProfileState])

  useEffect(() => {
    if (notificationPermission === 'denied') {
      let errorMessage =
        'Permission to receive push notifications was denied. To enable this, you will need to manually enable notifications in your browser settings and reload DeSoOps.'

      if (support && support.type === 'ios') {
        errorMessage =
          'Permission to receive push notifications was denied. To enable this, you will need to manually enable notifications in your iOS notification settings for the DeSoOps app.'
      }

      setErrorMessage(errorMessage)
    }
    // eslint-disable-next-line
  }, [notificationPermission, support])

  const handleOk = async () => {
    setLoading(true)
    try {
      await updateUserRecord(profile.publicKey, { 'notifications.rules': formState.rules })
    } catch (error) {
      message.error('Failed to save deposit notifications')
    } finally {
      setLoading(false)
      dispatch(setEditNotificationsVisible(false))
      message.success('Deposit notification settings saved')
    }
  }

  const handleCancel = () => {
    showStaticConfirm({
      title: 'Discard changes?',
      content: 'Are you sure you want to cancel?',
      okText: 'Yes, discard',
      cancelText: 'No',
      okType: 'danger',
      onOk: () => {
        dispatch(setEditNotificationsVisible(false))
      }
    })
  }

  const handleFieldsChange = (_, allFields) => {
    const newState = { ...formState }

    allFields.forEach((field) => {
      const [category, subcategory, property] = field.name
      if (category === 'enabled') {
        newState.enabled = field.value
      } else if (category === 'rules') {
        newState.rules[subcategory][property] = field.value
      }
    })

    setFormState(newState)
  }

  const pushColClassName = notificationPermission === 'denied' ? 'hidden' : 'flex items-center justify-center'

  const pushSwitchProps = {
    checkedChildren: (
      <Space>
        <FontAwesomeIcon icon={faBell} /> Yes
      </Space>
    ),
    unCheckedChildren: (
      <Space>
        <FontAwesomeIcon icon={faBellSlash} /> No
      </Space>
    )
  }

  const renderPushSwitch = (name, visible) =>
    visible ? (
      <Form.Item name={name} className='notifications-push-switch !mb-0'>
        <Switch {...pushSwitchProps} />
      </Form.Item>
    ) : null

  return (
    <Modal
      title={
        <span className='dashboard-modal-title'>
          Deposit Notification{' '}
          <span className='text-[length:inherit] font-[inherit] leading-[inherit] tracking-[inherit] text-deso-orange'>
            Settings
          </span>
        </span>
      }
      open={isVisible}
      centered
      width={560}
      okText='Save'
      cancelText='Cancel'
      onOk={handleOk}
      onCancel={handleCancel}
      okButtonProps={{ className: 'dashboard-modal-primary-btn', loading }}
      cancelButtonProps={{ className: 'dashboard-modal-cancel-btn', disabled: loading }}
      closable={false}
      maskClosable={false}
      destroyOnClose
      classNames={{
        content: 'dashboard-modal-content',
        header: 'dashboard-modal-header',
        body: 'dashboard-modal-body',
        footer: 'dashboard-modal-footer'
      }}
    >
      <Form form={form} layout='vertical' initialValues={formState} onFieldsChange={handleFieldsChange}>
        <Card size='small' className='dashboard-card'>
          {errorMessage ? (
            <Alert
              message='Warning'
              description={errorMessage}
              type='warning'
              showIcon
              className='mb-3 rounded-lg'
            />
          ) : null}
          <div className='mt-1'>
            <Row>
              <Col span={12}>
                <p className='mb-0.5 text-center text-sm font-semibold text-foreground'>In-app</p>
              </Col>
              <Col span={12} className={notificationPermission === 'denied' ? 'hidden' : undefined}>
                <p className='mb-0.5 text-center text-sm font-semibold text-foreground'>Push</p>
              </Col>
            </Row>
            <Divider className='!my-1 !border-border/60' />
            <p className='mb-0.5 text-sm font-semibold text-foreground'>Diamonds</p>
            <Row gutter={[16, 8]}>
              <Col span={12}>
                <Form.Item name={['rules', 'diamonds', 'enabled']}>
                  <Select>
                    <Select.Option value={0}>None</Select.Option>
                    <Select.Option value={1}>1+ Diamonds</Select.Option>
                    <Select.Option value={2}>2+ Diamonds</Select.Option>
                    <Select.Option value={3}>3+ Diamonds</Select.Option>
                    <Select.Option value={4}>4+ Diamonds</Select.Option>
                    <Select.Option value={5}>5+ Diamonds</Select.Option>
                    <Select.Option value={6}>6+ Diamonds</Select.Option>
                  </Select>
                </Form.Item>
              </Col>
              <Col span={12} className={pushColClassName}>
                {renderPushSwitch(['rules', 'diamonds', 'pushEnabled'], formState.rules.diamonds.enabled !== 0)}
              </Col>
            </Row>
            <Divider className='!my-1 !border-border/60' />
            <p className='mb-0.5 text-sm font-semibold text-foreground'>$DESO</p>
            <Row gutter={[16, 8]}>
              <Col span={12}>
                <Form.Item name={['rules', 'deso', 'enabled']}>
                  <Select>
                    <Select.Option value={true}>Enabled</Select.Option>
                    <Select.Option value={false}>Disabled</Select.Option>
                  </Select>
                </Form.Item>
              </Col>
              <Col span={12} className={pushColClassName}>
                {renderPushSwitch(['rules', 'deso', 'pushEnabled'], formState.rules.deso.enabled)}
              </Col>
            </Row>
            <Divider className='!my-1 !border-border/60' />
            <p className='mb-0.5 text-sm font-semibold text-foreground'>Creator Coins</p>
            <Row gutter={[16, 8]}>
              <Col span={12}>
                <Form.Item name={['rules', 'creatorCoins', 'enabled']}>
                  <Select>
                    <Select.Option value={true}>Enabled</Select.Option>
                    <Select.Option value={false}>Disabled</Select.Option>
                  </Select>
                </Form.Item>
              </Col>
              <Col span={12} className={pushColClassName}>
                {renderPushSwitch(['rules', 'creatorCoins', 'pushEnabled'], formState.rules.creatorCoins.enabled)}
              </Col>
            </Row>
            <Divider className='!my-1 !border-border/60' />
            <p className='mb-0.5 text-sm font-semibold text-foreground'>Social/DAO</p>
            <Row gutter={[16, 8]}>
              <Col span={12}>
                <Form.Item name={['rules', 'socialTokens', 'enabled']}>
                  <Select>
                    <Select.Option value={true}>Enabled</Select.Option>
                    <Select.Option value={false}>Disabled</Select.Option>
                  </Select>
                </Form.Item>
              </Col>
              <Col span={12} className={pushColClassName}>
                {renderPushSwitch(['rules', 'socialTokens', 'pushEnabled'], formState.rules.socialTokens.enabled)}
              </Col>
            </Row>
            <Divider className='!my-1 !border-border/60' />
            <p className='mb-0.5 text-sm font-semibold text-foreground'>Other Crypto</p>
            <Row gutter={[16, 8]}>
              <Col span={12}>
                <Form.Item name={['rules', 'otherCrypto', 'enabled']}>
                  <Select>
                    <Select.Option value={true}>Enabled</Select.Option>
                    <Select.Option value={false}>Disabled</Select.Option>
                  </Select>
                </Form.Item>
              </Col>
              <Col span={12} className={pushColClassName}>
                {renderPushSwitch(['rules', 'otherCrypto', 'pushEnabled'], formState.rules.otherCrypto.enabled)}
              </Col>
            </Row>
          </div>
        </Card>
      </Form>
    </Modal>
  )
}

export default EditNotifications
