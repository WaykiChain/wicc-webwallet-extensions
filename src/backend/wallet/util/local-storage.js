const storage = chrome.storage.local

export default {
  get (key) {
    return new Promise((resolve, reject) => {
      storage.get([key], (result) => {
        let string = result[key]
        if (string) {
          try {
            resolve(JSON.parse(string))
          } catch (error) {
            console.log('storage get error:', key, error)
            reject(error)
          }
        } else {
          resolve(null)
        }
      })
    })
  },

  set (key, object) {
    return new Promise((resolve) => {
      storage.set({
        [key]: JSON.stringify(object)
      }, function () {
        resolve()
      })
    })
  }
}
