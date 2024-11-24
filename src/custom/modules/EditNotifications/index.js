import React from 'react'
import { Modal, Form, Switch, Select, Card, Row, Col, Divider, Space } from 'antd'
import { useDispatch } from 'react-redux'
import styles from './style.module.sass'
import { setEditNotificationsVisible } from '../../../custom/reducer'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBell, faBellSlash } from '@fortawesome/free-regular-svg-icons'

const EditNotifications = ({ isVisible }) => {
  const dispatch = useDispatch()
  const [form] = Form.useForm()
  const [formState, setFormState] = React.useState({
    enableNotifications: true,
    diamondsThreshold: 2,
    diamondsPush: true,
    desoNotifications: true,
    desoPush: true,
    socialNotifications: true,
    socialPush: true,
    cryptoNotifications: true,
    cryptoPush: true
  })

  const handleOk = () => {
    dispatch(setEditNotificationsVisible(false))
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
    const newState = allFields.reduce((acc, field) => {
      acc[field.name[0]] = field.value
      return acc
    }, {})
    setFormState((prev) => ({ ...prev, ...newState }))
  }

  return (
    <Modal
      title={<center>Edit Notifications</center>}
      open={isVisible}
      okText='Save'
      okButtonProps={{ className: styles.finishButton }}
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
          <Form.Item label='Enable Notifications' name='enableNotifications' style={{ marginBottom: 0 }}>
            <Switch checkedChildren='Yes' unCheckedChildren='No' />
          </Form.Item>

          {formState.enableNotifications && (
            <div style={{ marginTop: 10 }}>
              <Row>
                <Col span={12}>
                  <p style={{ marginBottom: 3, fontWeight: 600, fontSize: 15, textAlign: 'center' }}>In App</p>
                </Col>
                <Col span={12}>
                  <p style={{ marginBottom: 3, fontWeight: 600, fontSize: 15, textAlign: 'center' }}>Push</p>
                </Col>
              </Row>
              <Divider style={{ margin: '8px 0' }} />
              <p style={{ marginBottom: 3, fontWeight: 600, fontSize: 14 }}>Diamonds</p>
              <Row gutter={[16, 16]}>
                <Col span={12}>
                  <Form.Item name='diamondsThreshold'>
                    <Select>
                      <Select.Option value='none'>None</Select.Option>
                      <Select.Option value='1'>1+ Diamonds</Select.Option>
                      <Select.Option value='2'>2+ Diamonds</Select.Option>
                      <Select.Option value='3'>3+ Diamonds</Select.Option>
                      <Select.Option value='4'>4+ Diamonds</Select.Option>
                      <Select.Option value='5'>5+ Diamonds</Select.Option>
                      <Select.Option value='6'>6+ Diamonds</Select.Option>
                    </Select>
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <center>
                    {formState.diamondsThreshold !== 'none' && (
                      <Form.Item name='diamondsPush'>
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
                  <Form.Item name='desoNotifications'>
                    <Select>
                      <Select.Option value={true}>Enabled</Select.Option>
                      <Select.Option value={false}>Disabled</Select.Option>
                    </Select>
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <center>
                    {formState.desoNotifications && (
                      <Form.Item name='desoPush'>
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
                  <Form.Item name='socialNotifications'>
                    <Select>
                      <Select.Option value={true}>Enabled</Select.Option>
                      <Select.Option value={false}>Disabled</Select.Option>
                    </Select>
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <center>
                    {formState.socialNotifications && (
                      <Form.Item name='socialPush'>
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
                  <Form.Item name='cryptoNotifications'>
                    <Select>
                      <Select.Option value={true}>Enabled</Select.Option>
                      <Select.Option value={false}>Disabled</Select.Option>
                    </Select>
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <center>
                    {formState.cryptoNotifications && (
                      <Form.Item name='cryptoPush'>
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
          )}
        </Card>
      </Form>
    </Modal>
  )
}

export default EditNotifications
