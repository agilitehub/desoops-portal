import React from 'react'
import ReactPlayer from 'react-player/youtube'
import { Modal } from 'antd'

const VideoModal = ({ isOpen, url, onCloseModal, closeOnOutsideClick = false, title }) => {
  return (
    <Modal
      title={title}
      open={isOpen}
      onCancel={onCloseModal}
      closeIcon={false}
      footer={null} // Remove the footer entirely
      destroyOnClose
      width='80%'
      styles={{
        header: { display: 'none' },
        body: { padding: 0 },
        content: { padding: 0 }
      }}
      centered
      maskClosable={closeOnOutsideClick}
    >
      <div
        style={{
          position: 'relative',
          paddingTop: '56.25%' // 16:9 aspect ratio
        }}
      >
        <ReactPlayer
          url={url}
          width='100%'
          height='100%'
          style={{
            position: 'absolute',
            top: 0,
            left: 0
          }}
          controls
          playing
        />
      </div>
    </Modal>
  )
}

export default VideoModal
