export default {
  common: {
    confirm: 'Confirm',
    cancel: 'Cancel',
    activeAccount: 'Register',
    copySuccess: 'Copied',
    fast: 'Fast',
    slow: 'Slow',
    minerFee: 'Fee',
    accountLabel: 'Account',
    copyAddress: 'Copy address',
    unknownError: 'Unknown error',
    warning: 'Warning',
    loading: 'Loading...',
    slogin: 'World-leading Blockchain Technology and Ecosystem. Built,Used and Shared with You. ',
    success: 'Successful',
    txDetail: 'Details'
  },

  errors: {
    passwordError: 'Password is incorrect.',
    passwordInConsistent: 'The two passwords were inconsistent.',
    insufficientBalance: 'Insufficient balance',
    amountLessThanLimit: 'The transferred amount should not less than 0.0001',
    accountNotActivated: 'Please register your wallet first',
    accountAlreadyExists: 'Account already exists',
    passwordInvalid: 'The enter current password is incorrect',
    inActivating: 'Registering, please wait'
  },

  splash: {
    passwordPlaceholder: 'Please enter 6~20 characters',
    unlockButton: 'Log in',
    restoreWalletButton: 'Recover your wallet with mnemonics',
    createWalletButton: 'Create Wallet',
    importWalletButton: 'Import Wallet'
  },

  account: {
    import: {
      title: 'Import Account',
      typeLabel: 'Select Type',
      mnemonicType: 'Mnemonics',
      privateKeyType: 'Private Key',
      mnemonicLabel: 'Mnemonics',
      mnemonicPlaceholder: 'Please enter mnemonics',
      privateKeyLabel: 'Private Key',
      privateKeyPlaceholder: 'Please enter private key',
      confirmLoading: 'Importing...',
      importSuccess: 'Successful',
      importFailure: 'Failed'
    },
    header: {
      network: 'Networks',
      defaultNetwork: 'The default network is MainNet',
      logout: 'Log Out',
      viewMnemonic: 'View mnemonics',
      exportPrivateKey: 'Export Private Key',
      createAccount: 'Create Account',
      importAccount: 'Import Account',
      about: 'Information',
      setting: 'Setting',
      mainnet: 'WICC MainNet',
      testnet: 'WICC TestNet',
      mine: 'My Accounts',
      detail: 'Account details',
      pwdTip: "Please enter your wallet password",
      keySave: 'Please save the private key properly',
      mSave: 'Please save the mnemonics properly'
    },
    addToken: {
      title: 'Add Token',
      regIdLabel: 'Contract RegID',
      regIdPlaceholder: 'Input contract RegID',
      nameLabel: 'Token name',
      namePlaceholder: 'Input token name',
      precisionLabel: 'Token precision',
      precisionPlaceholder: 'Input token precision',
      confirmLoading: 'Adding...',
      addSuccess: 'Token added',
      addFailure: 'Failed to add token'
    },
    sendToken: {
      title: 'Send',
      fromLabel: 'Payment Address',
      destLabel: 'Receive Address',
      destPlaceHolder: 'Please enter/paste receive address',
      valueLabel: 'Amount',
      limit: 'Balance：',
      valuePlaceHolder: 'Please enter transfer amount',
      descLabel: 'Memo（Optional）',
      confirmButton: 'Confirm',
      confirmLoading: 'Submitting...',
      sendSuccess: 'Successful',
      sendFailure: 'Failed'
    },
    send: {
      title: 'Send',
      fromLabel: 'Payment Address',
      destLabel: 'Receive Address',
      destPlaceHolder: 'Please enter/paste receive address',
      valueLabel: 'Amount',
      valuePlaceHolder: 'Please enter transfer amount',
      descLabel: 'Memo（Optional）',
      addressInvalid: 'Input WICC mainnet address, ',
      testnetAddressInvalid: 'Input WICC testnet address',
      confirmButton: 'Confirm',
      confirmLoading: 'Submitting...',
      sendSuccess: 'Successful',
      sendFailure: 'Failed'
    },
    main: {
      tokenList: 'Token List',
      removeToken: 'Hide token',
      removeTokenSuccess: 'Hide successful',
      removeTokenFailed: 'Failed to hide',
      sendButton: 'Send',
      receiveButton: 'Collect',
      addTokenButton: 'Add token',
      expect: 'Coming soon'
    },
    dialog: {
      passwordTitle: 'Enter Password',
      passwordPlaceHolder: 'Please enter 6~20 characters',
      viewMnemonicTitle: 'View mnemonics',
      viewMnemonicTip: 'Keeping mnemonics is equivalent to owning an asset, so be sure to keep it in a safe place.',
      downloadMnemonicButton: 'Download',
      copyMnemonicButton: 'Copy',
      exportPkTitle: 'Export private key',
      exportPkTip: 'The private key is not encrypted and the risk of disclosure is extremely high. Please keep it in a safe place.',
      copyPkButton: 'Copy',
      downloadPkButton: 'Download',
      registerTitle: 'Are you sure to activate the wallet? ',
      registerTip: 'Activating the wallet requires 0.0001 WICC, and the activation uses the WICC in the wallet.',
      registerLoading: 'Activating...',
      registerSuccess: 'Successful',
      registerFailed: 'Failed'
    },
    transDetail: {
      fromLabel: 'From',
      toLabel: 'To',
      feesLabel: 'Fee',
      hashLabel: 'Txn hash',
      cdpid: 'Created at',
      assetamount:'Asset amount',
      price:'Price',
      bcointoredeem:'Redeem amount',
      scoinstorepay:'Repay amount',
      coinsymbol:"Coin symbol",
      scoinstoliquidate:"Liquid amount",
      bcoinstostake:'Stake amount',
      scoinstomint:'Generate amount',
      confirmedheight:"Confirmed height",
      commentLabel: 'Memo',
      txTypeLabel: 'Type',
      confirmedTimeLabel: 'Confirmed time',
      assetSymbol:'Total',
      costWicc:'Cost',
    },
    transHistory: {
      title: 'History',
      statusConfirmed: 'Successful',
      statusPending: 'Pending...',
      emptyBlock: 'No records'
    }
  },

  wallet: {
    create: {
      read: 'I have read and agreed',
      terms: 'Services and Privacy Terms',
      creating: 'Creating',
      Switch: 'Switch ',
      Mnemonic: 'Mnemonic',
      CHINESE: 'Chinese ',
      English: 'English ',
      password: {
        title: 'Set Password',
        tip: 'WaykiChain doesn\'t store your wallet password and can\'t help you get it back, so keep it in mind.',
        password: 'Password',
        passwordPlaceholder: 'Please enter 6~20 characters',
        password2: 'Confirm Password',
        password2Placeholder: 'Please enter password again',
        confirmButton: 'Create Account',
        importButton: 'Import Account'
      },
      backup: {
        title: 'Backup Mnemonics',
        tip: 'Keeping mnemonics is equivalent to owning an asset, so be sure to keep it in a safe place.',
        mnemonicLabel: 'Mnemonic is used for recover Wallet password.Please accurately copy it and keep it properly.',
        nextButton: 'Next',
        downloadButton: 'Download'
      },
      validate: {
        title: 'Confirm',
        mnemonicLabel: 'Please click on the mnemonics in order to verify that if your backup is correct.',
        validateErrorTip: 'The mnemonics inputted are incorrect, please check!',
        confirmLoading: 'Creating...',
        createSuccess: 'Successful',
        createFailure: 'Failed'
      }
    },
    import: {
      title: 'Import Wallet',
      tip: 'This action will overwrite all account info in wallet, please use with caution!',
      mnemonic: 'Mnemonics',
      mnemonicPlaceholder: 'Enter mnemonics',
      password: 'Password',
      passwordPlaceholder: 'Please enter 6~20 characters',
      password2: 'Confirm Password',
      password2Placeholder: 'Please enter password again',
      confirmLoading: 'Importing...',
      importSuccess: 'Successful',
      importFailure: 'Failed',
      correctMnemonic: 'Please enter correct mnemonic'
    }
  },

  setting: {
    index: {
      title: 'Setting',
      language: 'Language',
      changePassword: 'Change Password',
      walletTitle: 'Reset Wallet',
      createWallet: 'Create Wallet',
      importWallet: 'Import Wallet',
      net:'Networks',
      edit:'Edit',
      done:'Done',
      name:'Network Name',
      rpc:'New Baas URL',
      addNet:'Add Network',
      Currency: 'Currency'
    },
    about: {
      title: 'Information',
      name: 'WaykiMax',
      links: 'Links',
      homepage: 'WaykiChain Offical Website',
      devCenter: 'WaykiChain Developer Portal'
    },
    password: {
      title: 'Change Password',
      currentPassword: 'Current password',
      currentPasswordPlaceholder: 'Enter current password',
      newPassword: 'New password',
      newPasswordPlaceholder: 'Please enter 6~20 characters',
      newPassword2: 'Confirm new password',
      newPassword2Placeholder: 'Enter new password again',
      confirmLoading: 'Loading...',
      changeSuccess: 'Successful',
      changeFailure: 'Failed'
    }
  },

  window: {
    contract: {
      title: 'Invoke Contract',
      addressLabel: 'Address',
      contractRegIdLabel: 'Contract RegID',
      valueLabel: 'Amount',
      contractLabel: 'Contract',
      closeButton: 'Cancel',
      confirmButton: 'Confirm',
      confirmLoading: 'Loading...',
      createSuccess: 'Successful',
      createFailure: 'Failed'
    },
    publishContract: {
      title: 'Publish Contract',
      addressLabel: 'Address',
      scriptLabel: 'Contract script',
      scriptDescLabel: 'Contract description',
      closeButton: 'Cancel',
      confirmButton: 'Confirm',
      confirmLoading: 'Loading...',
      createSuccess: 'Successful',
      createFailure: 'Failed'
    },
    transfer: {
      title: 'Send',
      fromLabel: 'From',
      toLabel: 'To',
      valueLabel: 'Amount',
      closeButton: 'Cancel',
      confirmButton: 'Confirm',
      confirmLoading: 'Loading...',
      createSuccess: 'Successful',
      createFailure: 'Failed',
      addressLabel: 'Payment address',
      destAddressLabel: 'Receive address'
    },
    vote: {
      title: 'Vote',
      addressLabel: 'Address',
      valueLabel: 'Vote amount',
      withdrawValueLabel: 'Withdrawal amount',
      maxVoteLimit: 'The number of voted addresses should not exceed 11.',
      closeButton: 'Cancek',
      confirmButton: 'Confirm',
      confirmLoading: 'Loading...',
      createSuccess: 'Successful',
      createFailure: 'Failed'
    },
    cdp:{
      xjmr:"DEX-Limit Buy Order",
      xjmc:"DEX-Limit Sell Order",
      sjmc:"DEX-Market Sell Order",
      sjmr:"DEX-Market Buy Order",
      slwicc:"Amount",
      jgwusd:"Price",
      hdslwusd:"Amount receive",
      slwusd:"Amount",
      hdslwicc:"Cost",
      dqscjg:"Price",
      yjhdwusd:"Amount receive",
      yjhdwicc:"Amount receive",
      sjcjwz:"Subject to actual tx",
      tipsmc:"Note:The system will sell at the highest market price.The final price is subject to the actual transaction.",
      tipsmr:"Note:The system will buy at the lowest market price.The final price is subject to the actual transaction.",
      qxjy:"Cancel",
      ddh:"Order",
      ddxq:"Details",
      lx:"Type",
      qx:"Cancel",
      qd:"Confirm",
      wdzc:"My assets",
      cdpcjjy:"CDP-First stake",
      cdpzjjy:"CDP-Further stake",
      cdpqsjy:"CDP-Liquidate",
      cdpshjy:"CDP-Redeem",
      cjcdpdz:"Created by：",
      dyl:"Stake amount",
      dcl:"Generate amount",
      gcdpCjjyid:"Created at",
      zjdyl:"Further stake amount",
      zjdcl:" Generate amount",
      qsrdz:"Address",
      qsl:"Liquidation amount",
      ghl:"Repay amount",
      shl:"Redemption amount",
      sjcjwz:'The actual transaction prevails',
      addtional:'CDP-Further stake',
      zzfbzc:'Creat',

      zzfbzc:'Releasing Asset...',
      updateAssets:'Updating Asset...',
      zzzjjy:'Further staking...',
      zzcjjy:'Generating...',
      zzqsjy:'Liquidating...',
      zzshjy:'Redemption...',
      dexjyz:'Generating...',
      zzqxjy:'Cancel...',
      zzyzqm:'Verifying signature...',
      hqzcz:'Loading...',
      noAssets:"You don't have any assets",
      ownerAddr: "Created by",
      creator: "Created by",
      成交量: "Executed",
      成交价: "Price",
      成交总额: "Total",
    },
    msgSign:{
      xxqm:'Authorization',
      zh:'Account',
      appName:'Apply to',
      msgDesc:'Get your wallet information',
      msgTitle:'What the information is',
    },
    assets:{
      zcfb:'Asset release',
      dbjc:'Token symbol',
      dbqc:'Token name',
      zfxl:'Total',
      dbcyz:'Owner',
      kfzf:'Modifiable',
      s:'Changeable',
      f:'Unchangeable',
      fwf:'Cost',
      zcgx:'Asset update',
      n:'New',
      owidError:"Owner account does not exist or is not activated",
    }
  }
}
