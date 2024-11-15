import { Modal } from 'antd'
import { setComingSoonVisible } from '../../../custom/reducer'
import React from 'react'
import { useDispatch } from 'react-redux'

const ComingSoon = ({ isVisible }) => {
  const dispatch = useDispatch()
  return (
    <Modal
      open={isVisible}
      cancelButtonProps={{ style: { display: 'none' } }}
      okButtonProps={{ style: { display: 'none' } }}
      onCancel={() => dispatch(setComingSoonVisible(false))}
      width={500}
      centered
    >
      <div
        style={{
          textAlign: 'center',
          padding: '2rem 1rem'
        }}
      >
        <h1
          style={{
            fontSize: '2.5rem',
            marginBottom: '1rem',
            background: 'linear-gradient(45deg, #2196F3, #00BCD4)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}
        >
          Coming Soon!
        </h1>
        <p
          style={{
            fontSize: '1.1rem',
            color: '#666',
            marginBottom: '1.5rem'
          }}
        >
          We're working hard to bring you something amazing. Stay tuned for updates!
        </p>
        <div
          style={{
            fontSize: '3rem',
            color: '#2196F3',
            animation: 'pulse 2s infinite'
          }}
        >
          🚀
        </div>
      </div>
      <style>{`
        @keyframes pulse {
          0% { transform: scale(1); }
          50% { transform: scale(1.1); }
          100% { transform: scale(1); }
        }
      `}</style>
    </Modal>
  )
}

export default ComingSoon
