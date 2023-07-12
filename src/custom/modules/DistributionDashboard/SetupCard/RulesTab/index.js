// Create a ReactJS Functional Component called StepOneCard
// Use Ant Design's Card Component, with a title of 'Start Here' and size of 'small'
// Use Ant Design's Row and Col Components to create a 2x2 grid

import React from 'react'
import { Row, Col, Select, Divider, InputNumber, Radio, Switch } from 'antd'

const styleParams = {
  col1XS: 24,
  labelColSM: 12,
  labelColMD: 9,
  valueColXS: 24,
  valueColSM: 12,
  valueColMD: 15,
  colRightXS: 24,
  labelColStyle: { marginTop: 4 },
  dividerStyle: { margin: '7px 0' }
}

const RulesTab = ({ desoData, state, onSetState }) => {
  return (
    <>
      <Row>
        <Col xs={styleParams.col1XS} style={{ marginBottom: 5 }}>
          <span style={{ fontSize: 16 }}>
            <b>Spread amount based on:</b>
          </span>
        </Col>
        <Col xs={styleParams.col1XS}>
          <Radio.Group
            value={state.spreadAmountBasedOn}
            buttonStyle='solid'
            onChange={(e) => onSetState({ spreadAmountBasedOn: e.target.value })}
          >
            <Radio.Button value={'Ownership'}>% Ownership</Radio.Button>
            <Radio.Button value={'Equal Spread'}>Equal Spread</Radio.Button>
          </Radio.Group>
        </Col>
      </Row>
      <Divider style={styleParams.dividerStyle} />
      <Row>
        <Col xs={styleParams.col1XS} style={{ marginBottom: 5 }}>
          <span style={{ fontSize: 16 }}>
            <b>Filter users based on Coins/Tokens owned?</b>
          </span>
        </Col>
        <Col xs={styleParams.col1XS}>
          <Switch
            style={{ width: 65 }}
            checkedChildren='Yes'
            unCheckedChildren='No'
            onChange={(checked) => {
              onSetState({ filterUsers: checked })
            }}
          />
        </Col>
      </Row>
      {state.filterUsers ? (
        <>
          <Divider style={styleParams.dividerStyle} />
          <Row>
            <Col xs={24} sm={7} md={5} lg={24} style={{ paddingTop: 3, paddingBottom: 3 }}>
              <span style={{ fontSize: 16 }}>
                <b>Where amount is</b>
              </span>
            </Col>
            <Col xs={5} sm={4} md={3} lg={5}>
              <Select
                style={{ width: 70 }}
                value={state.filterAmountIs}
                onChange={(filterAmountIs) => {
                  onSetState({ filterAmountIs })
                }}
              >
                <Select.Option value={'>'}>{'>'}</Select.Option>
                <Select.Option value={'>='}>{'>='}</Select.Option>
                <Select.Option value={'<'}>{'<'}</Select.Option>
                <Select.Option value={'<='}>{'<='}</Select.Option>
              </Select>
            </Col>
            <Col>
              <InputNumber
                addonBefore={state.distributionType}
                min={0}
                placeholder='Enter amount'
                style={{ width: 225 }}
                onChange={(filterAmount) => {
                  onSetState({ filterAmount })
                }}
              />
            </Col>
          </Row>
        </>
      ) : null}
    </>
  )
}

export default RulesTab
