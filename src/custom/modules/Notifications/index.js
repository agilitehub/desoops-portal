import { Avatar, List } from 'antd'
import ContainerCard from '../../reusables/components/ContainerCard'
import React from 'react'
import { useSelector } from 'react-redux'

const Notifications = () => {
  const { isTablet, isSmartphone, isMobile } = useSelector((state) => state.custom.userAgent)

  const deviceType = { isSmartphone, isTablet, isMobile }

  const data = [
    {
      title: 'Payment received from John Doe'
    },
    {
      title: 'Payment received from Jane Doe'
    },
    {
      title: 'New features added'
    },
    {
      title: 'Update your profile'
    }
  ]

  return (
    <ContainerCard title='Notifications' deviceType={deviceType}>
      <List
        itemLayout='horizontal'
        dataSource={data}
        renderItem={(item, index) => (
          <List.Item>
            <List.Item.Meta
              avatar={<Avatar src={`https://api.dicebear.com/7.x/miniavs/svg?seed=${index}`} />}
              title={<a href='https://ant.design'>{item.title}</a>}
              description='Ant Design, a design language for background applications, is refined by Ant UED Team'
            />
          </List.Item>
        )}
      />
    </ContainerCard>
  )
}

export default Notifications
