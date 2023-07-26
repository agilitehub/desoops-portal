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
  onConfirmNFT,
  deviceType
}) => {
  const styleProps = {
    title: { fontSize: deviceType.isSmartphone ? 14 : 18 },
    headStyle: { minHeight: deviceType.isSmartphone ? 30 : 40 },
    tabButton: {
      color: '#188EFF',
      borderColor: '#188EFF',
      backgroundColor: 'white',
      fontSize: deviceType.isSmartphone ? 14 : 16,
      marginBottom: deviceType.isSmartphone ? 3 : 0
    },
    nftIcon: {
      borderRadius: 5,
      marginLeft: deviceType.isSmartphone ? -10 : -15,
      marginTop: deviceType.isSmartphone ? -0 : -3,
      width: 25,
      height: 25
    },
    tabBarStyle: { fontSize: 14 }
  }

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
          deviceType={deviceType}
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
      children: (
        <RulesTab desoData={desoData} deviceType={deviceType} rootState={rootState} setRootState={setRootState} />
      )
    }
  ]

  return (
    <Card
      size='small'
      title={
        <center>
          <span style={styleProps.title}>👇 Start Here: Setup & Config</span>
        </center>
      }
      headStyle={styleProps.headStyle}
    >
      <Tabs
        disabled={true}
        activeKey={rootState.activeRulesTab}
        size='small'
        tabBarGutter={deviceType.isSmartphone ? 15 : 20}
        tabBarStyle={styleProps.tabBarStyle}
        onTabClick={(key) => setRootState({ activeRulesTab: key })}
        tabBarExtraContent={
          rootState.distributeTo === Enums.values.NFT ? (
            <Button
              style={styleProps.tabButton}
              onClick={handleSelectNFT}
              icon={
                !rootState.nftMetaData.id ? null : (
                  <Image src={rootState.nftMetaData.imageUrl} style={styleProps.nftIcon} preview={false} />
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
