// This component loads an Ant Design Modal component.
// Using a TextArea component, the user can paste a DeSo NFT URL Link.
// Once pasted, logic will run to validate the URL and fetch the NFT data.
// If the URL is valid, the NFT Image and summary text will be displayed in the Modal.
// The user will be able to confirm the NFT is correct, of which a passed function will be called and the Modal will be closed.

import React, { useEffect, useReducer } from 'react'
// import PropTypes from 'prop-types'
import { Row, Modal, Col, Input, Spin, Image, Divider, message } from 'antd'
import { getNFTDetails } from '../../../lib/deso-controller'
import { desoNFTSearchModal } from './data-models'

const reducer = (state, newState) => ({ ...state, ...newState })

const DeSoNFTSearchModal = ({ isOpen, publicKey, rootState, onConfirmNFT, onCancelNFT }) => {
  const [state, setState] = useReducer(reducer, desoNFTSearchModal())

  // Create a useEffect hook to monitor the prop isOpen
  useEffect(() => {
    if (isOpen) {
      // Populate the state using Parent State
      setState({ nftUrl: rootState.nftUrl, nftMetaData: rootState.nftMetaData, nftHodlers: rootState.nftHodlers })
    } else {
      // Reset the state
      setState(desoNFTSearchModal())
    }
  }, [isOpen]) // eslint-disable-line react-hooks/exhaustive-deps

  // Create a function to process the pasted NFT URL
  const handleProcessNFTURL = async (e) => {
    const errMsgDefault = 'Invalid DeSo NFT URL. Please try again'

    // let nftDomain = null
    let nftRoute = null
    let nftId = null

    try {
      // The following are examples of valid DeSo NFT URLs:
      // - https://diamondapp.com/nft/{nftId}}
      // - https://diamondapp.com/posts/{nftId}}
      // - https://desocialworld.com/posts/{nftId}
      // - https://xxx.nftz.zone/nft/{nftId}
      // Remove anything after the ? including the ? in the url;
      const nftUrl = e.target.value.toLowerCase().split('?')[0]

      // If the value is empty, return
      if (!nftUrl) {
        setState({ nftMetaData: {}, nftHodlers: [], nftUrl })
        return
      }

      // Split the url so we can validate the domain is correct and return the NFT ID
      const urlSplit = nftUrl.toLowerCase().split('/')

      // After the split, there should be at least 5 items in the array
      if (urlSplit.length < 5) throw new Error(errMsgDefault)

      // Validate the domain is correct as a switch statement
      // nftDomain = urlSplit[2]
      nftRoute = urlSplit[3]
      nftId = urlSplit[4]

      // check if nftRoute = 'nft' or 'posts'
      if (!['nft', 'posts'].includes(nftRoute)) {
        throw new Error(errMsgDefault)
      }

      // If we get here, the NFT URL is valid and the ID was returned
      setState({ isExecuting: true, nftMetaData: {}, nftHodlers: [], nftUrl })
      const { nftMetaData, nftHodlers } = await getNFTDetails(nftId, publicKey)
      setState({ nftMetaData, nftHodlers, isExecuting: false })
    } catch (e) {
      setState({ isExecuting: false })
      message.error(errMsgDefault)
    }
  }

  const handleConfirmNFT = () => {
    // check if there is an NFT Id and that there are Hodlers
    if (!state.nftMetaData.id) {
      message.error('No valid NFT found. Please try again.')
      return
    } else if (!state.nftHodlers.length) {
      message.error('No Hodlers found for this NFT. Please revise.')
      return
    }

    // If we get here, we have a valid NFT and Hodlers
    onConfirmNFT(state.nftMetaData, state.nftHodlers, state.nftUrl)
  }

  return (
    <Modal
      title={'Search for DeSo NFT'}
      open={isOpen}
      onOk={handleConfirmNFT}
      onCancel={onCancelNFT}
      okText='Confirm'
      cancelText='Cancel'
      maskClosable={false}
      okButtonProps={{
        disabled: state.isExecuting
      }}
      cancelButtonProps={{
        disabled: state.isExecuting,
        style: { color: 'orange' }
      }}
    >
      <Row>
        <Col span={24}>
          <Input.TextArea
            disabled={state.isExecuting}
            placeholder='Paste the DeSo NFT URL Link here (Note: Links from Diamond App, DeSocialWorld, and Desofy are allowed).'
            value={state.nftUrl}
            onChange={handleProcessNFTURL}
            rows={3}
          />
          {state.isExecuting ? (
            <center style={{ marginTop: 5 }}>
              <Spin size='small' /> <span style={{ fontSize: 12 }}>Processing...</span>
            </center>
          ) : null}
        </Col>
      </Row>
      {state.nftMetaData.id ? (
        <>
          <Divider style={{ margin: '5px 0', borderBlockStart: 0 }} />
          <Row>
            <Col xs={24} md={12}>
              <center>
                <p>{state.nftMetaData.description}</p>
              </center>
            </Col>
            <Col xs={24} md={12}>
              <center>
                <Image src={state.nftMetaData.imageUrl} height={200} />
              </center>
            </Col>
          </Row>
        </>
      ) : null}
    </Modal>
  )
}

export default DeSoNFTSearchModal

// TODO: Add Prop Types for this component
// DeSoNFTSearchModal.propTypes = {
//   tip: PropTypes.string
// }
