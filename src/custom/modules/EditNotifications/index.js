import React from 'react'
import { Modal, Form, Switch, Select, Card } from 'antd'
import { useDispatch } from 'react-redux'
import styles from './style.module.sass'
import { setEditNotificationsVisible } from '../../../custom/reducer'

const EditNotifications = ({ isVisible }) => {
  const dispatch = useDispatch()
  const [form] = Form.useForm()
  const [notificationsEnabled, setNotificationsEnabled] = React.useState(false)
  const [desoEnabled, setDesoEnabled] = React.useState(false)
  const [socialEnabled, setSocialEnabled] = React.useState(false)
  const [cryptoEnabled, setCryptoEnabled] = React.useState(false)

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

  const handleNotificationsChange = (enabled) => {
    setNotificationsEnabled(enabled)
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
      <Form
        form={form}
        layout='vertical'
        initialValues={{
          enableNotifications: true,
          diamondsThreshold: '2',
          diamondsPush: true,
          desoNotifications: true,
          desoPush: true,
          socialNotifications: true,
          socialPush: true,
          cryptoNotifications: true,
          cryptoPush: true
        }}
      >
        <Card styles={{ body: { padding: '12px' } }}>
          <Form.Item label='Enable Notifications' name='enableNotifications' style={{ marginBottom: 0 }}>
            <Switch checkedChildren='Yes' unCheckedChildren='No' onChange={handleNotificationsChange} />
          </Form.Item>
        </Card>

        {notificationsEnabled && (
          <div style={{ marginTop: 2 }}>
            {/* Diamonds Section */}
            <Card title='Diamonds' size='small' type='inner'>
              <Form.Item label='Notify me when I receive' name='diamondsThreshold'>
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
              <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                {form.getFieldValue('diamondsThreshold') !== 'none' && (
                  <Form.Item label='Enable Push' name='diamondsPush' style={{ marginBottom: 0, flex: 1 }}>
                    <Switch checkedChildren='Yes' unCheckedChildren='No' />
                  </Form.Item>
                )}
              </div>
            </Card>

            {/* DESO Section */}
            <Card title='$DESO' size='small' type='inner' style={{ marginTop: 2 }}>
              <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
                <Form.Item label='Notifications' name='desoNotifications' style={{ flex: 1, marginBottom: 0 }}>
                  <Switch checkedChildren='Yes' unCheckedChildren='No' onChange={setDesoEnabled} />
                </Form.Item>
                {desoEnabled && (
                  <Form.Item label='Enable Push' name='desoPush' style={{ flex: 1, marginBottom: 0 }}>
                    <Switch checkedChildren='Yes' unCheckedChildren='No' />
                  </Form.Item>
                )}
              </div>
            </Card>

            {/* Social/DAO Section */}
            <Card title='Social/DAO' size='small' type='inner' style={{ marginTop: 2 }}>
              <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
                <Form.Item label='Notifications' name='socialNotifications' style={{ flex: 1, marginBottom: 0 }}>
                  <Switch checkedChildren='Yes' unCheckedChildren='No' onChange={setSocialEnabled} />
                </Form.Item>
                {socialEnabled && (
                  <Form.Item label='Enable Push' name='socialPush' style={{ flex: 1, marginBottom: 0 }}>
                    <Switch checkedChildren='Yes' unCheckedChildren='No' />
                  </Form.Item>
                )}
              </div>
            </Card>

            {/* Other Crypto Section */}
            <Card title='Other Crypto' size='small' type='inner' style={{ marginTop: 2 }}>
              <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
                <Form.Item label='Notifications' name='cryptoNotifications' style={{ flex: 1, marginBottom: 0 }}>
                  <Switch checkedChildren='Yes' unCheckedChildren='No' onChange={setCryptoEnabled} />
                </Form.Item>
                {cryptoEnabled && (
                  <Form.Item label='Enable Push' name='cryptoPush' style={{ flex: 1, marginBottom: 0 }}>
                    <Switch checkedChildren='Yes' unCheckedChildren='No' />
                  </Form.Item>
                )}
              </div>
            </Card>
          </div>
        )}
      </Form>
    </Modal>
  )
}

export default EditNotifications
