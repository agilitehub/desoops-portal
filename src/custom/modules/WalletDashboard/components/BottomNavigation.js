import React from 'react'
import { Button } from 'antd'
import { HomeOutlined, BarChartOutlined, QrcodeOutlined, SettingOutlined } from '@ant-design/icons'

const BottomNavigation = () => (
  <div className='fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 py-2 px-4 flex justify-around items-center lg:hidden'>
    <Button type='text' icon={<HomeOutlined />} />
    <Button type='text' icon={<BarChartOutlined />} />
    <Button type='text' icon={<QrcodeOutlined />} />
    <Button type='text' icon={<SettingOutlined />} />
  </div>
)

export default BottomNavigation
