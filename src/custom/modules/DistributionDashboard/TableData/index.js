import React from 'react'
import { Table, Popover } from 'antd'
import Enums from '../../../lib/enums'
import { CheckCircleOutlined, CloseCircleOutlined } from '@ant-design/icons'

import theme from '../../../../core/utils/theme'
import { updateHodlers } from '../controller'

const TableData = (props) => {
  const { desoData, state, onSetState } = props

  const handleSelectionChange = async (selectedTableKeys) => {
    const { finalHodlers } = await updateHodlers(state.finalHodlers, selectedTableKeys)
    onSetState({ selectedTableKeys, finalHodlers })
  }

  return (
    <Table
      rowKey={(hodler) => hodler.username}
      rowSelection={{
        selectedRowKeys: state.selectedTableKeys,
        onChange: (selectedKeys) => handleSelectionChange(selectedKeys)
      }}
      dataSource={state.finalHodlers}
      loading={state.loading}
      style={{ width: '100%' }}
      columns={[
        {
          title: 'User (Token Balance)',
          dataIndex: 'username',
          key: 'username',
          render: (value, entry) => {
            return (
              <span style={{ color: theme.twitterBootstrap.primary }}>{`${value}% (${entry.tokenBalanceLabel})`}</span>
            )
          }
        },
        {
          title: '% Ownership -> Est Payment',
          dataIndex: 'percentOwnershipLabel',
          key: 'percentOwnershipLabel',
          render: (value, entry) => {
            return (
              <span style={{ color: theme.twitterBootstrap.primary }}>
                {`${value}% -> ${entry.estimatedPaymentLabel}`}
              </span>
            )
          }
        },
        {
          title: 'Status',
          dataIndex: 'paymentStatus',
          key: 'paymentStatus',
          render: (value) => {
            if (value === 'Paid') {
              return <CheckCircleOutlined style={{ fontSize: 20, color: theme.twitterBootstrap.success }} />
            } else if (value.indexOf('Error:') > -1) {
              return (
                <Popover content={<p>{value}</p>} title='DeSo Error'>
                  <CloseCircleOutlined style={{ fontSize: 20, color: theme.twitterBootstrap.danger }} />
                </Popover>
              )
            } else {
              return <span style={{ color: theme.twitterBootstrap.info }}>{value}</span>
            }
          }
        }
      ]}
      pagination={false}
    />
  )
}

export default TableData
