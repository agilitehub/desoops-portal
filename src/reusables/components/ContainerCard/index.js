// This is a Card component that can be used to wrap other components.
// It contains the necessary styling and defaults to match the rest of the app.

import React from 'react'
import PropTypes from 'prop-types'
import { Card } from 'antd'

import './style.sass'

const ContainerCard = ({ title, deviceType, children }) => {
  return (
    <Card
      title={
        <center>
          <span className='card-title'>{title}</span>
        </center>
      }
      className='card-wrapper'
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
