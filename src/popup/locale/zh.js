export default {
  common: {
    confirm: '确定',
    cancel: '取消',
    activeAccount: '激活',
    copySuccess: '复制成功',
    fast: '快',
    slow: '慢',
    minerFee: '矿工费',
    accountLabel: '账号',
    copyAddress: '复制地址',
    unknownError: '发生错误',
    warning: '警告',
    loading: '加载中...'
  },

  errors: {
    passwordError: '密码错误',
    passwordInConsistent: '两次输入的密码不一致，请检查',
    insufficientBalance: '余额不足',
    amountLessThanLimit: '转账金额不能小于 0.0001',
    accountNotActivated: '请先激活钱包',
    accountAlreadyExists: '账号已经存在',
    passwordInvalid: '当前密码输入错误',
    inActivating: '激活中，请等待'
  },

  splash: {
    passwordPlaceholder: '请输入密码',
    unlockButton: '登录',
    restoreWalletButton: '使用助记词恢复钱包',
    createWalletButton: '创建钱包',
    importWalletButton: '导入钱包'
  },

  account: {
    import: {
      title: '导入账号',
      typeLabel: '导入类型',
      mnemonicType: '助记词',
      privateKeyType: '私钥',
      mnemonicLabel: '助记词',
      mnemonicPlaceholder: '请输入助记词',
      privateKeyLabel: '私钥',
      privateKeyPlaceholder: '请输入私钥',
      confirmLoading: '导入中...',
      importSuccess: '导入成功',
      importFailure: '导入失败'
    },
    header: {
      network: '网络',
      defaultNetwork: '默认维基链交易网络为主网',
      logout: '退出登录',
      viewMnemonic: '查看助记词',
      exportPrivateKey: '导出私钥',
      createAccount: '创建账号',
      importAccount: '导入账号',
      about: '信息',
      setting: '设置',
      mainnet: 'WICC 主网',
      testnet: 'WICC 测试网'
    },
    addToken: {
      title: '添加代币',
      regIdLabel: '合约 RegID',
      regIdPlaceholder: '请输入合约 RegID',
      nameLabel: '代币名称',
      namePlaceholder: '请输入代币名称',
      precisionLabel: '代币精度',
      precisionPlaceholder: '请输入代币精度',
      confirmLoading: '正在添加...',
      addSuccess: '添加成功',
      addFailure: '添加代币发生错误'
    },
    sendToken: {
      title: '转账',
      fromLabel: '付款地址',
      destLabel: '收款地址',
      destPlaceHolder: '请输入收款地址',
      valueLabel: '转账金额',
      limit: '可用额度：',
      valuePlaceHolder: '请输入转账金额',
      descLabel: '备注（选填）',
      confirmButton: '确认转账',
      confirmLoading: '提交中...',
      sendSuccess: '转账提交成功',
      sendFailure: '转账提交失败'
    },
    send: {
      title: '转账',
      fromLabel: '付款地址',
      destLabel: '收款地址',
      destPlaceHolder: '请输入收款地址',
      valueLabel: '转账金额',
      valuePlaceHolder: '请输入转账金额',
      descLabel: '备注（选填）',
      addressInvalid: '请输入正确的WICC主网地址',
      testnetAddressInvalid: '请输入正确的WICC测试网地址',
      confirmButton: '确认转账',
      confirmLoading: '提交中...',
      sendSuccess: '转账提交成功',
      sendFailure: '转账提交失败'
    },
    main: {
      tokenList: '代币列表',
      removeToken: '隐藏代币',
      removeTokenSuccess: '隐藏成功',
      removeTokenFailed: '隐藏失败',
      sendButton: '转账',
      receiveButton: '收款',
      addTokenButton: '添加代币',
      expect: '尽请期待'
    },
    dialog: {
      passwordTitle: '请输入钱包密码',
      passwordPlaceHolder: '请输入密码',
      viewMnemonicTitle: '查看助记词',
      viewMnemonicTip: '拥有助记词相当于拥有资产，请一定妥善保管在安全的地方。',
      downloadMnemonicButton: '下载助记词',
      exportPkTitle: '导出私钥',
      exportPkTip: '私钥未经加密，泄露风险极大，请一定妥善保管在安全的地方。',
      copyPkButton: '复制',
      registerTitle: '是否确认激活钱包？',
      registerTip: '激活钱包需要消耗 0.0001 WICC，激活钱包使用的是钱包内的 WICC。',
      registerLoading: '正在激活...',
      registerSuccess: '激活成功',
      registerFailed: '激活失败'
    },
    transDetail: {
      fromLabel: '发款方',
      toLabel: '收款方',
      feesLabel: '矿工费用',
      hashLabel: '交易哈希',
      commentLabel: '备注',
      txTypeLabel: '交易类型',
      confirmedTimeLabel: '交易时间'
    },
    transHistory: {
      title: '历史交易',
      statusConfirmed: '已完成',
      statusPending: '确认中',
      emptyBlock: '没有历史交易'
    }
  },

  wallet: {
    create: {
      password: {
        title: '设置密码',
        tip: 'WaykiChain 不存储钱包密码，也无法帮您找回，请务必牢记。',
        password: '密码',
        passwordPlaceholder: '请输入6-20位字符',
        password2: '确认密码',
        password2Placeholder: '请重新输入密码',
        confirmButton: '创建钱包',
        importButton: '导入钱包'
      },
      backup: {
        title: '备份助记词',
        tip: '拥有助记词相当于拥有资产，请一定妥善保管在安全的地方。',
        mnemonicLabel: '请抄写下面的助记词，我们将在下一步进行验证',
        nextButton: '下一步',
        downloadButton: '下载到本地'
      },
      validate: {
        title: '验证助记词',
        tip: '拥有助记词相当于拥有资产，请一定妥善保管在安全的地方。',
        mnemonicLabel: '请按顺序点击助记词，以确认您备份正确',
        validateErrorTip: '助记词输入有误，请检查!',
        confirmLoading: '创建中...',
        createSuccess: '创建成功',
        createFailure: '创建失败'
      }
    },
    import: {
      title: '导入钱包',
      tip: '该操作将覆盖掉钱包内所有账号信息，请谨慎使用！',
      mnemonic: '助记词',
      mnemonicPlaceholder: '请输入助记词',
      password: '密码',
      passwordPlaceholder: '请输入密码',
      password2: '确认密码',
      password2Placeholder: '请重新输入密码',
      confirmLoading: '导入中...',
      importSuccess: '导入成功',
      importFailure: '导入失败'
    }
  },

  setting: {
    index: {
      title: '设置',
      language: '语言',
      changePassword: '修改密码',
      walletTitle: '重置钱包',
      createWallet: '创建钱包',
      importWallet: '导入钱包'
    },
    about: {
      title: '信息',
      name: 'WaykiMax',
      links: '链接',
      homepage: '维基链官网',
      devCenter: '开发者中心'
    },
    password: {
      title: '修改钱包密码',
      currentPassword: '当前密码',
      currentPasswordPlaceholder: '请输入当前密码',
      newPassword: '新密码',
      newPasswordPlaceholder: '请输入6-20位字符',
      newPassword2: '重复输入新密码',
      newPassword2Placeholder: '请重新输入新密码',
      confirmLoading: '正在修改密码...',
      changeSuccess: '修改密码成功',
      changeFailure: '修改密码失败'
    }
  },

  window: {
    contract: {
      title: 'WICC 合约调用',
      addressLabel: '调用地址:',
      contractRegIdLabel: '合约regid:',
      valueLabel: 'WICC数量:',
      contractLabel: '合约字段:',
      closeButton: '拒绝',
      confirmButton: '确定',
      confirmLoading: '正在调用...',
      createSuccess: '调用成功',
      createFailure: '调用失败'
    },
    publishContract: {
      title: 'WICC 合约发布',
      addressLabel: '调用地址:',
      scriptLabel: '合约内容:',
      scriptDescLabel: '合约描述:',
      closeButton: '拒绝',
      confirmButton: '确定',
      confirmLoading: '正在创建...',
      createSuccess: '创建成功',
      createFailure: '创建失败'
    },
    transfer: {
      title: 'WICC 转账确认',
      addressLabel: '付款地址:',
      destAddressLabel: '收款地址:',
      valueLabel: '数量:',
      closeButton: '拒绝',
      confirmButton: '确定',
      confirmLoading: '正在提交转账...',
      createSuccess: '提交成功',
      createFailure: '提交失败'
    },
    vote: {
      title: 'WICC 节点投票',
      addressLabel: '被投票地址:',
      valueLabel: '投票数量:',
      withdrawValueLabel: '撤票数量:',
      maxVoteLimit: '投票地址数量不能超过11个。',
      closeButton: '拒绝',
      confirmButton: '确定',
      confirmLoading: '正在调用...',
      createSuccess: '调用成功',
      createFailure: '调用失败'
    }
  }
}
