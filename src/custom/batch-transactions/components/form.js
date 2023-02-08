import React, { memo, useEffect, useState } from 'react'
import { Row, Col, Card, Select, Button, Popconfirm, Input, message, Table, Popover, Divider, Modal } from 'antd'
import { CopyToClipboard } from 'react-copy-to-clipboard'
import { getFollowers, getHodlers, payCeatorHodler, payDaoHodler } from '../controller'
import { useDispatch, useSelector } from 'react-redux'
import { CheckCircleOutlined, CloseCircleOutlined } from '@ant-design/icons'
import { getDaoBalance, getNFTdetails, getNFTEntries, getSingleProfile, getUserStateless } from '../../deso/controller'
import AgiliteReactEnums from '../../../agilite-react/resources/enums'
import theme from '../../../agilite-react/resources/theme'
import Enums from '../../../utils/enums'

const _BatchTransactionsForm = () => {
  const dispatch = useDispatch()
  const desoState = useSelector((state) => state.agiliteReact.deso)
  const [transactionType, setTransactionType] = useState(Enums.values.EMPTY_STRING)
  const [paymentType, setPaymentType] = useState(Enums.values.EMPTY_STRING)
  const [hodlers, setHodlers] = useState([])
  const [nftOwners, setNftOwners] = useState([])
  const [selectedRowKeys, setSelectedRowKeys] = useState([])
  const [selectedRows, setSelectedRows] = useState([])
  const [amount, setAmount] = useState('')
  const [nftUrl, setNftUrl] = useState('')
  const [nft, setNft] = useState(null)
  const [validationMessage, setValidationMessage] = useState('')
  const [originalCoinTotal, setOriginalCoinTotal] = useState(0)
  const [loading, setLoading] = useState(false)
  const [isExecuting, setIsExecuting] = useState(false)
  const [quickActionValue, setQuickActionValue] = useState('')

  const handleTransactionTypeChange = async (value) => {
    let tmpHodlers = []
    let finalHodlers = []
    let tmpCoinTotal = 0
    let isDAOCoin = null
    let noOfCoins = 0
    let tmpRowKeys = []

    try {
      if (value === transactionType) return

      handleReset(value)

      if (!value || value === Enums.values.NFT) return

      setLoading(true)
      isDAOCoin = value === Enums.values.DAO
      tmpHodlers = await getHodlers(desoState.profile.Profile.Username, isDAOCoin)

      if (tmpHodlers.Hodlers.length > 0) {
        // Determine Coin Total and valid Hodlers
        tmpHodlers.Hodlers.map((entry) => {
          // Ignore entry if is current logged in user
          if (entry.ProfileEntryResponse?.Username !== desoState.profile.Profile.Username) {
            // Set Defaults
            entry.status = Enums.values.EMPTY_STRING

            // Determine Number of Coins
            if (isDAOCoin) {
              noOfCoins = entry.BalanceNanosUint256
              noOfCoins = hexToInt(noOfCoins)
              noOfCoins = noOfCoins / Enums.values.NANO_VALUE / Enums.values.NANO_VALUE
            } else {
              noOfCoins = entry.BalanceNanos
              noOfCoins = noOfCoins / Enums.values.NANO_VALUE
            }

            // decimalCount = noOfCoins.countDecimals()
            entry.noOfCoins = noOfCoins
            tmpCoinTotal += noOfCoins
            finalHodlers.push(entry)
          }

          return null
        })

        tmpRowKeys = finalHodlers.map((hodler) => hodler.ProfileEntryResponse.Username)
        updateHolderAmounts(finalHodlers.concat(), tmpCoinTotal, 0, tmpRowKeys, tmpCoinTotal)
      }

      setHodlers(finalHodlers)
      setSelectedRows(finalHodlers)
      setSelectedRowKeys(tmpRowKeys)
      setOriginalCoinTotal(tmpCoinTotal)
    } catch (e) {
      message.error(e)
    }

    setLoading(false)
  }

  const handlePaymentTypeChange = (value) => {
    const tmpCoinTotal = calculateCoinTotal(selectedRows)
    setPaymentType(value)
    setAmount('')

    if (transactionType === Enums.values.NFT) {
      handleGetNFT(nftUrl, '')
    } else {
      updateHolderAmounts(hodlers.concat(), tmpCoinTotal, 0, selectedRowKeys, originalCoinTotal)
    }
  }

  const updateHolderAmounts = (tmpHodlers, tmpCoinTotal, tmpAmount, selectedKeys, coinTotalOriginal) => {
    let estimatedPayment = 0

    // Determine % Ownership and Estimated Payment
    tmpHodlers.map((entry) => {
      if (selectedKeys.includes(entry.ProfileEntryResponse.Username)) {
        // Determine % Ownership
        entry.percentOwnership = calculatePercOwnership(entry.noOfCoins, coinTotalOriginal)

        // Determine Estimated Payment
        if (tmpAmount > 0) estimatedPayment = calculateEstimatePayment(entry.noOfCoins, tmpCoinTotal, tmpAmount)
        entry.estimatedPayment = estimatedPayment
      } else {
        // Determine % Ownership
        entry.percentOwnership = calculatePercOwnership(entry.noOfCoins, coinTotalOriginal)
        entry.estimatedPayment = 0
      }

      return null
    })

    setHodlers(tmpHodlers)
  }

  const handleCopyUsernames = (data, isFollowers) => {
    const tmpResult = []
    let result = null

    if (isFollowers) {
      for (const follower in data) tmpResult.push(`@${data[follower].Username}`)
    } else {
      switch (transactionType) {
        case Enums.values.NFT:
          for (const owner of nftOwners) tmpResult.push(`@${owner.username}`)
          break
        default:
          for (const hodler of hodlers) {
            if (
              hodler.ProfileEntryResponse?.Username &&
              selectedRowKeys.includes(hodler.ProfileEntryResponse?.Username)
            ) {
              tmpResult.push(`@${hodler.ProfileEntryResponse.Username}`)
            }
          }
      }
    }

    result = tmpResult.length > 0 ? `${tmpResult.join(' ')} ` : 'No usernames to copy'
    return result
  }

  const handleRefresh = async () => {
    let profile = null

    setLoading(true)

    try {
      profile = await getSingleProfile(desoState.profile.Profile.PublicKeyBase58Check)
      await getDoaBalance(desoState.profile.Profile.PublicKeyBase58Check)
      dispatch({ type: AgiliteReactEnums.reducers.SET_PROFILE_DESO, payload: profile })
    } catch (e) {
      console.log(e)
    }

    setLoading(false)
  }

  const getDoaBalance = async (publicKey) => {
    let daoData = null
    let creatorCoinData = null
    let creatorCoinBalance = 0

    try {
      daoData = await getDaoBalance(publicKey)
      creatorCoinData = await getHodlers(desoState.profile.Profile.Username, false)

      creatorCoinData.Hodlers.map((entry) => {
        if (entry.HODLerPublicKeyBase58Check === desoState.profile.Profile.PublicKeyBase58Check) {
          creatorCoinBalance = entry.BalanceNanos
        }

        return null
      })

      dispatch({
        type: AgiliteReactEnums.reducers.SET_DESO_DATA,
        payload: { desoPrice: daoData.desoPrice, daoBalance: daoData.daoBalance, creatorCoinBalance }
      })
    } catch (e) {
      console.log(e)
    }
  }

  const handleQuickAction = async (value) => {
    let response = null
    setQuickActionValue(value)

    switch (value) {
      case 'reset':
        Modal.confirm({
          title: 'Confirm',
          content: 'Are you sure you want to reset this Batch Payment?',
          okText: 'Yes',
          cancelText: 'No',
          onOk: () => handleReset()
        })
        break
      case 'coin':
        break
      case 'refresh':
        handleRefresh()
        break
      case 'followers':
      case 'following':
        setLoading(true)
        response = await getFollowers(desoState.profile.Profile.Username, value === 'followers' ? true : false)
        navigator.clipboard.writeText(handleCopyUsernames(response, true))
        message.info('Usernames copied to clipboard')
        setLoading(false)
        break
      default:
        break
    }

    setQuickActionValue('')
  }

  const generateActions = () => {
    return (
      <>
        <Row justify='center'>
          <Col span={24}>
            <center>
              <h3>Batch Payments</h3>
            </center>
            <Divider />
          </Col>
        </Row>
        <Row justify='space-around'>
          <Col xs={16} md={12} lg={10} xl={8}>
            <center>
              <p style={{ color: theme.twitterBootstrap.primary }}>Step 1</p>
              <Select
                disabled={!desoState.loggedIn || isExecuting}
                onChange={(value) => handleTransactionTypeChange(value)}
                value={transactionType}
                style={{ width: 250 }}
              >
                <Select.Option value={Enums.values.EMPTY_STRING}>- Select Transaction Type -</Select.Option>
                <Select.Option value={Enums.values.CREATOR}>Pay Creator Coin Holders</Select.Option>
                <Select.Option value={Enums.values.DAO}>Pay DAO Coin Holders</Select.Option>
                <Select.Option value={Enums.values.NFT}>Pay NFT Owners</Select.Option>
              </Select>
            </center>
          </Col>
          <Col xs={16} md={12} lg={10} xl={8}>
            <center>
              <Select
                style={{ width: 250 }}
                onChange={(value) => {
                  handleQuickAction(value)
                }}
                value={quickActionValue}
              >
                <Select.Option disabled value=''>
                  - Quick Actions -
                </Select.Option>
                <Select.Option value='reset'>Reset Session</Select.Option>
                <Select.Option value='refresh'>Refresh Amounts and Pricing</Select.Option>
                <Select.Option disabled={!transactionType} value='coin'>
                  <CopyToClipboard
                    text={handleCopyUsernames()}
                    onCopy={() => message.info('Usernames copied to clipboard')}
                  >
                    <span>Copy Coin Holders to clipboard</span>
                  </CopyToClipboard>
                </Select.Option>
                <Select.Option value='followers'>Copy Followers to clipboard</Select.Option>
                <Select.Option value='following'>Copy Following to clipboard</Select.Option>
              </Select>
            </center>
          </Col>
          <Col xs={16} md={12} lg={10} xl={8}>
            <center>
              <p style={{ color: theme.twitterBootstrap.primary }}>Step 2</p>
              <Select
                disabled={!desoState.loggedIn || isExecuting}
                onChange={(value) => handlePaymentTypeChange(value)}
                value={paymentType}
                style={{ width: 250 }}
              >
                <Select.Option value={Enums.values.EMPTY_STRING}>- Payment Type -</Select.Option>
                <Select.Option value={Enums.values.DESO}>$DESO</Select.Option>
                <Select.Option value={Enums.values.DAO}>DAO Coin</Select.Option>
                <Select.Option value={Enums.values.CREATOR}>Creator Coin</Select.Option>
              </Select>
            </center>
          </Col>
        </Row>
      </>
    )
  }

  const handleReset = (tmpTransactionType = Enums.values.EMPTY_STRING) => {
    setTransactionType(tmpTransactionType)
    setPaymentType(Enums.values.EMPTY_STRING)
    setHodlers([])
    setSelectedRowKeys([])
    setAmount('')
    setNftUrl('')
    setNft(null)
    setNftOwners([])
    setValidationMessage('')
    setOriginalCoinTotal(0)
  }

  useEffect(() => {
    const tmpCoinTotal = calculateCoinTotal(selectedRows)

    if (!amount) return

    const delayDebounceFn = setTimeout(() => {
      switch (transactionType) {
        case Enums.values.NFT:
          handleGetNFT(nftUrl, amount)
          break
        default:
          updateHolderAmounts(hodlers.concat(), tmpCoinTotal, parseFloat(amount), selectedRowKeys, originalCoinTotal)
      }
    }, 1000)

    return () => clearTimeout(delayDebounceFn)
    // eslint-disable-next-line
  }, [amount])

  const handleValidateAmount = (e) => {
    const tmpAmount = parseFloat(amount)
    const desoBalance = desoState.profile.Profile.DESOBalanceNanos / Enums.values.NANO_VALUE
    const daoBalance = desoState.daoBalance
    const creatorCoinBalance = desoState.creatorCoinBalance / Enums.values.NANO_VALUE

    if (selectedRowKeys.length < 1) {
      message.error('Please select at least one User')
      return false
    }

    if (!tmpAmount) {
      message.error('Please specify an Amount')
      return false
    }

    switch (paymentType) {
      case Enums.values.DESO:
        if (desoBalance < tmpAmount) {
          message.error('Amount cannot be higher than $DESO Balance')
          return false
        } else {
          return true
        }
      case Enums.values.DAO:
        if (daoBalance < tmpAmount) {
          message.error('Amount cannot be higher than DAO Balance')
          return false
        } else {
          return true
        }
      case Enums.values.CREATOR:
        if (creatorCoinBalance < tmpAmount) {
          message.error('Amount cannot be higher than Creator Coin Balance')
          return false
        } else {
          return true
        }
      default:
        break
    }
  }

  const hexToInt = (hex) => {
    return parseInt(hex, 16)
  }

  const calculatePercOwnership = (value, tmpCoinTotal) => {
    return (value / tmpCoinTotal) * 100
  }

  const calculateEstimatePayment = (value, tmpCoinTotal, tmpAmount) => {
    return tmpAmount * (calculatePercOwnership(value, tmpCoinTotal) / 100)
  }

  const handleExecute = async () => {
    let tmpHodlers = null
    let daoData = null
    let creatorCoinData = null
    let creatorCoinBalance = 0
    let profile = null
    let functionToCall = null

    if (!handleValidateAmount()) {
      return
    }

    setLoading(true)
    setIsExecuting(true)

    // Reset Statuses
    switch (transactionType) {
      case Enums.values.NFT:
        tmpHodlers = nftOwners.map((owner) => {
          return {
            ...owner,
            status: Enums.values.EMPTY_STRING
          }
        })

        setNftOwners(tmpHodlers)
        break
      default:
        tmpHodlers = hodlers.map((tmpHodler) => {
          return {
            ...tmpHodler,
            status: Enums.values.EMPTY_STRING
          }
        })

        setHodlers(tmpHodlers)
    }

    if (transactionType === Enums.values.DAO) {
      functionToCall = payDaoHodler
    } else {
      functionToCall = payCeatorHodler
    }

    handleExecuteExtended(0, tmpHodlers, functionToCall, async (err) => {
      if (err) return message.error(err.message)

      profile = await getSingleProfile(desoState.profile.Profile.PublicKeyBase58Check)
      daoData = await getDaoBalance(desoState.profile.Profile.PublicKeyBase58Check)
      creatorCoinData = await getHodlers(desoState.profile.Profile.Username, false)

      creatorCoinData.Hodlers.map((entry) => {
        if (entry.HODLerPublicKeyBase58Check === desoState.profile.Profile.PublicKeyBase58Check) {
          creatorCoinBalance = entry.BalanceNanos
        }

        return null
      })

      dispatch({ type: AgiliteReactEnums.reducers.SET_PROFILE_DESO, payload: profile })
      dispatch({
        type: AgiliteReactEnums.reducers.SET_DESO_DATA,
        payload: { desoPrice: daoData.desoPrice, daoBalance: daoData.daoBalance, creatorCoinBalance }
      })

      setLoading(false)
      setIsExecuting(false)
    })
  }

  const handleExecuteExtended = (index, updatedHolders, functionToCall, callback) => {
    let publicKey = null
    let estimatedPayment = null
    let status = Enums.values.EMPTY_STRING

    updatedHolders = updatedHolders.map((tmpHodler, tmpIndex) => {
      if (
        tmpIndex === index &&
        selectedRowKeys.includes(
          transactionType !== Enums.values.NFT ? tmpHodler.ProfileEntryResponse.Username : tmpHodler.username
        )
      ) {
        if (transactionType === Enums.values.NFT) {
          publicKey = tmpHodler.key
        } else {
          publicKey = tmpHodler.HODLerPublicKeyBase58Check
        }

        estimatedPayment = tmpHodler.estimatedPayment

        return {
          ...tmpHodler,
          status: 'Processing...'
        }
      } else {
        return tmpHodler
      }
    })

    if (transactionType === Enums.values.NFT) {
      setNftOwners(updatedHolders)
    } else {
      setHodlers(updatedHolders)
    }

    if (estimatedPayment) {
      functionToCall(desoState.profile.Profile.PublicKeyBase58Check, publicKey, estimatedPayment, paymentType)
        .then(() => {
          status = 'Paid'
        })
        .catch((e) => {
          status = 'Error: ' + (e.message || e)
        })
        .finally(() => {
          updatedHolders = updatedHolders.map((tmpHodler, tmpIndex) => {
            if (
              tmpIndex === index &&
              selectedRowKeys.includes(
                transactionType !== Enums.values.NFT ? tmpHodler.ProfileEntryResponse.Username : tmpHodler.username
              )
            ) {
              return {
                ...tmpHodler,
                status
              }
            } else {
              return tmpHodler
            }
          })

          if (transactionType === Enums.values.NFT) {
            setNftOwners(updatedHolders)
          } else {
            setHodlers(updatedHolders)
          }
          index++

          if (index < updatedHolders.length) {
            handleExecuteExtended(index, updatedHolders, functionToCall, callback)
          } else {
            callback()
          }
        })
    } else {
      index++

      if (index < updatedHolders.length) {
        handleExecuteExtended(index, updatedHolders, functionToCall, callback)
      } else {
        callback()
      }
    }
  }

  const generatePaymentTypeTitle = () => {
    switch (paymentType) {
      case Enums.values.EMPTY_STRING:
        return 'Payment'
      case Enums.values.DESO:
        return 'Payment ($DESO)'
      case Enums.values.DAO:
        return 'Payment (DAO)'
      case Enums.values.CREATOR:
        return 'Payment (Creator Coin)'
      default:
        break
    }
  }

  const generatePaymentTypeFieldTitle = () => {
    switch (paymentType) {
      case Enums.values.EMPTY_STRING:
        return ''
      case Enums.values.DESO:
        return '$DESO'
      case Enums.values.DAO:
        return 'DAO'
      case Enums.values.CREATOR:
        return 'Creator Coin'
      default:
        break
    }
  }

  const getBalanceMain = () => {
    switch (paymentType) {
      case Enums.values.DESO:
        return handleGetDesoBalance()
      case Enums.values.DAO:
        return handleGetDaoBalance()
      case Enums.values.CREATOR:
        return handleGetCreatorCoinBalance()
      default:
        break
    }
  }

  const handleGetDesoBalance = () => {
    return (
      <>
        <span style={{ fontSize: 15 }}>
          <b>DeSo Balance: </b>
        </span>
        {(desoState?.profile?.Profile?.DESOBalanceNanos / Enums.values.NANO_VALUE).toFixed(2) +
          ' (~$' +
          Math.floor((desoState?.profile?.Profile?.DESOBalanceNanos / Enums.values.NANO_VALUE) * desoState.desoPrice) +
          ') - $' +
          desoState.desoPrice +
          ' Per $DESO'}
      </>
    )
  }

  const handleGetDaoBalance = () => {
    return (
      <>
        <span style={{ fontSize: 15 }}>
          <b>DAO Balance: {desoState.daoBalance}</b>
        </span>
      </>
    )
  }

  const handleGetCreatorCoinBalance = () => {
    return (
      <>
        <span style={{ fontSize: 15 }}>
          <b>Creator Coin Balance: {desoState.creatorCoinBalance / Enums.values.NANO_VALUE}</b>
        </span>
      </>
    )
  }

  const handleGetNFT = async (url, amountValue) => {
    const urlArray = url.split('/')
    let hex = null
    let response = null
    let nftEntries = null
    let tmpNftOwners = []
    let tmpIndex = null
    let baseValue = null
    let ownerEntryCount = 0

    setValidationMessage('')
    setNft(null)

    if (!url) return

    setLoading(true)
    setIsExecuting(true)

    urlArray.find((value) => {
      if (value.length === 64) {
        return (hex = value.substring(0, 64))
      }

      return null
    })

    if (!hex) {
      urlArray.find((value, index) => {
        if (value === 'posts') {
          hex = urlArray[index + 1].substring(0, 64)
        }

        return null
      })
    }

    if (!hex) {
      urlArray.find((value, index) => {
        if (value === 'nft') {
          hex = urlArray[index + 1].substring(0, 64)
        }

        return null
      })
    }

    try {
      response = await getNFTdetails(hex)
      nftEntries = await getNFTEntries(hex)
      setNft(response)

      if (
        desoState.profile.Profile.PublicKeyBase58Check !==
        response.NFTCollectionResponse.ProfileEntryResponse?.PublicKeyBase58Check
      ) {
        setValidationMessage(Enums.messages.NOT_NFT_CREATOR)
      } else {
        for (const entry of nftEntries.NFTEntryResponses) {
          const user = await getUserStateless(entry.OwnerPublicKeyBase58Check)

          // Exclude logged in User's NFT entries
          if (entry.OwnerPublicKeyBase58Check !== desoState.profile.Profile.PublicKeyBase58Check) {
            ownerEntryCount++

            tmpIndex = tmpNftOwners.findIndex((entry) => entry.username === user.Profile.Username)

            if (tmpIndex > -1) {
              tmpNftOwners[tmpIndex].owned++
            } else {
              tmpNftOwners.push({
                ...entry,
                key: user.Profile.PublicKeyBase58Check,
                owned: 1,
                status: '',
                username: user.Profile.Username,
                estimatedPayment: 0
              })
            }
          }
        }

        // Set base value of estimated payment
        baseValue = amountValue / ownerEntryCount

        // Map through NFT owners and calculate estimated payment
        tmpNftOwners.map((owner) => {
          return (owner.estimatedPayment = baseValue * owner.owned)
        })

        setNftOwners(tmpNftOwners)
        setSelectedRows(tmpNftOwners)
        setSelectedRowKeys(tmpNftOwners.map((entry) => entry.username))
      }
    } catch (e) {
      console.log(e)
      message.error('Please validate NFT URL')
    }

    setLoading(false)
    setIsExecuting(false)
  }

  const validateExecution = () => {
    switch (transactionType) {
      case Enums.values.NFT:
        if (nftUrl && nftOwners.length > 0) {
          return false
        } else {
          return true
        }
      case Enums.values.DAO:
      case Enums.values.CREATOR:
        if (hodlers.length > 0) {
          return false
        } else {
          return true
        }
      default:
        return true
    }
  }

  const calculateCoinTotal = (records) => {
    let tmpCoinTotal = 0
    let noOfCoins = 0

    records.map((entry) => {
      if (transactionType === Enums.values.DAO) {
        noOfCoins = entry.BalanceNanosUint256
        noOfCoins = hexToInt(noOfCoins)
        noOfCoins = noOfCoins / Enums.values.NANO_VALUE / Enums.values.NANO_VALUE
      } else {
        noOfCoins = entry.BalanceNanos
        noOfCoins = noOfCoins / Enums.values.NANO_VALUE
      }

      tmpCoinTotal += noOfCoins

      return null
    })

    return tmpCoinTotal
  }

  const calculateNFTPaymentEstimates = (selectedKeys, selectedRecords) => {
    const tmpNftOwners = nftOwners.concat()
    let baseValue = 0
    let ownerEntryCount = 0

    selectedRecords.map((owner) => {
      ownerEntryCount += owner.owned

      return null
    })

    baseValue = amount / ownerEntryCount

    // Map through NFT owners and calculate estimated payment
    tmpNftOwners.map((owner) => {
      if (selectedKeys.includes(owner.username)) {
        return (owner.estimatedPayment = baseValue * owner.owned)
      } else {
        return (owner.estimatedPayment = 0)
      }
    })

    setNftOwners(tmpNftOwners)
    setSelectedRows(selectedRecords)
    setSelectedRowKeys(selectedKeys)
  }

  const handleSelectionChange = (selectedKeys, selectedRecords) => {
    const tmpCoinTotal = calculateCoinTotal(selectedRecords)

    setSelectedRows(selectedRecords)
    setSelectedRowKeys(selectedKeys)

    if (transactionType !== Enums.values.NFT) {
      updateHolderAmounts(hodlers.concat(), tmpCoinTotal, parseFloat(amount), selectedKeys, originalCoinTotal)
    } else {
      calculateNFTPaymentEstimates(selectedKeys, selectedRecords)
    }
  }

  // eslint-disable-next-line
  Number.prototype.countDecimals = function () {
    if (Math.floor(this.valueOf()) === this.valueOf()) return 0
    return this.toString().split('.')[1].length || 0
  }

  return (
    <Row justify='center'>
      <Col xs={24} sm={22} md={20} lg={18} xl={16}>
        <Card type='inner' title={generateActions()} style={{ marginTop: 20, padding: '16px 5px' }}>
          <Row justify='center'>
            <Col style={{ cursor: 'auto', marginLeft: 10 }}>{getBalanceMain()}</Col>
          </Row>
          <Row justify='space-around'>
            <Col xs={16} md={12} lg={10} xl={8}>
              <center>
                <span style={{ fontSize: 15 }}>
                  <p style={{ color: theme.twitterBootstrap.primary }}>Step 3</p>
                  <b>Amount To Pay</b>
                </span>
              </center>
              <Input
                addonBefore={generatePaymentTypeFieldTitle()}
                disabled={transactionType && paymentType && !isExecuting ? false : true}
                placeholder='Amount'
                value={amount}
                onChange={(e) => {
                  setAmount(e.target.value)
                }}
              />
            </Col>
            {transactionType === Enums.values.NFT ? (
              <Col xs={16} md={12} lg={10} xl={8}>
                <center>
                  <span style={{ fontSize: 15 }}>
                    <p style={{ color: theme.twitterBootstrap.primary }}>Step 4</p>
                    <b>Link To NFT</b>
                  </span>
                </center>
                <Input.TextArea
                  disabled={transactionType && paymentType && !isExecuting ? false : true}
                  placeholder='NFT URL'
                  value={nftUrl}
                  onChange={(e) => {
                    setNftUrl(e.target.value)
                    handleGetNFT(e.target.value, amount)
                  }}
                  rows={3}
                />
                <span style={{ color: theme.twitterBootstrap.danger }}>{validationMessage}</span>
              </Col>
            ) : null}
          </Row>
          {nft ? (
            <Row justify='center' align='middle' style={{ marginTop: 20, marginBottom: 20 }}>
              {nft.NFTCollectionResponse.PostEntryResponse.ImageURLs.length > 0 ? (
                <Col>
                  <img
                    style={{ width: 300 }}
                    alt='nft_image'
                    src={nft.NFTCollectionResponse.PostEntryResponse.ImageURLs[0]}
                  />
                </Col>
              ) : null}
              <Col style={{ marginLeft: 20 }}>
                <center>{nft.NFTCollectionResponse.PostEntryResponse.Body}</center>
              </Col>
            </Row>
          ) : null}
          {transactionType ? (
            <>
              <Row style={{ marginTop: 20 }} justify='center'>
                <Col xs={24} md={4} lg={8} style={{ textAlign: 'center' }}>
                  <Popconfirm
                    title={`Are you sure you want to execute payments to the below ${
                      transactionType === Enums.values.NFT ? 'NFT Owners?' : 'Coin Holders?'
                    }`}
                    okText='Yes'
                    cancelText='No'
                    onConfirm={handleExecute}
                    disabled={
                      isExecuting ||
                      validationMessage ||
                      !transactionType ||
                      !paymentType ||
                      !amount ||
                      validateExecution()
                    }
                  >
                    <p style={{ color: theme.twitterBootstrap.primary }}>
                      Step {transactionType !== Enums.values.NFT ? '4' : '5'}
                    </p>
                    <Button
                      disabled={
                        isExecuting ||
                        validationMessage ||
                        !transactionType ||
                        !paymentType ||
                        !amount ||
                        validateExecution()
                      }
                      style={{ color: theme.white, backgroundColor: theme.twitterBootstrap.success }}
                    >
                      Execute Payment
                    </Button>
                  </Popconfirm>
                </Col>
              </Row>
            </>
          ) : null}
          {transactionType !== Enums.values.NFT ? (
            <Table
              rowKey={(hodler) => hodler.ProfileEntryResponse.Username}
              rowSelection={{
                selectedRowKeys,
                onChange: (selectedKeys, selectedRecords) => handleSelectionChange(selectedKeys, selectedRecords)
              }}
              dataSource={hodlers}
              loading={loading}
              style={{ marginTop: 20, marginLeft: 0 }}
              columns={[
                { title: 'User', dataIndex: ['ProfileEntryResponse', 'Username'], key: 'username' },
                {
                  title: 'Coins',
                  dataIndex: 'noOfCoins',
                  key: 'noOfCoins'
                },
                {
                  title: '% Ownership',
                  dataIndex: 'percentOwnership',
                  key: 'percentOwnership'
                },
                {
                  title: generatePaymentTypeTitle(),
                  dataIndex: 'estimatedPayment',
                  key: 'estimatedPayment',
                  render: (value) => {
                    return (
                      <span style={{ color: theme.twitterBootstrap.primary }}>
                        {value}{' '}
                        {paymentType === Enums.values.DESO ? `(~$${(value * desoState.desoPrice).toFixed(2)})` : null}
                      </span>
                    )
                  }
                },
                {
                  title: 'Status',
                  dataIndex: 'status',
                  key: 'status',
                  render: (value) => {
                    if (value === 'Paid') {
                      return <CheckCircleOutlined style={{ fontSize: 20, color: theme.twitterBootstrap.success }} />
                    } else if (value.indexOf('Error:') > -1) {
                      return (
                        <Popover content={<p>{value}</p>} title='DeSo Error'>
                          <CloseCircleOutlined style={{ fontSize: 20, color: theme.twitterBootstrap.danger }} />
                        </Popover>
                      )
                    } else {
                      return <span style={{ color: theme.twitterBootstrap.info }}>{value}</span>
                    }
                  }
                }
              ]}
              pagination={false}
            />
          ) : (
            <Table
              rowKey={(nftOwner) => nftOwner.username}
              rowSelection={{
                selectedRowKeys,
                onChange: (selectedKeys, selectedRecords) => handleSelectionChange(selectedKeys, selectedRecords)
              }}
              dataSource={nftOwners}
              loading={loading}
              style={{ marginTop: 20, marginLeft: 0 }}
              columns={[
                {
                  title: 'Username',
                  dataIndex: 'username',
                  key: 'username'
                },
                {
                  title: '# Owned',
                  dataIndex: 'owned',
                  key: 'owned'
                },
                {
                  title: generatePaymentTypeTitle(),
                  dataIndex: 'estimatedPayment',
                  key: 'estimatedPayment',
                  render: (value) => {
                    return (
                      <span style={{ color: theme.twitterBootstrap.primary }}>
                        {value}{' '}
                        {paymentType === Enums.values.DESO ? `(~$${(value * desoState.desoPrice).toFixed(2)})` : null}
                      </span>
                    )
                  }
                },
                {
                  title: 'Status',
                  dataIndex: 'status',
                  key: 'status',
                  render: (value) => {
                    if (value === 'Paid') {
                      return <CheckCircleOutlined style={{ fontSize: 20, color: theme.twitterBootstrap.success }} />
                    } else if (value.indexOf('Error:') > -1) {
                      return (
                        <Popover content={<p>{value}</p>} title='DeSo Error'>
                          <CloseCircleOutlined style={{ fontSize: 20, color: theme.twitterBootstrap.danger }} />
                        </Popover>
                      )
                    } else {
                      return <span style={{ color: theme.twitterBootstrap.info }}>{value}</span>
                    }
                  }
                }
              ]}
              pagination={false}
            />
          )}
        </Card>
      </Col>
    </Row>
  )
}

const BatchTransactionsForm = memo(_BatchTransactionsForm)

export default BatchTransactionsForm
