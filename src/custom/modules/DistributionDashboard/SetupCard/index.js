import React from 'react'
import { useSelector } from 'react-redux'
import { Card, Tabs, Button } from 'antd'
import GeneralTab from './GeneralTab'
import RulesTab from './RulesTab'
import { SaveOutlined, UploadOutlined } from '@ant-design/icons'
import DeSoNFTSearchModal from '../../../reusables/components/DeSoNFTSearchModal'
import DeSoUserSearchModal from '../../../reusables/components/DeSoUserSearchModal'
import SelectTemplateModal from '../SelectTemplateModal'
import TemplateNameModal from '../TemplateNameModal'
import DiamondOptionsModal from '../../../reusables/components/DiamondOptionsModal'

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
  onConfirmDiamondOptions,
  deviceType,
  isLoading
}) => {
  const distributionTemplates = useSelector((state) => state.custom.distributionTemplates)

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

  const handleLoadSetup = () => {
    setRootState({ selectTemplateModal: { ...rootState.selectTemplateModal, isOpen: true } })
  }

  const handleSaveSetup = (forceNew) => {
    if (!templateNameModal.id || forceNew) {
      setRootState({ templateNameModal: { ...templateNameModal, isOpen: true, forceNew } })
    } else {
      onSetTemplateName()
    }
  }

  const handleCancelDiamondOptionsModal = () => {
    setRootState({ diamondOptionsModal: { ...rootState.diamondOptionsModal, isOpen: false } })
  }

  const renderTabBarExtraContent = () => {
    let tabBarExtraContent = null

    if (!rootState.distributeTo) {
      tabBarExtraContent = (
        <Button
          icon={<UploadOutlined />}
          style={styleProps.tabButton}
          onClick={() => handleLoadSetup(templateNameModal.id)}
        >
          Load Setup
        </Button>
      )
    } else if (
      rootState.rulesEnabled &&
      !rootState.isExecuting &&
      templateNameModal.id &&
      templateNameModal.isModified
    ) {
      tabBarExtraContent = (
        <Button icon={<SaveOutlined />} style={styleProps.tabButton} onClick={() => handleSaveSetup()}>
          Update Setup
        </Button>
      )
    } else if (rootState.rulesEnabled && !rootState.isExecuting && !templateNameModal.id) {
      tabBarExtraContent = (
        <Button
          icon={<SaveOutlined />}
          style={styleProps.tabButton}
          onClick={() => handleSaveSetup(templateNameModal.id)}
        >
          Save Setup
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
    title: { fontSize: deviceType.isSmartphone ? 14 : 18 },
    headStyle: { background: '#DDE6ED', minHeight: deviceType.isSmartphone ? 30 : 40 },
    tabButton: {
      color: '#188EFF',
      borderColor: '#188EFF',
      backgroundColor: 'white',
      fontSize: deviceType.isSmartphone ? 14 : 16,
      marginBottom: deviceType.isSmartphone ? 3 : 0
    },
    btnUpdateActive: {
      color: '#188EFF',
      borderColor: '#188EFF',
      backgroundColor: 'white',
      marginTop: 20,
      marginRight: 10
    },
    btnUpdateInactive: {
      color: '#D5D5D5',
      borderColor: '#D5D5D5',
      backgroundColor: 'white',
      marginTop: 20,
      marginRight: 10
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
        title={<span style={styleProps.title}>👇 Step 1: Setup & Config (Start Here)</span>}
        headStyle={styleProps.headStyle}
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
      {rootState.diamondOptionsModal.isOpen ? (
        <DiamondOptionsModal
          isOpen={rootState.diamondOptionsModal.isOpen}
          deviceType={deviceType}
          rootState={rootState}
          desoData={desoData}
          onConfirm={onConfirmDiamondOptions}
          onCancel={handleCancelDiamondOptionsModal}
        />
      ) : null}
    </>
  )
}

export default SetupCard
