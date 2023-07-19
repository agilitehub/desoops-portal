// This is a Card component that can be used to wrap other components.
// It contains the necessary styling and defaults to match the rest of the app.

import React from 'react'
import PropTypes from 'prop-types'
import { Card, theme } from 'antd'

const ContainerCard = ({ title, children }) => {
  const { token } = theme.useToken()

  return (
    <Card
      title={
        <center>
          <span style={{ fontSize: '18px' }}>{title}</span>
        </center>
      }
      style={{ width: '100%', overflow: 'hidden', marginTop: 10 }}
      headStyle={{ backgroundColor: token.colorSecondaryLight, fontSize: 18 }}
      bodyStyle={{ padding: 4, background: token.colorInputBg }}
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
