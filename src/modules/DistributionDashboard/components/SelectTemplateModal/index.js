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
          <EditOutlined className='cursor-pointer text-xl text-deso-orange' onClick={() => handleEditTemplate(record)} />
          <Divider type='vertical' className='!border-none' />
          <Popconfirm
            title='Delete Setup'
            description='Are you sure to delete this Setup?'
            onConfirm={() => onDeleteTemplate(record._id)}
            okText='Yes'
            cancelText='No'
          >
            <DeleteOutlined className='cursor-pointer text-xl text-error' />
          </Popconfirm>
        </span>
      )
    }
  ]

  return (
    <>
      <Modal
        open={isOpen}
        title={
          <span className='dashboard-modal-title'>
            Select Setup{' '}
            <span className='text-[length:inherit] font-[inherit] leading-[inherit] tracking-[inherit] text-deso-orange'>
              Template
            </span>
          </span>
        }
        centered
        width={560}
        okText='Close'
        onOk={onCancel}
        cancelButtonProps={{ style: { display: 'none' } }}
        okButtonProps={{ className: 'dashboard-modal-primary-btn' }}
        classNames={{
          content: 'dashboard-modal-content',
          header: 'dashboard-modal-header',
          body: 'dashboard-modal-body',
          footer: 'dashboard-modal-footer'
        }}
      >
        {templates.length > 0 ? (
          <Table columns={tableColumns} dataSource={templates} bordered size='small' pagination={false} />
        ) : (
          <p className='m-0 text-center text-sm leading-relaxed text-muted'>
            You do not have any saved Setup Templates. At the top of the &quot;Setup &amp; Config&quot; section, you
            will have an option to save the current setup as a template once enough configurations have been provided.
          </p>
        )}
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
