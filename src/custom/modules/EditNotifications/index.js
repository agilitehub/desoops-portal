import React, { useEffect, useState } from 'react'
import { Modal, Form, Switch, Select, Card, Row, Col, Divider, Space, message, Button, Alert } from 'antd'
import { useDispatch, useSelector } from 'react-redux'
import styles from './style.module.sass'
import { setEditNotificationsVisible } from '../../../custom/reducer'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBell, faBellSlash } from '@fortawesome/free-regular-svg-icons'
import { updateUserRecord } from '../../../custom/lib/agilite-controller'
import { isMobile } from 'react-device-detect'
import { usePwaFeatures } from '../PWADetector/hooks'

const EditNotifications = ({ isVisible }) => {
  // Hooks
  const dispatch = useDispatch()
  const profile = useSelector((state) => state.custom.desoData.profile)
  const userProfileState = useSelector((state) => state.custom.configData.userProfile)
  const [form] = Form.useForm()
  const { notificationPermission, support } = usePwaFeatures()

  // State
  const [formState, setFormState] = React.useState({
    rules: {
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
  })
  const [loading, setLoading] = React.useState(false)
  const [errorMessage, setErrorMessage] = useState('')

  useEffect(() => {
    if (userProfileState) {
      setFormState(JSON.parse(JSON.stringify(userProfileState.notifications)))
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
    Modal.confirm({
      title: 'Confirmation',
      content: 'Are you sure you want to cancel?',
      okText: 'Yes',
      cancelText: 'No',
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

  const modalButtons = (
    <Row justify='center' align='middle' gutter={[16, 16]}>
      <Col>
        <Button disabled={loading} onClick={handleCancel}>
          Cancel
        </Button>
      </Col>
      <Col>
        <Button className={styles.finishButton} loading={loading} onClick={handleOk}>
          Save
        </Button>
      </Col>
    </Row>
  )

  const modalTitle = (
    <>
      <Row justify='center' align='middle'>
        <Col>Deposit Notification Settings</Col>
      </Row>
      {isMobile && (
        <Row justify='center' align='middle' style={{ marginTop: 8 }}>
          <Col>{modalButtons}</Col>
        </Row>
      )}
    </>
  )

  return (
    <Modal
      title={modalTitle}
      open={isVisible}
      footer={modalButtons}
      maskProps={{ style: { backgroundColor: 'rgba(0, 0, 0, 0.8)' } }}
      closable={false}
      maskClosable={false}
      className='full-screen-modal'
      destroyOnClose
    >
      <Form form={form} layout='vertical' initialValues={formState} onFieldsChange={handleFieldsChange}>
        <Card size='small' type='inner'>
          {errorMessage && (
            <Alert message='Warning' description={errorMessage} type='warning' showIcon style={{ marginTop: 10 }} />
          )}
          <div style={{ marginTop: 8 }}>
            <Row>
              <Col span={12}>
                <p style={{ marginBottom: 2, fontWeight: 600, fontSize: 15, textAlign: 'center' }}>In-app</p>
              </Col>
              <Col span={12} style={{ display: notificationPermission === 'denied' ? 'none' : 'block' }}>
                <p style={{ marginBottom: 2, fontWeight: 600, fontSize: 15, textAlign: 'center' }}>Push</p>
              </Col>
            </Row>
            <Divider style={{ margin: '1px 0' }} />
            <p style={{ marginBottom: 2, fontWeight: 600, fontSize: 14 }}>Diamonds</p>
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
              <Col span={12}>
                <center>
                  {formState.rules.diamonds.enabled !== 0 && (
                    <Form.Item name={['rules', 'diamonds', 'pushEnabled']}>
                      <Switch
                        style={{ display: notificationPermission === 'denied' ? 'none' : 'block' }}
                        checkedChildren={
                          <Space>
                            <FontAwesomeIcon icon={faBell} /> Yes
                          </Space>
                        }
                        unCheckedChildren={
                          <Space>
                            <FontAwesomeIcon icon={faBellSlash} /> No
                          </Space>
                        }
                      />
                    </Form.Item>
                  )}
                </center>
              </Col>
            </Row>
            <Divider style={{ margin: '1px 0' }} />
            <p style={{ marginBottom: 2, fontWeight: 600, fontSize: 14 }}>$DESO</p>
            <Row gutter={[16, 8]}>
              <Col span={12}>
                <Form.Item name={['rules', 'deso', 'enabled']}>
                  <Select>
                    <Select.Option value={true}>Enabled</Select.Option>
                    <Select.Option value={false}>Disabled</Select.Option>
                  </Select>
                </Form.Item>
              </Col>
              <Col span={12}>
                <center>
                  {formState.rules.deso.enabled && (
                    <Form.Item name={['rules', 'deso', 'pushEnabled']}>
                      <Switch
                        style={{ display: notificationPermission === 'denied' ? 'none' : 'block' }}
                        checkedChildren={
                          <Space>
                            <FontAwesomeIcon icon={faBell} /> Yes
                          </Space>
                        }
                        unCheckedChildren={
                          <Space>
                            <FontAwesomeIcon icon={faBellSlash} /> No
                          </Space>
                        }
                      />
                    </Form.Item>
                  )}
                </center>
              </Col>
            </Row>
            <Divider style={{ margin: '1px 0' }} />
            <p style={{ marginBottom: 2, fontWeight: 600, fontSize: 14 }}>Creator Coins</p>
            <Row gutter={[16, 8]}>
              <Col span={12}>
                <Form.Item name={['rules', 'creatorCoins', 'enabled']}>
                  <Select>
                    <Select.Option value={true}>Enabled</Select.Option>
                    <Select.Option value={false}>Disabled</Select.Option>
                  </Select>
                </Form.Item>
              </Col>
              <Col span={12}>
                <center>
                  {formState.rules.creatorCoins.enabled && (
                    <Form.Item name={['rules', 'creatorCoins', 'pushEnabled']}>
                      <Switch
                        style={{ display: notificationPermission === 'denied' ? 'none' : 'block' }}
                        checkedChildren={
                          <Space>
                            <FontAwesomeIcon icon={faBell} /> Yes
                          </Space>
                        }
                        unCheckedChildren={
                          <Space>
                            <FontAwesomeIcon icon={faBellSlash} /> No
                          </Space>
                        }
                      />
                    </Form.Item>
                  )}
                </center>
              </Col>
            </Row>
            <Divider style={{ margin: '1px 0' }} />
            <p style={{ marginBottom: 2, fontWeight: 600, fontSize: 14 }}>Social/DAO</p>
            <Row gutter={[16, 8]}>
              <Col span={12}>
                <Form.Item name={['rules', 'socialTokens', 'enabled']}>
                  <Select>
                    <Select.Option value={true}>Enabled</Select.Option>
                    <Select.Option value={false}>Disabled</Select.Option>
                  </Select>
                </Form.Item>
              </Col>
              <Col span={12}>
                <center>
                  {formState.rules.socialTokens.enabled && (
                    <Form.Item name={['rules', 'socialTokens', 'pushEnabled']}>
                      <Switch
                        style={{ display: notificationPermission === 'denied' ? 'none' : 'block' }}
                        checkedChildren={
                          <Space>
                            <FontAwesomeIcon icon={faBell} /> Yes
                          </Space>
                        }
                        unCheckedChildren={
                          <Space>
                            <FontAwesomeIcon icon={faBellSlash} /> No
                          </Space>
                        }
                      />
                    </Form.Item>
                  )}
                </center>
              </Col>
            </Row>
            <Divider style={{ margin: '1px 0' }} />
            <p style={{ marginBottom: 2, fontWeight: 600, fontSize: 14 }}>Other Crypto</p>
            <Row gutter={[16, 8]}>
              <Col span={12}>
                <Form.Item name={['rules', 'otherCrypto', 'enabled']}>
                  <Select>
                    <Select.Option value={true}>Enabled</Select.Option>
                    <Select.Option value={false}>Disabled</Select.Option>
                  </Select>
                </Form.Item>
              </Col>
              <Col span={12}>
                <center>
                  {formState.rules.otherCrypto.enabled && (
                    <Form.Item name={['rules', 'otherCrypto', 'pushEnabled']}>
                      <Switch
                        style={{ display: notificationPermission === 'denied' ? 'none' : 'block' }}
                        checkedChildren={
                          <Space>
                            <FontAwesomeIcon icon={faBell} /> Yes
                          </Space>
                        }
                        unCheckedChildren={
                          <Space>
                            <FontAwesomeIcon icon={faBellSlash} /> No
                          </Space>
                        }
                      />
                    </Form.Item>
                  )}
                </center>
              </Col>
            </Row>
          </div>
        </Card>
      </Form>
    </Modal>
  )
}

export default EditNotifications
