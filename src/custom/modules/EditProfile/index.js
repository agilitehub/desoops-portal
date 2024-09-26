import React, { useEffect, useState } from 'react'
import { Col, Form, Input, message, Modal, Row, Space, Tooltip } from 'antd'
import { getSingleProfile, updateProfile } from 'deso-protocol'

import styles from './style.module.sass'
import { CopyTwoTone, LoadingOutlined, PlusOutlined } from '@ant-design/icons'
import { useDispatch } from 'react-redux'
import { setEditProfileVisible } from '../../reducer'

const EditProfile = ({ isVisible, desoData, setDeSoData }) => {
  const dispatch = useDispatch()
  const [loading, setLoading] = useState(false)
  const [imageUrl, setImageUrl] = useState(undefined)
  const [imageChanged, setImageChanged] = useState(false)

  const [form] = Form.useForm()

  const initialUsername = desoData.profile?.username || ''

  useEffect(() => {
    const handleValidateProfilePic = async () => {
      try {
        const response = await fetch(desoData.profile.profilePicUrl)
        if (response.status === 200) {
          setImageUrl(desoData.profile.profilePicUrl)
        } else {
          setImageUrl(undefined)
        }
      } catch (e) {}
    }

    if (desoData.profile?.profilePicUrl) {
      handleValidateProfilePic()
    }
    // eslint-disable-next-line
  }, [isVisible])

  const handleOk = async () => {
    let profileResponse = null

    setLoading(true)

    try {
      // Validate form first
      await form.validateFields()

      // Check if username exists
      profileResponse = await getSingleProfile({ Username: form.getFieldValue('username') })

      // When we get here it means the username exists
      if (profileResponse.Profile.Username && initialUsername !== profileResponse.Profile.Username) {
        form.setFields([
          {
            name: 'username',
            errors: [`Username ${form.getFieldValue('username')} already exists. Please try another username`]
          }
        ])
      } else {
        await handleOkExtended()
      }
    } catch (e1) {
      if (e1.message && e1.message.indexOf('could not find profile for username') > -1) {
        // When we get here it means that the username does not exist
        await handleOkExtended()
      }
    }

    setLoading(false)
  }

  const handleOkExtended = async () => {
    const updateObject = {
      UpdaterPublicKeyBase58Check: desoData.profile.publicKey,
      ProfilePublicKeyBase58Check: desoData.profile.publicKey,
      NewUsername: form.getFieldValue('username'),
      NewDescription: form.getFieldValue('bio'),
      MinFeeRateNanosPerKB: 1000,
      NewCreatorBasisPoints: 10000,
      NewStakeMultipleBasisPoints: 12500,
      ExtraData: {
        desoOpsUserProfilePrompt: 'false'
      }
    }

    try {
      if (imageChanged) {
        updateObject.NewProfilePic = imageUrl
      }

      await updateProfile(updateObject)

      dispatch(
        setDeSoData({
          ...desoData,
          profile: {
            ...desoData.profile,
            username: form.getFieldValue('username'),
            description: form.getFieldValue('bio'),
            profilePic: imageUrl
          }
        })
      )
      dispatch(setEditProfileVisible(false))
      setImageUrl(undefined)
      form.resetFields()
    } catch (e2) {
      if (e2.message) {
        message.error(e2.message)
      }
    }
  }

  const handleCancel = async () => {
    Modal.confirm({
      title: 'Confirmation',
      content: 'Are you sure you want to cancel editing your profile?',
      okText: 'Yes',
      cancelText: 'No',
      onOk: async () => {
        try {
          if (!desoData.profile?.extraData?.desoOpsUserProfilePrompt) {
            await updateProfile({
              UpdaterPublicKeyBase58Check: desoData.profile.publicKey,
              ProfilePublicKeyBase58Check: desoData.profile.publicKey,
              MinFeeRateNanosPerKB: 1000,
              NewCreatorBasisPoints: 10000,
              NewStakeMultipleBasisPoints: 12500,
              ExtraData: {
                desoOpsUserProfilePrompt: 'false'
              }
            })
          }

          dispatch(
            setDeSoData({
              ...desoData,
              profile: {
                ...desoData.profile,
                username: form.getFieldValue('username'),
                description: form.getFieldValue('bio'),
                profilePic: imageUrl
              }
            })
          )
          dispatch(setEditProfileVisible(false))
          setImageUrl(undefined)
          form.resetFields()
        } catch (e) {
          console.error(e)
        }
      }
    })
  }

  const getFileBase64 = (img, callback) => {
    const reader = new FileReader()
    reader.addEventListener('load', () => callback(reader.result))
    reader.readAsDataURL(img)
  }

  const handleFileChange = (files) => {
    if (files.length > 0) {
      getFileBase64(files[0], (url) => {
        setImageChanged(true)
        setImageUrl(url)
      })
    }
  }

  return (
    <Modal
      title={<center>Edit Your Profile</center>}
      open={isVisible}
      okText='Save'
      okButtonProps={{ className: styles.finishButton, loading: loading }}
      maskProps={{ style: { backgroundColor: 'rgba(0, 0, 0, 0.8)' } }}
      closable={false}
      maskClosable={false}
      onOk={handleOk}
      onCancel={handleCancel}
      className='full-screen-modal'
      destroyOnClose
    >
      <Row justify='center'>
        <Col>
          <div style={{ cursor: 'pointer', width: 150, height: 150, border: '1px dashed #aaa', borderRadius: '50%' }}>
            <input
              type='file'
              style={{ display: 'none' }}
              onChange={(e) => handleFileChange(e.target.files)}
              accept='image/*'
            />
            {imageUrl ? (
              <img
                src={imageUrl}
                alt='avatar'
                style={{ width: 150, height: 150, cursor: 'pointer', borderRadius: '50%' }}
                onClick={() => document.querySelector('input[type="file"]').click()}
              />
            ) : (
              <button
                style={{
                  border: 0,
                  background: 'none',
                  width: '100%',
                  height: '100%',
                  cursor: 'pointer',
                  color: '#aaa'
                }}
                onClick={() => document.querySelector('input[type="file"]').click()}
                type='button'
              >
                {loading ? <LoadingOutlined /> : <PlusOutlined />}
                <div style={{ marginTop: 8 }}>Add Profile Picture</div>
              </button>
            )}
          </div>
        </Col>
      </Row>
      <Row justify='center'>
        <Col span={24}>
          <Form
            layout='vertical'
            form={form}
            initialValues={{
              username: desoData.profile?.username || '',
              bio: desoData.profile?.description || ''
            }}
          >
            {desoData.profile?.publicKey ? (
              <Row style={{ marginTop: 20 }} justify='center'>
                <Col>
                  <Tooltip title='Copy your Public Key'>
                    <Space
                      style={{ cursor: 'pointer' }}
                      onClick={() => {
                        navigator.clipboard.writeText(desoData.profile.publicKey)
                        message.success('Public Key copied to clipboard')
                      }}
                    >
                      <CopyTwoTone />
                      <p>
                        {desoData.profile.publicKey.substring(0, 10)}...
                        {desoData.profile.publicKey.substring(desoData.profile.publicKey.length - 10)}
                      </p>
                    </Space>
                  </Tooltip>
                </Col>
              </Row>
            ) : undefined}
            <Row justify='center'>
              <Col span={24}>
                <Form.Item
                  name='username'
                  label='Username'
                  rules={[{ required: true, message: 'Please enter your username' }]}
                >
                  <Input placeholder='Enter your username' />
                </Form.Item>
              </Col>
            </Row>
            <Row justify='center'>
              <Col span={24}>
                <Form.Item name='bio' label='Your Bio'>
                  <Input.TextArea placeholder='Tell us about yourself...' rows={3} />
                </Form.Item>
              </Col>
            </Row>
          </Form>
        </Col>
      </Row>
    </Modal>
  )
}

export default EditProfile
