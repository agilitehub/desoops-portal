import PropTypes from 'prop-types'
import { Row, Spin } from 'antd'

const Spinner = ({ tip }) => {
  return (
    <Row justify='center' className='mt-[100px]'>
      <Spin tip={tip} size='large'>
        <div className='w-[400px]' />
      </Spin>
    </Row>
  )
}

export default Spinner

Spinner.propTypes = {
  tip: PropTypes.string
}
