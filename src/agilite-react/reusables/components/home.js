import { Col, Row } from 'antd'
import DeSoOpsBanner from '../../resources/deso-ops-logo-full.png'

const Home = () => {
  return (
    <Row justify='center'>
      <Col>
        <h2 style={{ textAlign: 'center' }}>WELCOME TO</h2>
        <img src={DeSoOpsBanner} alt='DeSo Ops' />
      </Col>
    </Row>
  )
}

export default Home
