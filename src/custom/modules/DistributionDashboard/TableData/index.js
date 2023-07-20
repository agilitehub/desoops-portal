import React, { useEffect } from 'react'
import { Table, Popover, Image } from 'antd'
import { CheckCircleOutlined, CloseCircleOutlined } from '@ant-design/icons'
import { cloneDeep } from 'lodash'

import theme from '../../../../core/utils/theme'
import { updateHodlers } from '../controller'
import Enums from '../../../lib/enums'

const TableData = (props) => {
  const { desoData, rootState, setRootState } = props
  const [tableData, setTableData] = React.useState([])

  const handleSelectionChange = async (changedSelectedTableKeys) => {
    const tmpHodlers = cloneDeep(rootState.finalHodlers)
    const tmpSelectedTableKeys = cloneDeep(changedSelectedTableKeys)

    const { finalHodlers, selectedTableKeys, tokenTotal } = await updateHodlers(
      tmpHodlers,
      tmpSelectedTableKeys,
      null,
      rootState.distributionAmount,
      rootState.spreadAmountBasedOn,
      desoData.desoPrice
    )
    setRootState({ selectedTableKeys, finalHodlers, tokenTotal })
  }

  // Create a useState and useEffect hook to monitor rootState.finalHodlers and update the table data array...
  // ...to only include hodlers that have an isVisible = true
  useEffect(() => {
    const filteredHodlers = rootState.finalHodlers.filter((hodler) => hodler.isVisible)
    setTableData(filteredHodlers)
  }, [rootState.finalHodlers]) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <Table
      rowKey={(hodler) => hodler.username}
      rowSelection={{
        selectedRowKeys: rootState.selectedTableKeys,
        onChange: (selectedKeys) => handleSelectionChange(selectedKeys)
      }}
      dataSource={tableData}
      loading={rootState.loading}
      style={{ width: '100%' }}
      columns={[
        {
          title: 'User (Token Balance)',
          dataIndex: 'username',
          key: 'username',
          width: '40%',
          render: (value, entry) => {
            return (
              <div>
                <Image
                  src={entry.profilePicUrl}
                  width={20}
                  height={20}
                  style={{ borderRadius: '50%', marginTop: -3 }}
                  fallback='https://openfund.com/images/ghost-profile-image.svg'
                  preview={false}
                />
                <span
                  style={{ color: theme.twitterBootstrap.primary, marginLeft: 5 }}
                >{`${value} (${entry.tokenBalanceLabel})`}</span>
              </div>
            )
          }
        },
        {
          title: '% Ownership -> Est Payment',
          dataIndex: 'percentOwnershipLabel',
          key: 'percentOwnershipLabel',
          width: '40%',
          render: (value, entry) => {
            let estimatedPaymentLabel = entry.estimatedPaymentLabel

            if (rootState.distributionType === Enums.paymentTypes.DESO) {
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
