import * as bitcore from 'bitcore-lib'

export const getAddressNetwork = function (address) {
  let network
  if (address[0] === 'w') {
    network = 'testnet'
  } else if (address[0] === 'W') {
    network = 'mainnet'
  }
  return network
}

export const getPrivateKeyNetwork = function (string) {
  const privateKey = bitcore.PrivateKey.fromWIF(string)
  const address = privateKey.toAddress().toString()
  return getAddressNetwork(address)
}

export const getSendTokenContract = function (address, amount) {
  function numberToCode (amount, length) {
    let patch = '00000000000000000000000000'
    const arr = []
    let tempStr = amount.toString(16)
    tempStr = tempStr.length % 2 === 0 ? tempStr : '0' + tempStr

    for (let i = 0; i < tempStr.length; i += 2) {
      arr.push(tempStr.substr(i, 2))
    }
    let result = arr.reverse().join('')
    result += patch.substr(0, length - result.length)
    return result
  }

  function charToCode (address) {
    let result = ''
    address.split('').map(item => {
      result += item.charCodeAt().toString(16)
    })
    return result
  }

  const magicNum = 'f0'
  const method = '16'
  const reserveBytes = '0000'
  return magicNum + method + reserveBytes + charToCode(address) + numberToCode(amount, 16)
}
