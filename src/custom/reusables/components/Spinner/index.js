// UI Components
import { Row, Spin } from 'antd'

const Spinner = ({ tip }) => {
  return (
    <Row justify='center' style={{ marginTop: 100 }}>
      <Spin tip={tip} size='large'></Spin>
    </Row>
  )
}

export default Spinner
