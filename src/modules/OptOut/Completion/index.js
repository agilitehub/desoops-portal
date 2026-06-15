import React, { useEffect, useReducer } from 'react'
import { Button, Card, Spin } from 'antd'

import { getUsernameForPublicKey } from 'deso-protocol'
import { desoLogout } from 'core/infra/deso-controller-graphql'
import Enums from 'core/infra/enums'

const HEADER_CLASS = {
  headerSuccess: 'text-lg font-bold leading-relaxed text-success sm:text-xl',
  headerConflict: 'text-lg font-bold leading-relaxed text-deso-orange sm:text-xl',
  headerError: 'text-lg font-bold leading-relaxed text-error sm:text-xl'
}

const reducer = (state, newState) => ({ ...state, ...newState })

const ERROR_STATUSES = ['NO_PUBLIC_KEY', 'PUBLIC_KEY_NOT_FOUND']

const Completion = ({ rootState, setRootState, handleOptIn, handleOptOut }) => {
  const [state, setState] = useReducer(reducer, {
    headerMessage: '',
    headerClass: '',
    extraContent: null,
    loggedInUsername: null,
    loading: !ERROR_STATUSES.includes(rootState.optOutStatus)
  })

  useEffect(() => {
    const getLoggedInUser = async () => {
      if (!rootState.identityState?.currentUser?.publicKey) {
        setState({ loading: false })
        return
      }

      try {
        setState({ loading: true })
        const username = await getUsernameForPublicKey(rootState.identityState.currentUser.publicKey)
        setState({ loggedInUsername: username, loading: false })
      } catch (e) {
        console.error(e)
        setState({ loading: false })
      }
    }

    getLoggedInUser()
    // eslint-disable-next-line
  }, [])

  useEffect(() => {
    const init = async () => {
      try {
        let headerMessage = null
        let headerClass = null
        let extraContent = null

        switch (rootState.optOutStatus) {
          case 'SUCCESS':
            headerClass = 'headerSuccess'
            headerMessage = (
              <div>
                As <b>@{state.loggedInUsername}</b>, you have successfully opted out of DeSoOps tagging for user{' '}
                <b>@{rootState.username}</b>.
              </div>
            )
            extraContent = (
              <div className='mt-6 flex flex-col items-center gap-3'>
                <Button type='primary' size='large' onClick={() => handleConfirm(true)} className='optout-success-btn'>
                  Opt Back In
                </Button>
                {renderSwitchAccount(false)}
              </div>
            )
            break
          case 'CONFLICT':
            headerClass = 'headerConflict'
            headerMessage = (
              <div>
                As <b>@{state.loggedInUsername}</b>, you have already opted out of DeSoOps tagging for user{' '}
                <b>@{rootState.username}</b>.
              </div>
            )
            extraContent = (
              <div className='mt-6 flex flex-col items-center gap-3'>
                <Button type='primary' size='large' onClick={() => handleConfirm(true)} className='optout-success-btn'>
                  Opt Back In
                </Button>
                {renderSwitchAccount(false)}
              </div>
            )
            break
          case 'NO_PUBLIC_KEY':
            headerClass = 'headerError'
            headerMessage = 'No public key was provided in the URL. Please review and try again.'
            break
          case 'PUBLIC_KEY_NOT_FOUND':
            headerClass = 'headerError'
            headerMessage =
              'The public key provided in the URL does not match any existing DeSo profiles. Please review and try again.'
            break
          case 'SUCCESS_OPT_IN':
            headerClass = 'headerSuccess'
            headerMessage = (
              <div>
                As <b>@{state.loggedInUsername}</b>, you have successfully opted into DeSoOps tagging for user{' '}
                <b>@{rootState.username}</b>.
              </div>
            )
            extraContent = (
              <div className='mt-6 flex flex-col items-center gap-3'>
                <Button type='primary' size='large' onClick={() => handleConfirm(false)} className='optout-danger-btn'>
                  Opt Out
                </Button>
                {renderSwitchAccount(false)}
              </div>
            )
            break
          case 'NO_ACTION':
            headerClass = 'headerSuccess'
            headerMessage = (
              <div>
                As <b>@{state.loggedInUsername}</b>, you are opted into DeSoOps tagging for user{' '}
                <b>@{rootState.username}</b>.
              </div>
            )
            extraContent = (
              <div className='mt-6 flex flex-col items-center gap-3'>
                <Button type='primary' size='large' onClick={() => handleConfirm(false)} className='optout-danger-btn'>
                  Opt Out
                </Button>
                {renderSwitchAccount(false)}
              </div>
            )
            break
          case 'CONFIRMATION':
            headerClass = 'headerConflict'
            headerMessage = (
              <div>
                <span className='block font-extrabold uppercase tracking-wide'>Confirmation</span>
                <span className='mt-3 block'>
                  As <b>@{state.loggedInUsername}</b>, are you sure you want to{' '}
                  {rootState.isOptIn ? 'opt into' : 'opt out of'} DeSoOps tagging for user <b>@{rootState.username}</b>?
                </span>
              </div>
            )
            extraContent = (
              <div className='mt-6 flex flex-col items-center gap-3'>
                <Button
                  type='primary'
                  size='large'
                  onClick={() => {
                    if (rootState.isOptIn) {
                      handleOptIn()
                    } else {
                      handleOptOut()
                    }
                  }}
                  className='login-cta-button !h-12 !px-8'
                >
                  Yes — {rootState.isOptIn ? 'Opt In' : 'Opt Out'}
                </Button>
                {renderSwitchAccount(true)}
              </div>
            )
            break
        }

        setState({ headerMessage, headerClass, extraContent })
      } catch (e) {
        console.error(e)
      }
    }

    if (ERROR_STATUSES.includes(rootState.optOutStatus) || state.loggedInUsername) {
      init()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rootState.optOutStatus, state.loggedInUsername])

  const renderSwitchAccount = (renderNo) => (
    <Button size='large' onClick={() => handleDesoLogout()} className='optout-secondary-btn'>
      {renderNo ? 'No — Switch Account' : 'Switch Account'}
    </Button>
  )

  const handleConfirm = async (optIn) => {
    setRootState({
      renderState: Enums.appRenderState.COMPLETION,
      optOutStatus: 'CONFIRMATION',
      isOptIn: optIn
    })
  }

  const handleDesoLogout = async () => {
    desoLogout()
  }

  if (state.loading) {
    return (
      <section aria-busy='true' aria-label='Loading opt-out status'>
        <Spin size='large' className='app-loading-spin [&_.ant-spin-dot]:scale-150' />
      </section>
    )
  }

  return (
    <Card className='dashboard-shell-card mx-auto max-w-2xl text-left [&_.ant-card-body]:text-center'>
      <p className={HEADER_CLASS[state.headerClass] || 'text-lg font-bold leading-relaxed text-foreground sm:text-xl'}>
        {state.headerMessage}
      </p>
      {state.extraContent}
    </Card>
  )
}

export default Completion
