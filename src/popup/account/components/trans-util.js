import fecha from 'fecha'
import { getLanguage } from '../../locale'
import fixed from '../../api/fixed'

const TYPE_NEWTX_MAP = {
  'UNIVERSAL_TX': "通用交易",
  'DEX_TRADE_SETTLE_TX': 'DEX撮合',
  'DEX_CANCEL_ORDER_TX': 'DEX取消挂单',
  'DEX_MARKET_SELL_ORDER_TX': 'DEX市价卖单',
  'DEX_MARKET_BUY_ORDER_TX': 'DEX市价买单',
  'DEX_LIMIT_SELL_ORDER_TX': 'DEX限价卖单',
  'DEX_LIMIT_BUY_ORDER_TX': 'DEX限价买单',
  'PRICE_MEDIAN_TX': '喂价中位数交易',
  'PRICE_FEED_TX': '喂价',
  'FCOIN_STAKE_TX': '抵押交易',
  'UCOIN_TRANSFER_TX': '转账',
  'CDP_LIQUIDATE_TX': 'CDP清算',
  'CDP_REDEEM_TX': 'CDP赎回',
  'CDP_STAKE_TX': 'CDP创建',
  'DELEGATE_VOTE_TX': '投票交易',
  'LCONTRACT_INVOKE_TX': '合约调用',
  'LCONTRACT_DEPLOY_TX': '合约发布',
  'BCOIN_TRANSFER_TX': 'WICC交易',
  'ACCOUNT_REGISTER_TX': '账户激活',
  'UCOIN_REWARD_TX': '初始化交易（WICC WGRT）',
  'UCOIN_BLOCK_REWARD_TX': '矿工奖励(新版)',
  'BLOCK_REWARD_TX': '矿工奖励',
  'ASSET_UPDATE_TX': '资产更新',
  'ASSET_ISSUE_TX': '资产发布',
  'UCONTRACT_INVOKE_TX': '多币种合约调用',
  '1': '付款',
  '2': '收款'
}

const TYPE_NEWTX_MAP_EN = {
  'UNIVERSAL_TX': "Universal Tx",
  'DEX_TRADE_SETTLE_TX': 'Settle Txn',
  'DEX_CANCEL_ORDER_TX': 'Cancel Order Txn',
  'DEX_MARKET_SELL_ORDER_TX': 'Market Sell Order',
  'DEX_MARKET_BUY_ORDER_TX': 'Market Buy Order',
  'DEX_LIMIT_SELL_ORDER_TX': 'Limit Sell Order',
  'DEX_LIMIT_BUY_ORDER_TX': 'Limit Buy Order',
  'PRICE_MEDIAN_TX': 'Median Txn',
  'PRICE_FEED_TX': 'Feed Txn',
  'FCOIN_STAKE_TX': 'Stakecoin Txn',
  'UCOIN_TRANSFER_TX': 'Transfer',
  'CDP_LIQUIDATE_TX': 'CDP-Liquidate',
  'CDP_REDEEM_TX': 'CDP-Redeem',
  'CDP_STAKE_TX': 'CDP-First Stake',
  'DELEGATE_VOTE_TX': 'Vote Txn',
  'LCONTRACT_INVOKE_TX': 'Invoke Contract',
  'LCONTRACT_DEPLOY_TX': 'Publish Contract',
  'BCOIN_TRANSFER_TX': 'WICC Transfer',
  'ACCOUNT_REGISTER_TX': 'Register',
  'UCOIN_REWARD_TX': 'Init Transfer（WICC WGRT）',
  'UCOIN_BLOCK_REWARD_TX': 'Reward Txn',
  'BLOCK_REWARD_TX': 'Reward',
  'ASSET_UPDATE_TX': 'Asset update',
  'ASSET_ISSUE_TX': 'Asset release',
  'UCONTRACT_INVOKE_TX': 'Contract Invoke',
  '1': 'Send',
  '2': 'Collect'
}

const TYPE_MAP = {
  1: '挖矿',
  2: '账号激活',
  3: '普通转账',
  4: '合约转账',
  5: '合约发布',
  6: '投票'
}

const TYPE_MAP_EN = {
  1: 'Mining',
  2: 'Account Activation',
  3: 'Normal Transfer',
  4: 'Contract Transfer',
  5: 'Contract Publish',
  6: 'Vote'
}

const STATUS_MAP = {
  'pending': '确认中',
  'confirmed': '已完成',
  'failed': '失败'
}

const STATUS_MAP_EN = {
  'pending': 'Pending',
  'confirmed': 'Successful',
  'failed': 'Failed'
}

export default {
  formatNewTxType(type) {
    const lang = getLanguage()
    if (lang && lang.indexOf('zh') !== -1) {
      return TYPE_NEWTX_MAP[type] || "其他"
    } else {
      return TYPE_NEWTX_MAP_EN[type] || "Other"
    }
  },
  formatType(type) {
    const lang = getLanguage()
    if (lang && lang.indexOf('zh') !== -1) {
      return TYPE_MAP[type] || type
    } else {
      return TYPE_MAP_EN[type] || type
    }
  },

  formatStatus(trans) {
    const lang = getLanguage()
    let status
    if (trans.confirmedheight) {
      status = 'confirmed'
    } else if (trans.failed) {
      status = 'failed'
    } else {
      status = 'pending'
    }
    if (lang && lang.indexOf('zh') !== -1) {
      return STATUS_MAP[status]
    } else {
      return STATUS_MAP_EN[status]
    }
  },
  /**
   * 省略中间字符
   */
  cutMiddleStr(str, saveNum) {
    if (str.length > 24) {
      return str.substr(0, saveNum) + '...' + str.substring(str.length, str.length - saveNum)
    }
    return str
  },
  formatTime(time) {
    if (!time) return ''
    const date = new Date(time)
    return fecha.format(date, 'YYYY-MM-DD  HH:mm:ss')
  },

  formatAmount(amount, precision = 4) {
    return amount ? fixed(amount * Math.pow(10, -8), precision) : '0'
  },

  formatFees(fees) {
    return fees * Math.pow(10, -8)
  }
}
