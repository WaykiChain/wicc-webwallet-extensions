const content = chrome.extension.getURL('js/content.js')
const script = document.createElement('script')
script.setAttribute('type', 'text/javascript')
script.setAttribute('src', content)
document.body.appendChild(script)

import PostMessageStream from 'post-message-stream'

const messageStream = new PostMessageStream({
  name: 'contentscript',
  target: 'inpage'
})

// Parse injected page message && send to background
messageStream.on('data', function (message) {
  const sendErrorData = (error) => {
    messageStream.write({
      status: 'error',
      error
    })
  }

  const sendSuccessData = (data, status) => {
    messageStream.write({
      status: 'success' || status,
      data
    })
  }

  const {
    from,
    action,
    data
  } = message

  if (from !== 'page') {
    sendErrorData({
      message: 'unknown message source'
    })

    return
  }

  chrome.runtime.sendMessage({
    from: 'page',
    action,
    data
  }, function (response) {
    response = response || {}
    if (response.status === 'error') {
      sendErrorData(response.error)
    } else {
      sendSuccessData(response.data)
    }
  })
})

// Parse background message and set back
chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
  // ignore message send from content script
  if (sender.tab) return

  message = message || {}
  const {
    error,
    data,
    callbackId
  } = message

  if (callbackId) {
    messageStream.write({
      callbackId,
      data,
      error
    })
  }

  sendResponse({
    message: 'success'
  })
})
