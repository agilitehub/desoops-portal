import React, { useEffect, useState } from 'react'
import { Row, Modal, Col, Divider, InputNumber, Space, Input } from 'antd'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faGem } from '@fortawesome/free-regular-svg-icons'

const DiamondOptionsModal = ({ isOpen, rootState, desoData, deviceType, onConfirm, onCancel }) => {
  const [noOfPosts, setNoOfPosts] = useState(rootState.diamondOptionsModal.noOfPosts)
  const [noOfDiamonds, setNoOfDiamonds] = useState(rootState.diamondOptionsModal.noOfDiamonds)
  const [skipHours, setSkipHours] = useState(rootState.diamondOptionsModal.skipHours)
  const [estimateCost, setEstimateCost] = useState(0)

  const styleProps = {
    checkbox: { fontSize: 16, fontWeight: 'bold' },
    searchField: { width: '100%', fontSize: 16 },
    divider: { margin: deviceType.isMobile ? '3px 0' : '7px 0', borderBlockStart: 0 },
    diamond1: { fontSize: 24, color: noOfDiamonds >= 1 ? '#188EFF' : 'black' },
    diamond2: { fontSize: 24, color: noOfDiamonds >= 2 ? '#188EFF' : 'black' },
    diamond3: { fontSize: 24, color: noOfDiamonds >= 3 ? '#188EFF' : 'black' },
    diamond4: { fontSize: 24, color: noOfDiamonds >= 4 ? '#188EFF' : 'black' },
    diamond5: { fontSize: 24, color: noOfDiamonds >= 5 ? '#188EFF' : 'black' },
    diamond6: { fontSize: 24, color: noOfDiamonds >= 6 ? '#188EFF' : 'black' },
    diamond7: { fontSize: 24, color: noOfDiamonds >= 7 ? '#188EFF' : 'black' },
    diamond8: { fontSize: 24, color: noOfDiamonds >= 8 ? '#188EFF' : 'black' }
  }

  useEffect(() => {
    let cost = 0
    let diamondNanos = desoData.diamondLevels[noOfDiamonds]
    let diamondTotal = diamondNanos * noOfPosts
    cost = (diamondTotal / 1e9) * desoData.desoPrice
    cost = Math.floor(cost * 10000) / 10000
    setEstimateCost(cost)
  }, [noOfDiamonds, noOfPosts, skipHours, desoData.desoPrice, desoData.diamondLevels])

  const handleConfirm = () => {
    onConfirm(noOfPosts, noOfDiamonds, skipHours)
  }

  const handleOnChange = async (prop, value) => {
    switch (prop) {
      case 'noOfDiamonds':
        setNoOfDiamonds(value)
        break
      case 'noOfPosts':
        setNoOfPosts(value)
        break
      case 'skipHours':
        setSkipHours(value)
        break
    }
  }

  return (
    <Modal
      title={'Diamond Distribution Options'}
      open={isOpen}
      onOk={handleConfirm}
      onCancel={onCancel}
      okText='Confirm'
      cancelText='Cancel'
      maskClosable={false}
      keyboard={false}
    >
      <Row>
        <Col span={24}>
          <span style={styleProps.fieldLabel}>
            <b>No of Diamonds to send ({noOfDiamonds})</b>
          </span>
        </Col>
        <Col span={24}>
          <Space size={5} style={{ cursor: 'pointer' }}>
            <FontAwesomeIcon
              icon={faGem}
              style={styleProps.diamond1}
              onClick={() => handleOnChange('noOfDiamonds', 1)}
            />
            <FontAwesomeIcon
              icon={faGem}
              style={styleProps.diamond2}
              onClick={() => handleOnChange('noOfDiamonds', 2)}
            />
            <FontAwesomeIcon
              icon={faGem}
              style={styleProps.diamond3}
              onClick={() => handleOnChange('noOfDiamonds', 3)}
            />
            <FontAwesomeIcon
              icon={faGem}
              style={styleProps.diamond4}
              onClick={() => handleOnChange('noOfDiamonds', 4)}
            />
            <FontAwesomeIcon
              icon={faGem}
              style={styleProps.diamond5}
              onClick={() => handleOnChange('noOfDiamonds', 5)}
            />
            <FontAwesomeIcon
              icon={faGem}
              style={styleProps.diamond6}
              onClick={() => handleOnChange('noOfDiamonds', 6)}
            />
            <FontAwesomeIcon
              icon={faGem}
              style={styleProps.diamond7}
              onClick={() => handleOnChange('noOfDiamonds', 7)}
            />
            <FontAwesomeIcon
              icon={faGem}
              style={styleProps.diamond8}
              onClick={() => handleOnChange('noOfDiamonds', 8)}
            />
          </Space>
        </Col>
      </Row>
      <Divider style={styleProps.divider} />
      <Row>
        <Col span={24} style={{ paddingTop: 3, paddingBottom: 3 }}>
          <span style={styleProps.fieldLabel}>
            <b>No of Posts to Diamond</b>
          </span>
        </Col>
        <Col>
          <InputNumber
            disabled={rootState.isExecuting}
            addonAfter='posts'
            min={0}
            value={noOfPosts}
            placeholder='10'
            style={{ width: 130 }}
            onChange={(value) => handleOnChange('noOfPosts', value)}
          />
        </Col>
      </Row>
      <Divider style={styleProps.divider} />
      <Row>
        <Col span={24} style={{ paddingTop: 3, paddingBottom: 3 }}>
          <span style={styleProps.fieldLabel}>
            <b>Skip posts created in the last...</b>
          </span>
        </Col>
        <Col>
          <InputNumber
            disabled={rootState.isExecuting}
            addonAfter='hours'
            min={0}
            value={skipHours}
            placeholder='24'
            style={{ width: 130 }}
            onChange={(value) => handleOnChange('skipHours', value)}
          />
        </Col>
      </Row>
      <Divider style={styleProps.divider} />
      <Row>
        <Col span={24} style={{ paddingTop: 3, paddingBottom: 3 }}>
          <span style={styleProps.fieldLabel}>
            <b>Estimate cost per User</b>
          </span>
        </Col>
        <Col>
          <Input readOnly={true} addonBefore='$' value={estimateCost} style={{ width: 130 }} />
        </Col>
      </Row>
    </Modal>
  )
}

export default DiamondOptionsModal
