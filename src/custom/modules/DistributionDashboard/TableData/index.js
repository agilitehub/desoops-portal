import React, { useEffect } from 'react'
import { Table, Popover } from 'antd'
import { CheckCircleOutlined, CloseCircleOutlined } from '@ant-design/icons'

import theme from '../../../../core/utils/theme'
import { updateHodlers } from '../controller'
import { cloneDeep } from 'lodash'
import Enums from '../../../lib/enums'

const TableData = (props) => {
  const { desoData, state, onSetState } = props
  const [tableData, setTableData] = React.useState([])

  const handleSelectionChange = async (changedSelectedTableKeys) => {
    const tmpHodlers = cloneDeep(state.finalHodlers)
    const tmpSelectedTableKeys = cloneDeep(changedSelectedTableKeys)

    const { finalHodlers, selectedTableKeys, tokenTotal } = await updateHodlers(
      tmpHodlers,
      tmpSelectedTableKeys,
      null,
      state.distributionAmount,
      state.spreadAmountBasedOn,
      desoData.desoPrice
    )
    onSetState({ selectedTableKeys, finalHodlers, tokenTotal })
  }

  // Create a useState and useEffect hook to monitor state.finalHodlers and update the table data array...
  // ...to only include hodlers that have an isVisible = true
  useEffect(() => {
    const filteredHodlers = state.finalHodlers.filter((hodler) => hodler.isVisible)
    setTableData(filteredHodlers)
  }, [state.finalHodlers]) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <Table
      rowKey={(hodler) => hodler.username}
      rowSelection={{
        selectedRowKeys: state.selectedTableKeys,
        onChange: (selectedKeys) => handleSelectionChange(selectedKeys)
      }}
      dataSource={tableData}
      loading={state.loading}
      style={{ width: '100%' }}
      columns={[
        {
          title: 'User (Token Balance)',
          dataIndex: 'username',
          key: 'username',
          render: (value, entry) => {
            return (
              <span style={{ color: theme.twitterBootstrap.primary }}>{`${value} (${entry.tokenBalanceLabel})`}</span>
            )
          }
        },
        {
          title: '% Ownership -> Est Payment',
          dataIndex: 'percentOwnershipLabel',
          key: 'percentOwnershipLabel',
          render: (value, entry) => {
            let estimatedPaymentLabel = entry.estimatedPaymentLabel

            if (state.distributionType === Enums.paymentTypes.DESO) {
              if (entry.estimatedPaymentUSD >= 0.001) {
                estimatedPaymentLabel += ` (~$${entry.estimatedPaymentUSD})`
              } else {
                estimatedPaymentLabel += '(<$0.001)'
              }
            }

            return (
              <span style={{ color: theme.twitterBootstrap.primary }}>{`${value}% -> ${estimatedPaymentLabel}`}</span>
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
