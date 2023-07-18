import React from 'react'
import { Card, Tabs, Button } from 'antd'
import GeneralTab from './GeneralTab'
import RulesTab from './RulesTab'
import Enums from '../../../lib/enums'

const { TabPane } = Tabs

const SetupCard = ({ desoData, state, onDistributeTo, onDistributionType, onTokenToUse, onSetState }) => {
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
            <Button style={{ color: '#188EFF', borderColor: '#188EFF', backgroundColor: 'white' }}>Select NFT</Button>
          ) : null
        }
        items={tabItems}
      />
    </Card>
  )
}

export default SetupCard
