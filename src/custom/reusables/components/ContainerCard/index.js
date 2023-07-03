import React from 'react'
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
