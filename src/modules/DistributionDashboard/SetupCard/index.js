import React from 'react'
import { useSelector } from 'react-redux'
import { Card, Tabs, Button, Image } from 'antd'
import GeneralTab from './GeneralTab'
import RulesTab from './RulesTab'
import Enums from '../../../lib/enums'
import { UsergroupAddOutlined, FileAddOutlined, SaveOutlined } from '@ant-design/icons'
import DeSoNFTSearchModal from '../../../reusables/components/DeSoNFTSearchModal'
import DeSoUserSearchModal from '../../../reusables/components/DeSoUserSearchModal'
import SelectTemplateModal from '../SelectTemplateModal'
import TemplateNameModal from '../TemplateNameModal'

import './style.sass'

const SetupCard = ({
  desoData,
  rootState,
  templateNameModal,
  onDistributeTo,
  onDistributeMyHodlers,
  onDistributeDeSoUser,
  onDistributionType,
  onTokenToUse,
  setRootState,
  onConfirmNFT,
  onConfirmCustomList,
  onSelectTemplate,
  onEditTemplate,
  onDeleteTemplate,
  onSetTemplateName,
  deviceType,
  isLoading
}) => {
  const distributionTemplates = useSelector((state) => state.core.distributionTemplates)

  const handleButtonClick = () => {
    switch (rootState.distributeTo) {
      case Enums.values.NFT:
        setRootState({ openNftSearch: true })
        break
      case Enums.values.CUSTOM:
        setRootState({ customListModal: { ...rootState.customListModal, isOpen: true } })
        break
      case Enums.values.EMPTY_STRING:
        setRootState({ selectTemplateModal: { ...rootState.selectTemplateModal, isOpen: true } })
        break
    }
  }

  const handleCancelNFT = () => {
    setRootState({ openNftSearch: false })
  }

  const handleCancelCustomList = () => {
    setRootState({ customListModal: { ...rootState.customListModal, isOpen: false } })
  }

  const handleCancelTemplateModal = () => {
    setRootState({ selectTemplateModal: { ...rootState.selectTemplateModal, isOpen: false } })
  }

  const handleCancelTemplateNameModal = () => {
    setRootState({ templateNameModal: { ...templateNameModal, isOpen: false, forceNew: false } })
  }

  const handleSaveSetup = (forceNew) => {
    if (!templateNameModal.id || forceNew) {
      setRootState({ templateNameModal: { ...templateNameModal, isOpen: true, forceNew } })
    } else {
      onSetTemplateName()
    }
  }

  const renderTabBarExtraContent = () => {
    let tabBarExtraContent = null

    if (rootState.distributeTo === Enums.values.NFT) {
      const nftIcon = rootState.nftMetaData.id ? (
        <Image src={rootState.nftMetaData.imageUrl} style={styleProps.nftIcon} preview={false} />
      ) : null

      tabBarExtraContent = (
        <Button className='btn-tab' onClick={handleButtonClick} icon={nftIcon}>
          Select NFT
        </Button>
      )
    } else if (rootState.distributeTo === Enums.values.CUSTOM) {
      tabBarExtraContent = (
        <Button className='btn-tab' onClick={handleButtonClick} icon={<UsergroupAddOutlined />}>
          Manage List
        </Button>
      )
    } else if (rootState.distributeTo === Enums.values.EMPTY_STRING) {
      tabBarExtraContent = (
        <Button className='btn-tab' onClick={handleButtonClick} icon={<FileAddOutlined />}>
          Load Setup
        </Button>
      )
    }

    return tabBarExtraContent
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

  const styleProps = {
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

  return (
    <>
      <Card
        size='small'
        className='card-wrapper'
        title={<span className='class-title'>👇 Start Here: Setup & Config</span>}
      >
        <Tabs
          disabled={true}
          activeKey={rootState.activeRulesTab}
          size='small'
          tabBarGutter={deviceType.isSmartphone ? 15 : 20}
          onTabClick={(key) => setRootState({ activeRulesTab: key })}
          tabBarExtraContent={renderTabBarExtraContent()}
          items={tabItems}
        />
        <center>
          {templateNameModal.id ? (
            <Button
              size={deviceType.isTablet ? 'large' : 'medium'}
              type='primary'
              icon={<SaveOutlined />}
              className={
                !rootState.rulesEnabled ||
                rootState.isExecuting ||
                !templateNameModal.isModified ||
                !templateNameModal.id
                  ? 'btn-save btn-disabled'
                  : 'btn-save btn-primary'
              }
              onClick={() => handleSaveSetup()}
              disabled={
                !rootState.rulesEnabled ||
                rootState.isExecuting ||
                !templateNameModal.isModified ||
                !templateNameModal.id
              }
            >
              Update Setup
            </Button>
          ) : null}
          <Button
            size={deviceType.isTablet ? 'large' : 'medium'}
            type='primary'
            icon={<SaveOutlined />}
            className={
              !rootState.rulesEnabled || rootState.isExecuting ? 'btn-save btn-disabled' : 'btn-save btn-primary'
            }
            onClick={() => handleSaveSetup(templateNameModal.id)}
            disabled={!rootState.rulesEnabled || rootState.isExecuting}
          >
            {templateNameModal.id ? 'Save As...' : 'Save Setup'}
          </Button>
          {templateNameModal.id ? (
            <div style={{ display: 'block', marginTop: 5 }}>
              <span style={{ fontSize: 14, color: '#FF7F50' }}>{`Current Setup: ${templateNameModal.name}`}</span>
            </div>
          ) : null}
        </center>
      </Card>
      {rootState.openNftSearch ? (
        <DeSoNFTSearchModal
          isOpen={rootState.openNftSearch}
          deviceType={deviceType}
          publicKey={desoData.profile.publicKey}
          rootState={rootState}
          onConfirmNFT={onConfirmNFT}
          onCancelNFT={handleCancelNFT}
        />
      ) : null}
      {rootState.customListModal.isOpen ? (
        <DeSoUserSearchModal
          isOpen={rootState.customListModal.isOpen}
          deviceType={deviceType}
          publicKey={desoData.profile.publicKey}
          rootState={rootState}
          onConfirm={onConfirmCustomList}
          onCancel={handleCancelCustomList}
        />
      ) : null}
      {rootState.selectTemplateModal.isOpen ? (
        <SelectTemplateModal
          isOpen={rootState.selectTemplateModal.isOpen}
          templates={distributionTemplates}
          deviceType={deviceType}
          templateNameModal={templateNameModal}
          distributionTemplates={distributionTemplates}
          onCancelTemplateNameModal={handleCancelTemplateNameModal}
          onSelectTemplate={onSelectTemplate}
          onEditTemplate={onEditTemplate}
          onDeleteTemplate={onDeleteTemplate}
          onCancel={handleCancelTemplateModal}
          setRootState={setRootState}
        />
      ) : null}
      {templateNameModal.isOpen ? (
        <TemplateNameModal
          isOpen={templateNameModal.isOpen}
          templateNameModal={templateNameModal}
          deviceType={deviceType}
          isLoading={isLoading}
          distributionTemplates={distributionTemplates}
          onSetTemplateName={onSetTemplateName}
          onCancel={handleCancelTemplateNameModal}
        />
      ) : null}
    </>
  )
}

export default SetupCard
