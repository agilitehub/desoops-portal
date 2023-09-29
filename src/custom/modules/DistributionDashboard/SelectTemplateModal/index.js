import React from 'react'
import { Col, Divider, Modal, Popconfirm, Row, Table } from 'antd'
import { EditOutlined, DeleteOutlined } from '@ant-design/icons'
import TemplateNameModal from '../TemplateNameModal'

const SelectTemplateModal = ({
  isOpen,
  templates,
  onCancel,
  deviceType,
  templateNameModal,
  distributionTemplates,
  onSetTemplateName,
  onSelectTemplate,
  onCancelTemplateNameModal,
  onDeleteTemplate,
  setRootState
}) => {
  const handleEditTemplate = async (tmpRecord) => {
    setRootState({
      templateNameModal: { ...templateNameModal, isOpen: true, id: tmpRecord._id, name: tmpRecord.name }
    })
  }

  const tableColumns = [
    {
      title: 'Setups',
      dataIndex: 'name',
      onCell: (record) => {
        return {
          onClick: () => {
            onSelectTemplate(record._id)
          },
          style: {
            cursor: 'pointer'
          }
        }
      }
    },
    {
      title: 'Actions',
      key: 'actions',
      onCell: () => {
        return {
          style: {
            width: '100px'
          }
        }
      },
      render: (text, record) => (
        <span>
          <EditOutlined style={styleProps.editButton} onClick={() => handleEditTemplate(record)} />
          <Divider type='vertical' style={{ border: 'none' }} />
          <Popconfirm
            title='Delete Setup'
            description='Are you sure to delete this Setup?'
            onConfirm={() => onDeleteTemplate(record._id)}
            okText='Yes'
            cancelText='No'
          >
            <DeleteOutlined style={styleProps.deleteButton} />
          </Popconfirm>
        </span>
      )
    }
  ]

  const styleProps = {
    editButton: {
      color: '#FF7F50',
      fontSize: 20
    },
    deleteButton: {
      color: '#DC3645',
      borderStyle: 'none'
    }
  }

  return (
    <>
      <Modal
        open={isOpen}
        title={'Select Setup Template'}
        cancelText='Close'
        onCancel={onCancel}
        cancelButtonProps={{
          style: { color: '#188EFF' }
        }}
        okButtonProps={{ style: { display: 'none' } }}
      >
        <Row style={{ marginTop: 20, justifyContent: 'center' }}>
          {templates.length > 0 ? (
            <Col span={24}>
              <Table columns={tableColumns} dataSource={templates} bordered size='small' pagination={false} />
            </Col>
          ) : (
            <Col span={24}>
              <center>
                <p>
                  You do not have any saved Setup templates. At the bottom of the "Setup & Config" Section, you will
                  have an option to save the current setup as a template once enough configurations have been provided.
                </p>
              </center>
            </Col>
          )}
        </Row>
      </Modal>
      {templateNameModal.isOpen ? (
        <TemplateNameModal
          isOpen={templateNameModal.isOpen}
          templateNameModal={templateNameModal}
          deviceType={deviceType}
          isLoading={false}
          distributionTemplates={distributionTemplates}
          onSetTemplateName={onSetTemplateName}
          onCancel={onCancelTemplateNameModal}
        />
      ) : null}
    </>
  )
}

export default SelectTemplateModal
