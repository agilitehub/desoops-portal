// This is a Card component that can be used to wrap other components.
// It contains the necessary styling and defaults to match the rest of the app.

import React from 'react'
import PropTypes from 'prop-types'
import { Card } from 'antd'

const ContainerCard = ({ title, deviceType, children }) => {
  const styleProps = {
    card: { width: '100%', overflow: 'hidden', marginTop: 10 },
    title: { fontSize: deviceType.isSmartphone ? 14 : 18 },
    headStyle: { backgroundColor: '#FFA07A', minHeight: deviceType.isSmartphone ? 30 : 40 },
    bodyStyle: { padding: 4, background: '#EDEDED' }
  }

  return (
    <Card
      title={
        <center>
          <span style={styleProps.title}>{title}</span>
        </center>
      }
      style={styleProps.card}
      headStyle={styleProps.headStyle}
      bodyStyle={styleProps.bodyStyle}
      type='inner'
      size='small'
    >
      {children}
    </Card>
  )
}

export default ContainerCard

// Add Prop Types for this component
ContainerCard.propTypes = {
  title: PropTypes.string,
  children: PropTypes.node
}
