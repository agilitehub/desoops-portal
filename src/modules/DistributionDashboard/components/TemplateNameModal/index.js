import React, { useState } from 'react'
import { Input, Modal, Spin } from 'antd'

const TemplateNameModal = ({
  isOpen,
  templateNameModal,
  onSetTemplateName,
  onCancel,
  isLoading,
  distributionTemplates
}) => {
  const [templateName, setTemplateName] = useState(templateNameModal.name)
  const [errMsg, setErrMsg] = useState('')

  const handleOnOk = () => {
    if (templateName && templateName !== templateNameModal.name) {
      const template = distributionTemplates.find(
        (template) =>
          templateNameModal.id !== template._id && template.name.toLowerCase() === templateName.toLowerCase()
      )

      if (template) {
        setErrMsg('Template Name already exists')
      } else {
        onSetTemplateName(templateName)
      }
    } else if (!templateName) {
      setErrMsg('Template Name cannot be empty')
    } else {
      onCancel()
    }
  }

  const handleOnChange = (e) => {
    setTemplateName(e.target.value)
  }

  return (
    <Modal
      open={isOpen}
      title={
        <span className='dashboard-modal-title'>
          Save{' '}
          <span className='text-[length:inherit] font-[inherit] leading-[inherit] tracking-[inherit] text-deso-orange'>
            Setup
          </span>
        </span>
      }
      centered
      width={480}
      cancelText='Close'
      okText='Save'
      onCancel={onCancel}
      onOk={handleOnOk}
      okButtonProps={{ className: 'dashboard-modal-primary-btn', loading: isLoading }}
      cancelButtonProps={{ className: 'dashboard-modal-cancel-btn', disabled: isLoading }}
      classNames={{
        content: 'dashboard-modal-content',
        header: 'dashboard-modal-header',
        body: 'dashboard-modal-body',
        footer: 'dashboard-modal-footer'
      }}
    >
      <div className='flex flex-col gap-2'>
        <Input
          status={errMsg ? 'error' : null}
          placeholder='Provide a name for this setup'
          value={templateName}
          disabled={isLoading}
          onChange={handleOnChange}
        />
        {errMsg ? <span className='text-xs text-error'>{errMsg}</span> : null}
        {isLoading ? (
          <div className='flex items-center gap-2 text-sm text-muted'>
            <Spin size='small' />
            <span>Saving...</span>
          </div>
        ) : null}
      </div>
    </Modal>
  )
}

export default TemplateNameModal
