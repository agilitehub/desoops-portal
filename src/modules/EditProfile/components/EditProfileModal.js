import React, { useEffect, useRef, useState } from 'react'
import { Form, Input, message, Modal, Tooltip } from 'antd'
import { getSingleProfile, updateProfile } from 'deso-protocol'
import { showStaticConfirm } from 'core/utils/confirmModal'
import { LoadingOutlined, PlusOutlined } from '@ant-design/icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCopy } from '@fortawesome/free-solid-svg-icons'
import { useDispatch, useSelector } from 'react-redux'
import { setEditProfileVisible } from 'core/store/slices/custom/reducer'

const EditProfile = ({ isVisible, desoData, setDeSoData }) => {
  const dispatch = useDispatch()
  const profile = useSelector((state) => state.custom.desoData.profile)
  const [loading, setLoading] = useState(false)
  const [imageUrl, setImageUrl] = useState(undefined)
  const [imageChanged, setImageChanged] = useState(false)
  const fileInputRef = useRef(null)
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
      await form.validateFields()

      profileResponse = await getSingleProfile({ Username: form.getFieldValue('username') })

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
        await handleOkExtended()
      }
    }

    setLoading(false)
  }

  const handleOkExtended = async () => {
    const formValues = form.getFieldsValue()
    const updateObject = {
      UpdaterPublicKeyBase58Check: desoData.profile.publicKey,
      ProfilePublicKeyBase58Check: desoData.profile.publicKey,
      NewUsername: formValues.username,
      NewDescription: formValues.bio,
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
            username: formValues.username,
            description: formValues.bio,
            profilePic: imageUrl
          }
        })
      )

      dispatch(setEditProfileVisible(false))
      setImageUrl(undefined)
      setImageChanged(false)
      form.setFieldsValue({
        username: formValues.username,
        bio: formValues.bio
      })
    } catch (e2) {
      if (e2.message) {
        message.error(e2.message)
      }
    }
  }

  const handleCancel = async () => {
    showStaticConfirm({
      title: 'Cancel profile changes?',
      content: 'Are you sure you want to cancel editing your profile?',
      okText: 'Yes, cancel',
      cancelText: 'No',
      okType: 'danger',
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
          setImageChanged(false)
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

  const handleCopyPublicKey = () => {
    navigator.clipboard.writeText(desoData.profile.publicKey)
    message.success('Public Key copied to clipboard')
  }

  return (
    <Modal
      title={
        <span className='dashboard-modal-title'>
          Edit Your{' '}
          <span className='text-[length:inherit] font-[inherit] leading-[inherit] tracking-[inherit] text-deso-orange'>
            Profile
          </span>
        </span>
      }
      open={isVisible}
      centered
      width={520}
      okText='Save'
      cancelText='Cancel'
      okButtonProps={{ className: 'dashboard-modal-primary-btn', loading }}
      cancelButtonProps={{ className: 'dashboard-modal-cancel-btn', disabled: loading }}
      closable={false}
      maskClosable={false}
      onOk={handleOk}
      onCancel={handleCancel}
      destroyOnClose
      classNames={{
        content: 'dashboard-modal-content',
        header: 'dashboard-modal-header',
        body: 'dashboard-modal-body',
        footer: 'dashboard-modal-footer'
      }}
    >
      <div className='flex flex-col gap-4'>
        <div className='flex justify-center'>
          <div
            className='flex h-[150px] w-[150px] cursor-pointer items-center justify-center overflow-hidden rounded-full border border-dashed border-border-input bg-surface-muted/40 transition-colors hover:border-deso-orange/60'
            onClick={() => fileInputRef.current?.click()}
            onKeyDown={(e) => e.key === 'Enter' && fileInputRef.current?.click()}
            role='button'
            tabIndex={0}
          >
            <input
              ref={fileInputRef}
              type='file'
              className='hidden'
              onChange={(e) => handleFileChange(e.target.files)}
              accept='image/*'
            />
            {imageUrl ? (
              <img src={imageUrl} alt='Profile' className='h-full w-full object-cover' />
            ) : (
              <button
                type='button'
                className='flex h-full w-full cursor-pointer flex-col items-center justify-center border-0 bg-transparent text-muted'
                onClick={() => fileInputRef.current?.click()}
              >
                {loading ? <LoadingOutlined /> : <PlusOutlined className='text-2xl' />}
                <span className='mt-2 text-sm'>Add Profile Picture</span>
              </button>
            )}
          </div>
        </div>

        <Form
          layout='vertical'
          form={form}
          initialValues={{
            username: profile.username || '',
            bio: profile.description || ''
          }}
        >
          {desoData.profile?.publicKey ? (
            <div className='mb-2 flex justify-center'>
              <Tooltip title='Copy your Public Key'>
                <button
                  type='button'
                  className='inline-flex cursor-pointer items-center gap-2 border-0 bg-transparent p-0 text-sm text-deso-blue hover:text-deso-orange'
                  onClick={handleCopyPublicKey}
                >
                  <FontAwesomeIcon icon={faCopy} />
                  <span>
                    {desoData.profile.publicKey.substring(0, 10)}...
                    {desoData.profile.publicKey.substring(desoData.profile.publicKey.length - 10)}
                  </span>
                </button>
              </Tooltip>
            </div>
          ) : null}
          <Form.Item
            name='username'
            label='Username'
            rules={[{ required: true, message: 'Please enter your username' }]}
          >
            <Input placeholder='Enter your username' />
          </Form.Item>
          <Form.Item name='bio' label='Your Bio'>
            <Input.TextArea placeholder='Tell us about yourself...' rows={4} />
          </Form.Item>
        </Form>
      </div>
    </Modal>
  )
}

export default EditProfile
