import React from 'react'
import PropTypes from 'prop-types'
import { Card } from 'antd'

const ContainerCard = ({ children, extra }) => {
  return (
    <Card
      className='dashboard-shell-card mt-2 sm:mt-3'
      size='small'
      extra={extra}
    >
      {children}
    </Card>
  )
}

export default ContainerCard

ContainerCard.propTypes = {
  children: PropTypes.node,
  extra: PropTypes.node
}
