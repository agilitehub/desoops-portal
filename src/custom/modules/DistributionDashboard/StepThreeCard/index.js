// Create a ReactJS Functional Component called StepOneCard
// Use Ant Design's Card Component, with a title of 'Start Here' and size of 'small'
// Use Ant Design's Row and Col Components to create a 2x2 grid

import React, { useReducer } from 'react'
import { Card, Row, Col, theme, Select, message, Divider, InputNumber, Popconfirm, Button } from 'antd'
import Enums from '../../../lib/enums'
import { hexToInt } from '../../../lib/utils'
import { RightCircleOutlined, SendOutlined } from '@ant-design/icons'
import { size } from 'lodash'

const styleParams = {
  labelColXS: 12,
  labelColSM: 12,
  labelColMD: 7,
  valueColXS: 12,
  valueColSM: 12,
  valueColMD: 15,
  colRightXS: 24,
  labelColStyle: {},
  dividerStyle: { margin: '7px 0' }
}

const StepThreeCard = ({ desoData, state, onSetState }) => {
  const { token } = theme.useToken()

  return (
    <Card title='Step 3: Distribution Summary' size='small'>
      <Row>
        <Col
          xs={styleParams.labelColXS}
          sm={styleParams.labelColSM}
          md={styleParams.labelColMD}
          style={styleParams.labelColStyle}
        >
          <span style={{ fontWeight: 'bold' }}>No of Hodlers:</span>
        </Col>
        <Col xs={styleParams.valueColXS} sm={styleParams.valueColSM} md={styleParams.valueColMD}>
          <span>20</span>
        </Col>
      </Row>
      <Row>
        <Col
          xs={styleParams.labelColXS}
          sm={styleParams.labelColSM}
          md={styleParams.labelColMD}
          style={styleParams.labelColStyle}
        >
          <span style={{ fontWeight: 'bold' }}>Amount:</span>
        </Col>
        <Col xs={styleParams.valueColXS} sm={styleParams.valueColSM} md={styleParams.valueColMD}>
          <span>20 $DESO (~25 $DESO Available)</span>
        </Col>
      </Row>
      <Row>
        <Col
          xs={styleParams.labelColXS}
          sm={styleParams.labelColSM}
          md={styleParams.labelColMD}
          style={styleParams.labelColStyle}
        >
          <span style={{ fontWeight: 'bold' }}>Transaction Fee:</span>
        </Col>
        <Col xs={styleParams.valueColXS} sm={styleParams.valueColSM} md={styleParams.valueColMD}>
          <span>$0.02 (~0.02 $DESO)</span>
        </Col>
      </Row>
      {state.distributionType !== Enums.values.EMPTY_STRING ? (
        <>
          <Divider style={styleParams.dividerStyle} />
          <Row>
            <Col
              xs={styleParams.labelColXS}
              sm={styleParams.labelColSM}
              md={styleParams.labelColMD}
              style={styleParams.labelColStyle}
            >
              <span style={{ fontWeight: 'bold' }}>Amount to distribute:</span>
            </Col>
            <Col xs={styleParams.valueColXS} sm={styleParams.valueColSM} md={styleParams.valueColMD}>
              <InputNumber
                addonBefore={state.distributionType}
                // disabled={state.distributeTo && state.distributionType && !state.isExecuting ? false : true}
                placeholder='Enter amount'
                value={state.distributionAmount}
                style={{ width: 250 }}
                onChange={(distributionAmount) => {
                  onSetState({ distributionAmount })
                }}
              />
            </Col>
          </Row>
        </>
      ) : null}
      <Divider style={{ margin: '10px 0' }} />
      <Row justify='center'>
        <Col>
          <Popconfirm
            title='Are you sure you want to execute payments to the below'
            okText='Yes'
            cancelText='No'
            // onConfirm={handleExecute}
            // disabled={
            //   isExecuting ||
            //   validationMessage ||
            //   !transactionType ||
            //   !paymentType ||
            //   !amount ||
            //   validateExecution()
            // }
          >
            <Button
              style={{ color: 'green', borderColor: 'green', backgroundColor: 'white' }}
              icon={<RightCircleOutlined />}
              size='large'
            >
              Execute Distribution
            </Button>
          </Popconfirm>
        </Col>
      </Row>
    </Card>
  )
}

export default StepThreeCard
