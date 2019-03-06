import localStorage from './util/local-storage'
const ObservableStore = require('obs-store')

export const CONFIG_STORAGE_KEY = 'wicc-wallet-config'

const store = new ObservableStore({
  isLocked: true,
  network: 'mainnet'
})

store.subscribe((state) => {
  localStorage.set(CONFIG_STORAGE_KEY, state).then(() => {
    console.log('app state save success')
  })
})

const initFromStorage = () => {
  localStorage.get(CONFIG_STORAGE_KEY).then((value) => {
    store.putState(value)
  })
}

initFromStorage()

export default store
