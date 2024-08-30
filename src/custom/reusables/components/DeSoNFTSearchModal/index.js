// This component loads an Ant Design Modal component.
// Using a TextArea component, the user can paste a DeSo NFT URL Link.
// Once pasted, logic will run to validate the URL and fetch the NFT data.
// If the URL is valid, the NFT Image and summary text will be displayed in the Modal.
// The user will be able to confirm the NFT is correct, of which a passed function will be called and the Modal will be closed.

import React, { useEffect, useReducer } from 'react'
// import PropTypes from 'prop-types'
import { Row, Modal, Col, Input, Spin, Image, Divider, message, Checkbox, Card } from 'antd'
import { processNFTPost } from '../../../lib/deso-controller-graphql'
import { desoNFTSearchModal } from './data-models'
import { useApolloClient } from '@apollo/client'
import { GET_NFT_POST, GET_POLL_POST } from '../../../lib/graphql-models'

const reducer = (state, newState) => ({ ...state, ...newState })

const DeSoNFTSearchModal = ({ isOpen, publicKey, rootState, deviceType, onConfirmNFT, onCancelNFT }) => {
  const [state, setState] = useReducer(reducer, desoNFTSearchModal())
  const client = useApolloClient()

  // Create a useEffect hook to monitor the prop isOpen
  useEffect(() => {
    if (isOpen) {
      // Populate the state using Parent State
      setState({
        nftUrl: rootState.nftUrl,
        nftMetaData: rootState.nftMetaData,
        nftHodlers: rootState.nftHodlers,
        pollMetaData: rootState.pollMetaData,
        pollOptions: rootState.pollOptions
      })
    } else {
      // Reset the state
      setState(desoNFTSearchModal())
    }
  }, [isOpen]) // eslint-disable-line react-hooks/exhaustive-deps

  // Create a function to process the pasted NFT URL
  const handleProcessNFTURL = async (e) => {
    const errMsgDefault = rootState.isPoll
      ? 'Invalid DeSo Poll URL. Please try again'
      : 'Invalid DeSo NFT URL. Please try again'

    // let nftDomain = null
    let nftRoute = null
    let postHash = null
    let nftPost = null
    let gqlProps = null

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
      postHash = urlSplit[4]

      // check if nftRoute = 'nft' or 'posts'
      if (!['nft', 'posts'].includes(nftRoute)) {
        throw new Error(errMsgDefault)
      }

      // If we get here, the NFT URL is valid and the ID was returned
      setState({ isExecuting: true, nftMetaData: {}, nftHodlers: [], nftUrl })

      if (rootState.isPoll) {
        // !POLL
        gqlProps = {
          condition: {
            associationType: 'POLL_RESPONSE',
            postHash
          },
          postHash
        }

        nftPost = await client.query({ query: GET_POLL_POST, variables: gqlProps, fetchPolicy: 'no-cache' })

        // Check if a valid Poll was returned
        if (nftPost.data.postAssociations.totalCount === 0) throw new Error(errMsgDefault)
        if (nftPost.data.postAssociations.nodes.length < 1) throw new Error(errMsgDefault)
      } else {
        // !NFT
        gqlProps = {
          postHash
        }

        nftPost = await client.query({ query: GET_NFT_POST, variables: gqlProps, fetchPolicy: 'no-cache' })

        // Check if a valid NFT was returned
        if (!nftPost.data.post) throw new Error(errMsgDefault)
        if (!nftPost.data.post.isNft) throw new Error(errMsgDefault)
      }

      nftPost = nftPost.data.post
      const nftMetaData = await processNFTPost(nftPost, postHash, rootState.isPoll)

      setState({ nftMetaData, isExecuting: false })

      if (rootState.isPoll) {
        setState({ pollOptions: JSON.parse(nftMetaData.extraData.PollOptions) })
      }
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
    }

    // If we get here, we have a valid NFT and Hodlers
    onConfirmNFT(state.nftMetaData, state.nftUrl, state.pollOptions)
  }

  return (
    <Modal
      title={`Link to ${rootState.isPoll ? ' DeSo Poll' : ' DeSo NFT'}`}
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
            placeholder={`Paste the DeSo ${
              rootState.isPoll ? 'Poll' : 'NFT'
            } URL Link here (Note: Links from Diamond App, DeSocialWorld, Desofy, and NFTz are allowed).`}
            value={state.nftUrl}
            onChange={handleProcessNFTURL}
            rows={deviceType.isSmartphone ? 5 : 3}
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
          {rootState.isPoll ? (
            <Card
              style={{ marginTop: 10 }}
              bodyStyle={{ padding: 5 }}
              size='small'
              type='inner'
              title={<div style={{ fontSize: 13 }}>Select the Poll Options to retrieve Users for</div>}
            >
              <Row>
                <Col span={24}>
                  <Checkbox.Group onChange={(value) => setState({ pollOptions: value })} value={state.pollOptions}>
                    {JSON.parse(state.nftMetaData.extraData.PollOptions).map((option, index) => {
                      return (
                        <div style={{ width: '100%', marginBottom: 10 }}>
                          <Checkbox key={index} value={option} /> <span style={{ fontSize: 13 }}>{option}</span>
                        </div>
                      )
                    })}
                  </Checkbox.Group>
                </Col>
              </Row>
            </Card>
          ) : undefined}
        </>
      ) : null}
    </Modal>
  )
}

export default DeSoNFTSearchModal
