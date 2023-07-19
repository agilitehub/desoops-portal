// This is a generic spinner component that can be used to show a loading state

import PropTypes from 'prop-types'
import { Row, Spin } from 'antd'

const Spinner = ({ tip }) => {
  return (
    <Row justify='center' style={{ marginTop: 100 }}>
      <Spin tip={tip} size='large'>
        <div style={{ width: 300 }} />
      </Spin>
    </Row>
  )
}

export default Spinner

// Add Prop Types for this component
Spinner.propTypes = {
  tip: PropTypes.string
}
