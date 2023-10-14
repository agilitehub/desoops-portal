import React, { useState } from 'react'
import { Col, Input, Modal, Row, Spin } from 'antd'

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

  const handleOnOk = (e) => {
    // Validate that there is a value and is not the same as the passed value
    if (templateName && templateName !== templateNameModal.name) {
      // Check if the templateName already exists using case insensitive search
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
      // The templateName is not empty and is the same as the passed value
      onCancel()
    }
  }

  const handleOnChange = (e) => {
    setTemplateName(e.target.value)
  }

  return (
    <Modal
      open={isOpen}
      title={'Save Setup'}
      cancelText='Close'
      okText='Save'
      onCancel={onCancel}
      onOk={handleOnOk}
      cancelButtonProps={{
        style: { color: 'red' }
      }}
    >
      <Row style={{ marginTop: 20, justifyContent: 'center' }}>
        <Col span={24}>
          <Input
            status={errMsg ? 'error' : null}
            placeholder='Provide a name for this setup'
            value={templateName}
            // style={{ width: deviceType.isSmartphone ? '100%' : 250 }}
            disabled={isLoading}
            onChange={handleOnChange}
          />
        </Col>
        {errMsg ? (
          <Col span={24}>
            <span style={{ fontSize: 12, color: '#DC3645' }}>{errMsg}</span>
          </Col>
        ) : null}
        {isLoading ? (
          <Col span={24}>
            <Spin size='small' /> <span style={{ fontSize: 12 }}>Saving...</span>
          </Col>
        ) : null}
      </Row>
    </Modal>
  )
}

export default TemplateNameModal
