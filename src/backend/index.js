import PageAPI from './page-api'
import WalletAPI from './wallet/index'

const CALLBACK_TAB_MAP = {}

const callPageCallback = (callbackId, error, data) => {
  const sender = CALLBACK_TAB_MAP[callbackId] || {}
  const { tabId, frameId } = sender
  return new Promise((resolve) => {
    console.log('[info] call page callback:', callbackId, error, data)

    chrome.tabs.sendMessage(tabId, {
      callbackId,
      error,
      data
    }, {
      frameId: frameId
    }, function () {
      resolve()
    })
  })
}

/**
 * handle message from page or popup
 * @param message
 * @param sender
 * @param sendResponse
 * @returns {*}
 */
const handleMessage = function (message, sender, sendResponse) {
  const sendErrorData = (error) => {
    sendResponse({
      status: 'error',
      error
    })
  }

  const sendSuccessData = (data, status) => {
    sendResponse({
      status: 'success' || status,
      data
    })
  }

  if (!message || typeof message !== 'object') {
    return sendErrorData({
      message: 'message is not allow empty.'
    })
  } else if (!message.from || !message.action) {
    return sendErrorData({
      message: 'message format is invalid.'
    })
  }

  const {
    from,
    action,
    data = {}
  } = message

  if (from === 'page') {
    const callbackId = data.callbackId

    if (callbackId && sender.tab) {
      CALLBACK_TAB_MAP[callbackId] = {
        tabId: sender.tab.id,
        frameId: sender.frameId
      }
    }

    PageAPI.handleMessage(action, data).then((data) => {
      sendSuccessData(data)
    }, (error) => {
      sendErrorData({
        message: error ? error.message : ''
      })
    })
  } else if (from === 'popup') {
    const extensionId = chrome.runtime.id
    if (sender.id !== extensionId) {
      return sendErrorData({
        message: 'message.from is invalid'
      })
    }

    if (action === 'callPageCallback' && data.callbackId) {
      return callPageCallback(data.callbackId, data.error, data.data)
    }

    WalletAPI.handleMessage(action, data).then((data) => {
      sendSuccessData(data)
    }, (error) => {
      sendErrorData({
        message: error ? error.message : ''
      })
    })
  } else {
    sendErrorData({
      message: 'unknown message source'
    })
  }

  return true
}

chrome.runtime.onConnect.addListener(function (port) {
  port.onMessage.addListener(handleMessage)
})

chrome.runtime.onMessage.addListener(handleMessage)
