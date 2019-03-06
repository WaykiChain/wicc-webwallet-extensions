let state = {}

export default {
  init (tokensConfig) {
    if (!tokensConfig) {
      state = {}
    } else {
      state = tokensConfig
    }
  },

  get (accountId) {
    const tokens = state[accountId] || []

    return tokens.map((token, index) => {
      return {
        index,
        ...token
      }
    })
  },

  async remove (accountId, index) {
    const tokens = state[accountId] || []

    tokens.splice(index, 1)
  },

  async add (accountId, network, name, regId, precision) {
    let tokens = state[accountId]
    if (!tokens) {
      tokens = state[accountId] = []
    }

    for (let token of tokens) {
      if (token.network === network && (token.name === name || token.regId === regId)) {
        throw new Error('token already exists')
      }
    }

    tokens.push({
      name,
      regId,
      precision,
      network
    })

    return state
  }
}
