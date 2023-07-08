import React, { useReducer } from 'react'
import { Card, Button, message, InputNumber, Radio, List, Avatar } from 'antd'
import { CopyOutlined, PlayCircleOutlined, UserOutlined } from '@ant-design/icons'

const radioOptions = [
  { label: '1', value: 1 },
  { label: '3', value: 3 },
  { label: '5', value: 5 },
  { label: '10', value: 10 },
  { label: 'Other', value: 'Other' }
]

const initialState = {
  executing: false,
  totalUsers: 1,
  randomUsers: [
    {
      title: 'Ant Design Title 1'
    },
    {
      title: 'Ant Design Title 2'
    },
    {
      title: 'Ant Design Title 3'
    },
    {
      title: 'Ant Design Title 4'
    }
  ]
}

const reducer = (state, newState) => ({ ...state, ...newState })

const RandomizeDialogContent = ({ randomUserKey, copyToClipboard, setRandomizeState }) => {
  const [state, setState] = useReducer(reducer, initialState)

  const handleInputChange = (value) => {
    setState({ totalUsers: value })
  }

  const handleRadioChange = ({ target: { value } }) => {
    if (value === 'Other') {
      setState({ totalUsers: 1 })
    } else {
      setState({ totalUsers: value })
    }
  }

  const handleCopyClick = (e) => {
    copyToClipboard(e.title)
    console.log(e)
  }

  const handleExecuteRandomize = () => {
    let randomUsers = state.totalUsers

    // First Value Input Value
    if (!randomUsers) {
      return message.error('Please specify a number of users to return')
    }

    // Next, disable Inputs and actions
    setState({ executing: true })
    setRandomizeState(true, randomUsers)

    setTimeout(() => {
      // Run logic to randomize users
      setState({ executing: false })
      setRandomizeState(false, randomUsers)
      message.success('Randomize Complete')
    }, 1000)
  }

  return (
    <Card>
      <p>Please specify the number of random users to return:</p>
      <Radio.Group
        disabled={state.executing}
        options={radioOptions}
        onChange={handleRadioChange}
        value={state.totalUsers}
        optionType='button'
        buttonStyle='solid'
      />
      <InputNumber
        disabled={state.executing}
        addonBefore={<UserOutlined />}
        min={1}
        style={{ width: 150 }}
        value={state.totalUsers}
        onChange={handleInputChange}
      />
      <Button
        icon={<PlayCircleOutlined />}
        loading={state.executing}
        disabled={state.executing}
        onClick={handleExecuteRandomize}
        size='large'
      >
        Run
      </Button>
      <List
        itemLayout='horizontal'
        dataSource={state.randomUsers}
        renderItem={(item, index) => (
          <List.Item actions={[<CopyOutlined onClick={() => handleCopyClick(item)} />]}>
            <List.Item.Meta
              avatar={<Avatar src={`https://xsgames.co/randomusers/avatar.php?g=pixel&key=${index}`} />}
              title={item.title}
            />
          </List.Item>
        )}
      />
    </Card>
  )
}

export default RandomizeDialogContent
