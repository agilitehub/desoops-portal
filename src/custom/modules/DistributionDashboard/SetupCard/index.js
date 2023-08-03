import React from 'react'
import { Card, Tabs, Button, Image } from 'antd'
import GeneralTab from './GeneralTab'
import RulesTab from './RulesTab'
import Enums from '../../../lib/enums'
import { UsergroupAddOutlined } from '@ant-design/icons'

const SetupCard = ({
  desoData,
  rootState,
  onDistributeTo,
  onDistributeMyHodlers,
  onDistributeDeSoUser,
  onDistributionType,
  onTokenToUse,
  setRootState,
  onConfirmNFT,
  onConfirmCustomList,
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
    }
  }

  const handleButtonClick = () => {
    switch (rootState.distributeTo) {
      case Enums.values.NFT:
        setRootState({ openNftSearch: true })
        break
      case Enums.values.CUSTOM:
        setRootState({ customListModal: { ...rootState.customListModal, isOpen: true } })
        break
    }
  }

  const handleCancelNFT = () => {
    setRootState({ openNftSearch: false })
  }

  const handleCancelCustomList = () => {
    setRootState({ customListModal: { ...rootState.customListModal, isOpen: false } })
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
          onDistributeMyHodlers={onDistributeMyHodlers}
          onDistributeDeSoUser={onDistributeDeSoUser}
          onDistributionType={onDistributionType}
          setRootState={setRootState}
          onTokenToUse={onTokenToUse}
          onConfirmNFT={onConfirmNFT}
          onCancelNFT={handleCancelNFT}
          onConfirmCustomList={onConfirmCustomList}
          onCancelCustomList={handleCancelCustomList}
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
      title={<span style={styleProps.title}>👇 Start Here: Setup & Config</span>}
      headStyle={styleProps.headStyle}
    >
      <Tabs
        disabled={true}
        activeKey={rootState.activeRulesTab}
        size='small'
        tabBarGutter={deviceType.isSmartphone ? 15 : 20}
        onTabClick={(key) => setRootState({ activeRulesTab: key })}
        tabBarExtraContent={
          rootState.distributeTo === Enums.values.NFT ? (
            <Button
              style={styleProps.tabButton}
              onClick={handleButtonClick}
              icon={
                rootState.nftMetaData.id ? (
                  <Image src={rootState.nftMetaData.imageUrl} style={styleProps.nftIcon} preview={false} />
                ) : null
              }
            >
              Select NFT
            </Button>
          ) : rootState.distributeTo === Enums.values.CUSTOM ? (
            <Button style={styleProps.tabButton} onClick={handleButtonClick} icon={<UsergroupAddOutlined />}>
              Manage List
            </Button>
          ) : null
        }
        items={tabItems}
      />
    </Card>
  )
}

export default SetupCard
