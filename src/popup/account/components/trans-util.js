import fecha from 'fecha'
import { getLanguage } from '../../locale'
import fixed from '../../api/fixed'

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
  'confirmed': 'Completed',
  'failed': 'Failed'
}

export default {
  formatType (type) {
    const lang = getLanguage()
    if (lang && lang.indexOf('zh') !== -1) {
      return TYPE_MAP[type] || type
    } else {
      return TYPE_MAP_EN[type] || type
    }
  },

  formatStatus (trans) {
    const lang = getLanguage()
    let status
    if (trans.confirmedHeight) {
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

  formatTime (time) {
    if (!time) return ''
    const date = new Date(time)
    return fecha.format(date, 'YYYY/MM/DD  HH:mm:ss')
  },

  formatAmount (amount, precision = 2) {
    return amount ? fixed(amount * Math.pow(10, -8), precision) : '0'
  },

  formatFees (fees) {
    return fees * Math.pow(10, -8)
  }
}
