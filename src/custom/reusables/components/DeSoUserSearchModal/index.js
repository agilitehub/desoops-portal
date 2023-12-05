// This component loads an Ant Design Modal component.
// Using a Input component, the user can search for a DeSo user.
// The results of the search will be displayed in as a typeahead.
// A debounce function is used to limit the number of API calls.
// once the user selects a user, the selected user gets added as a Ant Design Tag under the search box.
// The user can then remove the tag if they wish.
// Once the user is happy with the list of users, they can click the Confirm button, which will call a passed function and close the Modal.

import React, { useEffect, useMemo, useRef, useState } from 'react'
import { Row, Modal, Col, Spin, Select, Divider, Button } from 'antd'
import { generateProfilePicUrl } from '../../../lib/deso-controller-graphql'
import { cloneDeep, debounce } from 'lodash'
import Enums from '../../../lib/enums'
import { desoUserModel } from '../../../lib/data-models'
import { SortAscendingOutlined } from '@ant-design/icons'
import { SEARCH_PROFILES } from 'custom/lib/graphql-models'
import { useApolloClient } from '@apollo/client'
import { calculateDaysSinceLastActive } from 'custom/lib/utils'

const DeSoUserSearchModal = ({ isOpen, publicKey, rootState, deviceType, onConfirm, onCancel }) => {
  const [search, setSearch] = useState([])
  const client = useApolloClient()

  // Create a useEffect hook to monitor the prop isOpen
  useEffect(() => {
    if (isOpen) {
      // Map through rootState.customListModal.userList and create new array of key, label, value
      const options = rootState.customListModal.userList.map((entry) => {
        return { key: entry.publicKey, label: entry.username, value: `${entry.publicKey}~${entry.lastActiveDays}` }
      })

      setSearch(options)
    } else {
      // Reset the state
      setSearch([])
    }
  }, [isOpen]) // eslint-disable-line react-hooks/exhaustive-deps

  const handleConfirm = async () => {
    let userList = []
    let newEntry = null
    let publicKey = null
    let lastActiveDays = null
    let tmpData = null

    for (const entry of search) {
      tmpData = entry.value.split('~')
      publicKey = tmpData[0]
      lastActiveDays = tmpData[1]

      newEntry = desoUserModel()

      newEntry = {
        ...newEntry,
        isCustom: true,
        publicKey,
        username: entry.label,
        tokenBalance: 1,
        lastActiveDays,
        profilePicUrl: await generateProfilePicUrl(publicKey)
      }

      userList.push(newEntry)
    }

    onConfirm(userList)
  }

  // Create a function to sort the list by username ascending
  const sortList = () => {
    const userList = cloneDeep(search)

    userList.sort((a, b) => {
      if (a.label.toLowerCase() < b.label.toLowerCase()) {
        return -1
      }
      if (a.label.toLowerCase() > b.label.toLowerCase()) {
        return 1
      }
      return 0
    })

    setSearch(userList)
  }

  const DebounceSelect = ({ debounceTimeout = 800, ...props }) => {
    const [fetching, setFetching] = useState(false)
    const [options, setOptions] = useState([])
    const fetchRef = useRef(0)

    const debounceFetcher = useMemo(() => {
      const loadOptions = (value) => {
        fetchRef.current += 1
        const fetchId = fetchRef.current
        setOptions([])
        setFetching(true)

        const gqlProps = {
          orderBy: 'USERNAME_ASC',
          filter: {
            username: {
              includesInsensitive: value
            }
          },
          first: Enums.defaults.USER_SEARCH_NUM_TO_FETCH
        }

        client.query({ query: SEARCH_PROFILES, variables: gqlProps }).then((newOptions) => {
          if (fetchId !== fetchRef.current) {
            // for fetch callback order
            return
          }

          const result = newOptions.data.profiles.nodes.map((entry) => {
            return {
              key: entry.publicKey,
              label: entry.username,
              value: `${entry.publicKey}~${calculateDaysSinceLastActive(
                entry.account.transactionStats.latestTransactionTimestamp
              )}`
            }
          })

          setOptions(result)
          setFetching(false)
        })
      }
      return debounce(loadOptions, debounceTimeout)
    }, [debounceTimeout])
    return (
      <Select
        autoFocus={!deviceType.isMobile}
        labelInValue
        filterOption={false}
        onSearch={debounceFetcher}
        notFoundContent={fetching ? <Spin size='small' /> : null}
        {...props}
        options={options}
      />
    )
  }

  const styleProps = {
    checkbox: { fontSize: 16, fontWeight: 'bold' },
    searchField: { width: '100%', fontSize: 16 },
    divider: { margin: deviceType.isMobile ? '3px 0' : '7px 0', borderBlockStart: 0 }
  }

  return (
    <Modal
      title={'Search DeSo Users'}
      open={isOpen}
      onOk={handleConfirm}
      onCancel={onCancel}
      okText='Confirm'
      cancelText='Cancel'
      maskClosable={false}
      keyboard={false}
    >
      <Row>
        <Col span={24}>
          <DebounceSelect
            mode='multiple'
            value={search}
            placeholder='Search users'
            onChange={(search) => {
              setSearch(search)
            }}
            style={styleProps.searchField}
          />
        </Col>
      </Row>
      <Divider style={styleProps.divider} />
      <Row>
        <Col span={24}>
          <Button
            size={deviceType.isTablet ? 'large' : 'medium'}
            type='primary'
            icon={<SortAscendingOutlined />}
            onClick={sortList}
          >
            Sort Users
          </Button>
        </Col>
      </Row>
    </Modal>
  )
}

export default DeSoUserSearchModal
