import React from 'react'
import { Col, Modal, Row, Table } from 'antd'

const SelectTemplateModal = ({ isOpen, templates, onCancel, onSelectTemplate }) => {
  const tableColumns = [
    {
      title: 'Setups',
      dataIndex: 'name',
      style: { cursor: 'pointer' },
      onCell: () => {
        return {
          style: {
            cursor: 'pointer'
          }
        }
      }
    }
  ]

  return (
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
            <Table
              columns={tableColumns}
              dataSource={templates}
              bordered
              size='small'
              pagination={false}
              onRow={(record) => {
                return {
                  onClick: () => {
                    onSelectTemplate(record._id)
                  }
                }
              }}
            />
          </Col>
        ) : (
          <Col span={24}>
            <center>
              <p>
                You do not have any saved Setup templates. At the bottom of the "Setup & Config" Section, you will have
                an option to save the current setup as a template once enough configurations have been provided.
              </p>
            </center>
          </Col>
        )}
      </Row>
    </Modal>
  )
}

export default SelectTemplateModal
