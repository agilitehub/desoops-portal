import React from 'react'
import { Card, Tabs, Button, Image } from 'antd'
import GeneralTab from './GeneralTab'
import RulesTab from './RulesTab'
import Enums from '../../../lib/enums'

const SetupCard = ({ desoData, state, onDistributeTo, onDistributionType, onTokenToUse, onSetState, onConfirmNFT }) => {
  const handleSelectNFT = () => {
    onSetState({ openNftSearch: true })
  }

  const handleCancelNFT = () => {
    onSetState({ openNftSearch: false })
  }

  const tabItems = [
    {
      key: '1',
      label: 'General',
      children: (
        <GeneralTab
          desoProfile={desoData.profile}
          state={state}
          onDistributeTo={onDistributeTo}
          onDistributionType={onDistributionType}
          onSetState={onSetState}
          onTokenToUse={onTokenToUse}
          onConfirmNFT={onConfirmNFT}
          onCancelNFT={handleCancelNFT}
        />
      )
    },
    {
      key: '2',
      label: 'Rules',
      disabled: !state.rulesEnabled,
      children: <RulesTab desoData={desoData} state={state} onSetState={onSetState} />
    }
  ]

  return (
    <Card title='👇 Start Here: Setup & Config' size='small'>
      <Tabs
        defaultActiveKey='1'
        size='small'
        tabBarExtraContent={
          state.distributeTo === Enums.values.NFT ? (
            <Button
              style={{ color: '#188EFF', borderColor: '#188EFF', backgroundColor: 'white' }}
              onClick={handleSelectNFT}
              icon={
                !state.nftMetaData.id ? null : (
                  <Image
                    src={state.nftMetaData.imageUrl}
                    width={25}
                    height={25}
                    style={{ borderRadius: 5, marginLeft: -15, marginTop: -3 }}
                    preview={false}
                  />
                )
              }
            >
              Select NFT
            </Button>
          ) : null
        }
        items={tabItems}
      />
    </Card>
  )
}

export default SetupCard
