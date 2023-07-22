import React, { useEffect, useState } from 'react'
import { Button, Col, Image, List, Modal, Progress, Row, Typography } from 'antd'
import { CheckCircleOutlined, CheckOutlined, CloseOutlined, SyncOutlined } from '@ant-design/icons'
import Enums from '../enums'

const { Text } = Typography

const PaymentModal = ({ props, onPaymentDone }) => {
  const [tipIndex, setTipIndex] = useState(0)

  useEffect(() => {
    let interval = null

    if (props.isOpen) {
      interval = setInterval(() => {
        setTipIndex((tipIndex + 1) % props.tips.length)
      }, 5000)
    }

    return () => (interval ? clearInterval(interval) : null)
  }, [tipIndex, props.isOpen]) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <Modal open={props.isOpen} footer={null} closable={false} title={props.status}>
      <Row>
        <Col span={24}>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            {props.status === Enums.paymentStatuses.SUCCESS ? (
              <CheckCircleOutlined style={{ color: '#29A745', marginRight: 8, marginTop: -5, fontSize: 18 }} size='' />
            ) : props.status === Enums.paymentStatuses.ERROR ? (
              <CloseOutlined style={{ color: '#DC3645', marginRight: 8, marginTop: -5, fontSize: 18 }} />
            ) : (
              <SyncOutlined style={{ color: '#188EFF', marginRight: 8, marginTop: -5, fontSize: 18 }} spin />
            )}

            <Progress
              percent={props.progressPercent}
              status={
                props.status === Enums.paymentStatuses.SUCCESS
                  ? 'success'
                  : props.status === Enums.paymentStatuses.ERROR
                  ? 'exception'
                  : 'active'
              }
              style={{ fontSize: 14, flex: 1 }}
              showInfo={false}
            />
          </div>
        </Col>
      </Row>
      <Row>
        <Col xs={12} md={6}>
          <center>
            <Text style={{ fontSize: 15, color: '#188EFF' }}>
              Payments: <span style={{ fontWeight: 'bold' }}>{props.paymentCount}</span>
            </Text>
          </center>
        </Col>
        <Col xs={12} md={6}>
          <center>
            <Text style={{ fontSize: 15, color: '#29A745' }}>
              Successful: <span style={{ fontWeight: 'bold' }}>{props.successCount}</span>
            </Text>
          </center>
        </Col>
        <Col xs={12} md={6}>
          <center>
            <Text style={{ fontSize: 15, color: '#DC3645' }}>
              Failed: <span style={{ fontWeight: 'bold' }}>{props.failCount}</span>
            </Text>
          </center>
        </Col>
        <Col xs={12} md={6}>
          <center>
            <Text style={{ fontSize: 15, color: '#FF7F50' }}>
              Remaining: <span style={{ fontWeight: 'bold' }}>{props.remainingCount}</span>
            </Text>
          </center>
        </Col>
      </Row>
      <Row style={{ marginTop: 20, justifyContent: 'center' }}>
        {props.progressPercent === 100 ? (
          <>
            <Col span={24}>
              <center>
                <Button
                  style={{ color: 'green', borderColor: 'green', backgroundColor: 'white' }}
                  icon={<CheckCircleOutlined />}
                  size='large'
                  onClick={onPaymentDone}
                >
                  Done
                </Button>
              </center>
            </Col>
            {props.errors.length > 0 ? (
              <Col span={24}>
                <List
                  itemLayout='horizontal'
                  header='Error Report'
                  dataSource={props.errors}
                  renderItem={(entry, index) => (
                    <List.Item>
                      <List.Item.Meta
                        avatar={
                          <Image
                            src={entry.profilePicUrl}
                            width={20}
                            height={20}
                            style={{ borderRadius: '50%', marginTop: -3 }}
                            fallback='https://openfund.com/images/ghost-profile-image.svg'
                            preview={false}
                          />
                        }
                        title={<a href='https://ant.design'>{entry.username}</a>}
                        description={entry.errorDescription}
                      />
                    </List.Item>
                  )}
                />
              </Col>
            ) : null}
          </>
        ) : (
          <Col span={24}>
            <center>
              <h3>Did You Know...</h3>
              <p>{props.tips[tipIndex]}</p>
            </center>
          </Col>
        )}
      </Row>
    </Modal>
  )
}

export default PaymentModal
