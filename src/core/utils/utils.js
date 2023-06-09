import Agilite from 'agilite'
import Store from '../../store'
import CoreReducer from './reducer'
import { batch } from 'react-redux'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChevronLeft, faExclamationCircle } from '@fortawesome/free-solid-svg-icons'
import { Button, Modal } from 'antd'
import { BrowserView, MobileView, deviceDetect } from 'react-device-detect'
import { generateContent } from '../../setup'
import { handleError } from '../../custom/lib/utils'

const agilite = new Agilite({
  apiServerUrl: process.env.REACT_APP_AGILITE_API_URL,
  apiKey: process.env.REACT_APP_AGILITE_API_KEY
})

export const getPrevTab = (token, notSaved, handleSubmit, submitLoading, setSubmitLoading, showModal, setShowModal) => {
  const agiliteUser = Store.getState().auth.agiliteUser
  const breadcrumbState = Store.getState().core.breadcrumbs
  const tabNavigationState = Store.getState().core.tabNavigation
  let tmpBreadcrumbState = breadcrumbState.concat()
  let currentTabIndex = tmpBreadcrumbState.findIndex((tab) => tab.key === tabNavigationState.activeKey)
  let title = null
  let prevKey = null
  let tmpIndex = null

  tmpIndex = currentTabIndex - 1

  if (tmpBreadcrumbState.length === 1 || tmpBreadcrumbState.length === 0) {
    // Pop just won't run if there is nothing to pop
    tmpBreadcrumbState.pop()

    prevKey = tabNavigationState.rootTabKey
    title = tabNavigationState.rootTabTitle
  } else {
    tmpBreadcrumbState.splice(currentTabIndex, 1)

    if (tmpIndex < 0) {
      prevKey = tabNavigationState.rootTabKey
      title = tabNavigationState.rootTabTitle
    } else {
      prevKey = tmpBreadcrumbState[tmpIndex].key
      title = tmpBreadcrumbState[tmpIndex].label
    }
  }

  const checkTabExists = () => {
    const tmpIndex = tabNavigationState.tabs.findIndex((tab) => tab.key === prevKey)

    if (tmpIndex < 0) {
      Store.dispatch(CoreReducer.actions.addTab(generateContent(prevKey)))
    } else {
      Store.dispatch(CoreReducer.actions.changeTab(prevKey))
    }
  }

  const _closeTab = () => {
    return CoreReducer.actions.closeTab({ targetKey: tabNavigationState.activeKey, newTabKey: prevKey })
  }

  return (
    <>
      {(agiliteUser &&
        agiliteUser.extraData.role.type !== 'admin' &&
        agiliteUser.extraData.role.type !== 'reception') ||
      deviceDetect().isMobile ? (
        <>
          {notSaved ? (
            <>
              <Modal
                title={
                  <>
                    <FontAwesomeIcon color={token.colorWarning} icon={faExclamationCircle} /> Warning
                  </>
                }
                onCancel={() => {
                  setShowModal(false)
                }}
                open={showModal}
                footer={[
                  <Button
                    onClick={() => {
                      setShowModal(false)
                    }}
                    type='primary'
                  >
                    Cancel
                  </Button>,
                  <Button
                    onClick={() => {
                      checkTabExists()
                      batch(() => {
                        Store.dispatch(CoreReducer.actions.setBreadcrumbs(tmpBreadcrumbState))
                        Store.dispatch(_closeTab())
                      })
                    }}
                    style={{ background: token.colorError, color: token.colorWhite }}
                  >
                    Discard Changes
                  </Button>
                ]}
              >
                <p>You have unsaved changes. What would you like to do?</p>
              </Modal>
              <Button
                onClick={() => {
                  setShowModal(true)
                }}
                type='primary'
                style={{
                  cursor: 'pointer',
                  float: 'left',
                  backgroundColor: token.colorSecondaryLight,
                  color: token.colorTextBase
                }}
              >
                <MobileView>
                  <FontAwesomeIcon icon={faChevronLeft} />
                </MobileView>
                <BrowserView>
                  <FontAwesomeIcon icon={faChevronLeft} style={{ marginRight: 10 }} />
                  {title}
                </BrowserView>
              </Button>
            </>
          ) : (
            <Button
              onClick={() => {
                checkTabExists()
                batch(() => {
                  Store.dispatch(CoreReducer.actions.setBreadcrumbs(tmpBreadcrumbState))
                  Store.dispatch(_closeTab())
                })
              }}
              type='primary'
              style={{
                cursor: 'pointer',
                float: 'left',
                backgroundColor: token.colorSecondaryLight,
                color: token.colorTextBase
              }}
            >
              <MobileView>
                <FontAwesomeIcon icon={faChevronLeft} />
              </MobileView>
              <BrowserView>
                <FontAwesomeIcon icon={faChevronLeft} style={{ marginRight: 10 }} />
                {title}
              </BrowserView>
            </Button>
          )}
        </>
      ) : undefined}
    </>
  )
}

export const addBreadCrumb = (key, label) => {
  const breadcrumbState = Store.getState().core.breadcrumbs
  let tmpBreadcrumbState = breadcrumbState.concat()

  tmpBreadcrumbState.push({ key, label })

  Store.dispatch(CoreReducer.actions.setBreadcrumbs(tmpBreadcrumbState))
}

export const readRoles = () => {
  return new Promise((resolve, reject) => {
    ;(async () => {
      try {
        let response = null

        response = await agilite.Keywords.getValuesByProfileKey('roles')
        resolve(response.data)
      } catch (e) {
        reject(handleError(e, true))
      }
    })()
  })
}

export const readProfessions = () => {
  return new Promise((resolve, reject) => {
    ;(async () => {
      try {
        let response = null

        response = await agilite.Keywords.getValuesByProfileKey('professions')
        resolve(response.data)
      } catch (e) {
        reject(handleError(e, true))
      }
    })()
  })
}
