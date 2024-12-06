import React, { useEffect } from 'react'
import { Modal, Form, Switch, Select, Card, Row, Col, Divider, Space, message } from 'antd'
import { useDispatch, useSelector } from 'react-redux'
import styles from './style.module.sass'
import { setEditNotificationsVisible } from '../../../custom/reducer'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBell, faBellSlash } from '@fortawesome/free-regular-svg-icons'
import { updateUserRecord } from '../../../custom/lib/agilite-controller'

const EditNotifications = ({ isVisible }) => {
  // Hooks
  const dispatch = useDispatch()
  const profile = useSelector((state) => state.custom.desoData.profile)
  const userProfileState = useSelector((state) => state.custom.configData.userProfile)
  const [form] = Form.useForm()

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

  useEffect(() => {
    if (userProfileState) {
      setFormState(JSON.parse(JSON.stringify(userProfileState.notifications)))
    }
  }, [userProfileState])

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

  return (
    <Modal
      title={<center>Deposit Notification Settings</center>}
      open={isVisible}
      okText='Save'
      cancelButtonProps={{ disabled: loading }}
      okButtonProps={{ className: styles.finishButton, loading }}
      maskProps={{ style: { backgroundColor: 'rgba(0, 0, 0, 0.8)' } }}
      closable={false}
      maskClosable={false}
      onOk={handleOk}
      onCancel={handleCancel}
      className='full-screen-modal'
      destroyOnClose
    >
      <Form form={form} layout='vertical' initialValues={formState} onFieldsChange={handleFieldsChange}>
        <Card size='small' type='inner'>
          <div style={{ marginTop: 10 }}>
            <Row>
              <Col span={12}>
                <p style={{ marginBottom: 3, fontWeight: 600, fontSize: 15, textAlign: 'center' }}>In-app</p>
              </Col>
              <Col span={12}>
                <p style={{ marginBottom: 3, fontWeight: 600, fontSize: 15, textAlign: 'center' }}>Push</p>
              </Col>
            </Row>
            <Divider style={{ margin: '8px 0' }} />
            <p style={{ marginBottom: 3, fontWeight: 600, fontSize: 14 }}>Diamonds</p>
            <Row gutter={[16, 16]}>
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
            <Divider style={{ margin: '8px 0' }} />
            <p style={{ marginBottom: 3, fontWeight: 600, fontSize: 14 }}>$DESO</p>
            <Row gutter={[16, 16]}>
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
            <Divider style={{ margin: '8px 0' }} />
            <p style={{ marginBottom: 3, fontWeight: 600, fontSize: 14 }}>Creator Coins</p>
            <Row gutter={[16, 16]}>
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
            <Divider style={{ margin: '8px 0' }} />
            <p style={{ marginBottom: 3, fontWeight: 600, fontSize: 14 }}>Social/DAO</p>
            <Row gutter={[16, 16]}>
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
            <Divider style={{ margin: '8px 0' }} />
            <p style={{ marginBottom: 3, fontWeight: 600, fontSize: 14 }}>Other Crypto</p>
            <Row gutter={[16, 16]}>
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
