import React, { useEffect, useState } from 'react'
import { Table, Image, App } from 'antd'
import { CheckCircleOutlined } from '@ant-design/icons'

import { calculateEstimatedPayment, updateTableSelection, distributionAmountAsPayingTokens } from '../../controllers'
import Enums from 'core/infra/enums'
import { copyTextToClipboard } from 'core/infra/utils'
import { cloneDeep } from 'lodash'

const TableData = ({ desoData, rootState, setRootState, deviceType }) => {
  const [tableData, setTableData] = useState([])
  const { message } = App.useApp()

  const handleSelectionChange = async (updatedKeys) => {
    let newState = cloneDeep(rootState)

    const { finalHodlers, tokenTotal, selectedTableKeys } = await updateTableSelection(
      rootState.finalHodlers ?? [],
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
    } else if (
      rootState.distributionType === Enums.paymentTypes.DESO ||
      rootState.distributionType === Enums.paymentTypes.FOCUS
    ) {
      await calculateEstimatedPayment(
        distributionAmountAsPayingTokens(newState, desoData),
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
    const filteredHodlers = (rootState.finalHodlers ?? []).filter((hodler) => hodler.isVisible)
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

          if (
            rootState.distributionType === Enums.paymentTypes.DESO ||
            rootState.distributionType === Enums.paymentTypes.FOCUS
          ) {
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
                className='-mt-px rounded-full'
                fallback='https://openfund.com/images/ghost-profile-image.svg'
                preview={false}
              />
              <span className='ml-[5px] text-sm text-deso-blue'>{`${entry.username
                } (${entry.tokenBalanceLabel}${entry.isCustom ? '' : ' token(s)'})`}</span>
              <br />
              <span className='text-xs text-deso-blue'>{`Ownership: ${entry.percentOwnershipLabel}% - Amount: ${estimatedPaymentLabel}`}</span>
              <br />
              <span className='text-xs text-deso-blue'>{`Last Active: ${entry.lastActiveDays} day(s) ago`}</span>
              <br />

              {entry.optedOut ? (
                <span className='text-xs text-error'>Opted Out</span>
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
                className='-mt-[3px] rounded-full'
                fallback='https://openfund.com/images/ghost-profile-image.svg'
                preview={false}
              />
              <span className='ml-[5px] text-deso-blue'>{`${value} (${rootState.distributeTo === Enums.values.DESO_OPS
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

          if (
            rootState.distributionType === Enums.paymentTypes.DESO ||
            rootState.distributionType === Enums.paymentTypes.FOCUS
          ) {
            if (entry.estimatedPaymentUSD >= 0.001) {
              estimatedPaymentLabel += ` (~$${entry.estimatedPaymentUSD})`
            } else {
              estimatedPaymentLabel += '(<$0.001)'
            }
          }

          return (
            <>
              <span className='text-deso-blue'>{`${value}% -> `}</span>
              <span
                className='cursor-pointer text-deso-blue'
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
          return <span className='text-deso-blue'>{tmpVal}</span>
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
              <CheckCircleOutlined className='ml-2.5 text-lg text-error' />
            )
          }
        }
      }
    ]
  }

  return (
    <>
      <div className='dashboard-card overflow-hidden p-2 sm:p-3'>
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
      </div>
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
