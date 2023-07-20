import React from 'react'
import { Card, Tabs, Button, Image } from 'antd'
import GeneralTab from './GeneralTab'
import RulesTab from './RulesTab'
import Enums from '../../../lib/enums'

const SetupCard = ({
  desoData,
  rootState,
  onDistributeTo,
  onDistributionType,
  onTokenToUse,
  setRootState,
  onConfirmNFT
}) => {
  const handleSelectNFT = () => {
    setRootState({ openNftSearch: true })
  }

  const handleCancelNFT = () => {
    setRootState({ openNftSearch: false })
  }

  const tabItems = [
    {
      key: '1',
      label: 'General',
      disabled: rootState.isExecuting,
      children: (
        <GeneralTab
          desoProfile={desoData.profile}
          rootState={rootState}
          onDistributeTo={onDistributeTo}
          onDistributionType={onDistributionType}
          setRootState={setRootState}
          onTokenToUse={onTokenToUse}
          onConfirmNFT={onConfirmNFT}
          onCancelNFT={handleCancelNFT}
        />
      )
    },
    {
      key: '2',
      label: 'Rules',
      disabled: !rootState.rulesEnabled || rootState.isExecuting,
      children: <RulesTab desoData={desoData} rootState={rootState} setRootState={setRootState} />
    }
  ]

  return (
    <Card title='👇 Start Here: Setup & Config' size='small'>
      <Tabs
        disabled={true}
        activeKey={rootState.activeRulesTab}
        size='small'
        onTabClick={(key) => setRootState({ activeRulesTab: key })}
        tabBarExtraContent={
          rootState.distributeTo === Enums.values.NFT ? (
            <Button
              style={{ color: '#188EFF', borderColor: '#188EFF', backgroundColor: 'white' }}
              onClick={handleSelectNFT}
              icon={
                !rootState.nftMetaData.id ? null : (
                  <Image
                    src={rootState.nftMetaData.imageUrl}
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
