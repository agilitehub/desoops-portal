import React from 'react'
import { Modal, Form, Switch, Select, Card, Row, Col, Divider } from 'antd'
import { useDispatch } from 'react-redux'
import styles from './style.module.sass'
import { setEditNotificationsVisible } from '../../../custom/reducer'

const EditNotifications = ({ isVisible }) => {
  const dispatch = useDispatch()
  const [form] = Form.useForm()
  const [formState, setFormState] = React.useState({
    enableNotifications: true,
    diamondsThreshold: '2',
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
              <Divider style={{ margin: '8px 0' }} />
              <Row gutter={[16, 16]}>
                <Col span={12}>
                  <Form.Item label='Diamonds' name='diamondsThreshold'>
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
                  {formState.diamondsThreshold !== 'none' && (
                    <Form.Item label='Enable Push' name='diamondsPush'>
                      <Switch checkedChildren='Yes' unCheckedChildren='No' />
                    </Form.Item>
                  )}
                </Col>
              </Row>

              <Divider style={{ margin: '8px 0' }} />

              <Row gutter={[16, 16]}>
                <Col span={12}>
                  <Form.Item label='$DESO' name='desoNotifications'>
                    <Switch checkedChildren='Yes' unCheckedChildren='No' />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  {formState.desoNotifications && (
                    <Form.Item label='Enable Push' name='desoPush'>
                      <Switch checkedChildren='Yes' unCheckedChildren='No' />
                    </Form.Item>
                  )}
                </Col>
              </Row>

              <Divider style={{ margin: '8px 0' }} />

              <Row gutter={[16, 16]}>
                <Col span={12}>
                  <Form.Item label='Social/DAO' name='socialNotifications'>
                    <Switch checkedChildren='Yes' unCheckedChildren='No' />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  {formState.socialNotifications && (
                    <Form.Item label='Enable Push' name='socialPush'>
                      <Switch checkedChildren='Yes' unCheckedChildren='No' />
                    </Form.Item>
                  )}
                </Col>
              </Row>

              <Divider style={{ margin: '8px 0' }} />

              <Row gutter={[16, 16]}>
                <Col span={12}>
                  <Form.Item label='Other Crypto' name='cryptoNotifications'>
                    <Switch checkedChildren='Yes' unCheckedChildren='No' />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  {formState.cryptoNotifications && (
                    <Form.Item label='Enable Push' name='cryptoPush'>
                      <Switch checkedChildren='Yes' unCheckedChildren='No' />
                    </Form.Item>
                  )}
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
