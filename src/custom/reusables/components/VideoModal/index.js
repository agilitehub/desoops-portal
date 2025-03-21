// This component loads an Ant Design Modal component.
// Using react-player and a passed url, the video will be displayed in the Modal.
// additional props can be passed to this component to control the video player.
import React from 'react'
import ReactPlayer from 'react-player/youtube'

import { Row, Modal, Col } from 'antd'

const VideoModal = ({ isOpen, title, url, onCloseModal, waveEffects }) => {
  return (
    <Modal
      title={title}
      open={isOpen}
      onOk={onCloseModal}
      closeIcon={false}
      okText='Done'
      cancelButtonProps={{ style: { display: 'none' } }}
      destroyOnClose
    >
      {waveEffects}
      <Row style={{ height: 400, position: 'relative', zIndex: 1 }}>
        <Col span={24}>
          <ReactPlayer url={url} width='100%' height='100%' controls playing />
        </Col>
      </Row>
    </Modal>
  )
}

export default VideoModal
