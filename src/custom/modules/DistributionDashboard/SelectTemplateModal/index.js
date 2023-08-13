import React from 'react'
import { Col, List, Modal, Row } from 'antd'

const SelectTemplateModal = ({ isOpen, templates, onCancel, onSelectTemplate }) => {
  return (
    <Modal
      open={isOpen}
      title={'Select Distribution Template'}
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
            <List
              size='small'
              itemLayout='horizontal'
              header='Saved Templates'
              dataSource={templates}
              renderItem={(entry) => (
                <List.Item>
                  <List.Item.Meta
                    description={
                      <div
                        style={{ cursor: 'pointer' }}
                        onClick={(e) => {
                          // onSelectTemplate
                          alert('Template selected')
                        }}
                      >
                        <span style={{ fontSize: 12 }}>Template Name</span>
                      </div>
                    }
                  />
                </List.Item>
              )}
            />
          </Col>
        ) : (
          <Col span={24}>
            <center>
              <p>
                You do not have any saved Distribution Templates. In the Payment Modal, once the distribution is
                completed, you will have an option to save the current distribution setup as a template.
              </p>
            </center>
          </Col>
        )}
      </Row>
    </Modal>
  )
}

export default SelectTemplateModal
