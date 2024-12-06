import React, { useEffect, useState } from 'react'
import { Table, Image, App } from 'antd'
import { CheckCircleOutlined } from '@ant-design/icons'

import theme from '../../../../core/utils/theme'
import { calculateEstimatedPayment, updateTableSelection } from '../controller'
import Enums from '../../../lib/enums'
import { copyTextToClipboard } from '../../../lib/utils'
import { cloneDeep } from 'lodash'

const TableData = ({ desoData, rootState, setRootState, deviceType }) => {
  const [tableData, setTableData] = useState([])
  const { desoPrice } = desoData
  const { message } = App.useApp()

  const handleSelectionChange = async (updatedKeys) => {
    let newState = cloneDeep(rootState)

    const { finalHodlers, tokenTotal, selectedTableKeys } = await updateTableSelection(
      rootState.finalHodlers,
      rootState,
      desoData,
      updatedKeys
    )

    newState.finalHodlers = finalHodlers
    newState.selectedTableKeys = selectedTableKeys
    newState.tokenTotal = tokenTotal

    if (rootState.distributionType === Enums.paymentTypes.DIAMONDS) {
      newState.distributionAmount =
        rootState.diamondOptionsModal.noOfPosts *
        finalHodlers.filter((hodler) => hodler.isActive && hodler.isVisible).length

      await calculateEstimatedPayment(
        newState.distributionAmount,
        newState.distributionType,
        newState.spreadAmountBasedOn,
        finalHodlers,
        desoData
      )
    } else if (rootState.distributionType === Enums.paymentTypes.DESO) {
      await calculateEstimatedPayment(
        rootState.paymentType === Enums.paymentTypes.USD
          ? newState.distributionAmount / desoPrice
          : newState.distributionAmount,
        newState.distributionType,
        newState.spreadAmountBasedOn,
        finalHodlers,
        desoData
      )
    }

    setRootState(newState)
  }

  // Create a useState and useEffect hook to monitor rootState.finalHodlers and update the table data array...
  // ...to only include hodlers that have an isVisible = true
  useEffect(() => {
    const filteredHodlers = rootState.finalHodlers.filter((hodler) => hodler.isVisible)
    setTableData(filteredHodlers)
  }, [rootState.finalHodlers]) // eslint-disable-line react-hooks/exhaustive-deps

  let tableColumns = []

  if (deviceType.isSmartphone) {
    tableColumns = [
      {
        title: 'Distribute To',
        dataIndex: 'username',
        key: 'username',
        width: '100%',
        onCell: (entry) => {
          return {
            onClick: async (e) => {
              await copyTextToClipboard(entry.estimatedPaymentToken)
              message.success(`Full Payment value for ${entry.username} copied to clipboard`)
            }
          }
        },
        render: (value, entry) => {
          let estimatedPaymentLabel = entry.estimatedPaymentLabel

          if (rootState.distributionType === Enums.paymentTypes.DESO) {
            if (entry.estimatedPaymentUSD >= 0.001) {
              estimatedPaymentLabel += ` (~$${entry.estimatedPaymentUSD})`
            } else {
              estimatedPaymentLabel += ' (<$0.001)'
            }
          }

          return (
            <>
              <Image
                src={entry.profilePicUrl}
                width={18}
                height={18}
                style={{ borderRadius: '50%', marginTop: -1 }}
                fallback='https://openfund.com/images/ghost-profile-image.svg'
                preview={false}
              />
              <span style={{ color: theme.twitterBootstrap.primary, marginLeft: 5, fontSize: 14 }}>{`${entry.username
                } (${entry.tokenBalanceLabel}${entry.isCustom ? '' : ' token(s)'})`}</span>
              <br />
              <span
                style={{ color: theme.twitterBootstrap.primary, fontSize: 12 }}
              >{`Ownership: ${entry.percentOwnershipLabel}% - Amount: ${estimatedPaymentLabel}`}</span>
              <br />
              <span
                style={{ color: theme.twitterBootstrap.primary, fontSize: 12 }}
              >{`Last Active: ${entry.lastActiveDays} day(s) ago`}</span>
              <br />

              {entry.optedOut ? (
                <span style={{ color: theme.twitterBootstrap.danger, fontSize: 12 }}>Opted Out</span>
              ) : null}
            </>
          )
        }
      }
    ]
  } else {
    tableColumns = [
      {
        title: rootState.distributeTo === Enums.values.DESO_OPS ? 'User (Transaction Count)' : 'User (Token Balance)',
        dataIndex: 'username',
        key: 'username',
        width: '35%',
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
              <span style={{ color: theme.twitterBootstrap.primary, marginLeft: 5 }}>{`${value} (${rootState.distributeTo === Enums.values.DESO_OPS
                ? entry.deSoOpsTransactionCount
                : entry.tokenBalanceLabel
                }${entry.isCustom ? '' : rootState.distributeTo === Enums.values.DESO_OPS ? ' transaction(s)' : ' token(s)'
                })`}</span>
            </div>
          )
        }
      },
      {
        title:
          rootState.distributeTo === Enums.values.DESO_OPS ? '% Usage -> Est Payment' : '% Ownership -> Est Payment',
        dataIndex: 'percentOwnershipLabel',
        key: 'percentOwnershipLabel',
        width: '30%',
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
            <>
              <span style={{ color: theme.twitterBootstrap.primary }}>{`${value}% -> `}</span>
              <span
                style={{ color: theme.twitterBootstrap.primary, cursor: 'pointer' }}
                onClick={async (e) => {
                  await copyTextToClipboard(entry.estimatedPaymentToken)
                  message.success(`Full payment value for ${entry.username} copied to clipboard`)
                }}
              >
                {estimatedPaymentLabel}
              </span>
            </>
          )
        }
      },
      {
        title: 'Last Active',
        dataIndex: 'lastActiveDays',
        key: 'lastActiveDays',
        width: '20%',
        render: (value, entry) => {
          let tmpVal = value === 0 ? 'Today' : value && value !== 'undefined' ? `${value} day(s) ago` : 'Unknown'
          return <span style={{ color: theme.twitterBootstrap.primary }}>{tmpVal}</span>
        }
      },
      {
        title: 'Opted Out?',
        dataIndex: 'optedOut',
        key: 'optedOut',
        width: '15%',
        render: (value) => {
          if (value) {
            return (
              <CheckCircleOutlined style={{ fontSize: 18, color: theme.twitterBootstrap.danger, marginLeft: 10 }} />
            )
          }
        }
      }
    ]
  }

  return (
    <>
      <Table
        rowKey={(hodler) => hodler.username}
        rowSelection={{
          selectedRowKeys: rootState.selectedTableKeys,
          onChange: (selectedKeys) => handleSelectionChange(selectedKeys)
        }}
        dataSource={tableData}
        loading={rootState.loading}
        style={{ width: '100%' }}
        columns={tableColumns}
        pagination={{
          position: ['topRight', 'bottomRight'],
          defaultPageSize: 50,
          size: 'small',
          showLessItems: true,
          showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} items`
        }}
      />
    </>
  )
}

const app = ({ desoData, rootState, setRootState, deviceType }) => {
  return (
    <App style={{ width: '100%' }}>
      <TableData desoData={desoData} setRootState={setRootState} rootState={rootState} deviceType={deviceType} />
    </App>
  )
}

export default app
