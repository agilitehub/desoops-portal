// This component loads an Ant Design Modal component.
// Using a Input component, the user can search for a DeSo user.
// The results of the search will be displayed in as a typeahead.
// A debounce function is used to limit the number of API calls.
// once the user selects a user, the selected user gets added as a Ant Design Tag under the search box.
// The user can then remove the tag if they wish.
// Once the user is happy with the list of users, they can click the Confirm button, which will call a passed function and close the Modal.

import React, { useEffect, useMemo, useRef, useState } from 'react'
import { Row, Modal, Col, Spin, Select, Divider, Button } from 'antd'
import { generateProfilePicUrl, searchForUsers } from '../../../lib/deso-controller-graphql'
import { cloneDeep, debounce } from 'lodash'
import Enums from '../../../lib/enums'
import { desoUserModel } from '../../../lib/data-models'
import { SortAscendingOutlined } from '@ant-design/icons'

const DeSoUserSearchModal = ({ isOpen, publicKey, rootState, deviceType, onConfirm, onCancel }) => {
  const [search, setSearch] = useState([])

  // Create a useEffect hook to monitor the prop isOpen
  useEffect(() => {
    if (isOpen) {
      // Map through rootState.customListModal.userList and create new array of key, label, value
      const options = rootState.customListModal.userList.map((entry) => {
        return { key: entry.publicKey, label: entry.username, value: entry.publicKey }
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

    // If there are entries in rootState.customListModal.userList, then compare...
    // with the new list and remove any entries that are not in the new list.
    // If there are new entries in the new list, add them to...
    // ...rootState.customListModal.userList initiating using desoUserModel()

    if (rootState.customListModal.userList.length > 0) {
      userList = cloneDeep(rootState.customListModal.userList)

      for (const entry of userList) {
        const found = search.find((item) => item.value === entry.publicKey)

        if (!found) {
          // Remove entry from userList
          userList = userList.filter((item) => item.publicKey !== entry.publicKey)
        }
      }

      for (const entry of search) {
        const found = userList.find((item) => item.publicKey === entry.value)

        if (!found) {
          newEntry = desoUserModel()

          newEntry = {
            ...newEntry,
            isCustom: true,
            publicKey: entry.value,
            username: entry.label,
            tokenBalance: 1,
            profilePicUrl: await generateProfilePicUrl(entry.value)
          }

          userList.push(newEntry)
        }
      }
    } else {
      for (const entry of search) {
        newEntry = desoUserModel()

        newEntry = {
          ...newEntry,
          isCustom: true,
          publicKey: entry.value,
          username: entry.label,
          tokenBalance: 1,
          profilePicUrl: await generateProfilePicUrl(entry.value)
        }

        userList.push(newEntry)
      }
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

  const DebounceSelect = ({ fetchOptions, debounceTimeout = 800, ...props }) => {
    const [fetching, setFetching] = useState(false)
    const [options, setOptions] = useState([])
    const fetchRef = useRef(0)

    const debounceFetcher = useMemo(() => {
      const loadOptions = (value) => {
        fetchRef.current += 1
        const fetchId = fetchRef.current
        setOptions([])
        setFetching(true)

        fetchOptions(value).then((newOptions) => {
          if (fetchId !== fetchRef.current) {
            // for fetch callback order
            return
          }
          setOptions(newOptions)
          setFetching(false)
        })
      }
      return debounce(loadOptions, debounceTimeout)
    }, [fetchOptions, debounceTimeout])
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

  const fetchUserList = async (search) => {
    return await searchForUsers(publicKey, search, Enums.defaults.USER_SEARCH_NUM_TO_FETCH)
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
            fetchOptions={fetchUserList}
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
