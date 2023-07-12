import React from 'react'
import { Card, Tabs, Button } from 'antd'
import GeneralTab from './GeneralTab'
import RulesTab from './RulesTab'
import Enums from '../../../lib/enums'

const { TabPane } = Tabs

const SetupCard = ({ desoData, state, onDistributeTo, onDistributionType, onTokenToUse, onSetState }) => {
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
      >
        <TabPane tab='General' key='1'>
          <GeneralTab
            desoProfile={desoData.profile}
            state={state}
            onDistributeTo={onDistributeTo}
            onDistributionType={onDistributionType}
            onSetState={onSetState}
            onTokenToUse={onTokenToUse}
          />
        </TabPane>
        {state.rulesEnabled ? (
          <TabPane tab='Rules' key='2'>
            <RulesTab desoData={desoData} />
          </TabPane>
        ) : null}
      </Tabs>
    </Card>
  )
}

export default SetupCard
