export default {
  common: {
    confirm: 'Confirm',
    cancel: 'Cancel',
    activeAccount: 'Activate',
    copySuccess: 'Copy success',
    passwordError: 'The password entered are incorrect',
    passwordInConsistent: 'The passwords entered twice are inconsistent, please check',
    insufficientBalance: 'Insufficient balance',
    accountNotActivated: 'Please activate you wallet first',
    fast: 'Fast',
    slow: 'Slow',
    minerFee: 'Fee',
    accountLabel: 'Account',
    copyAddress: 'Copy Address',
    unknownError: 'Unknown Error',
    warning: 'Warning',
    loading: 'Loading...'
  },

  splash: {
    passwordPlaceholder: 'Please input password',
    unlockButton: 'Unlock',
    restoreWalletButton: 'Recover wallet with mnemonic',
    createWalletButton: 'Create Wallet',
    importWalletButton: 'Import Wallet'
  },

  account: {
    import: {
      title: 'Import Account',
      typeLabel: 'Type',
      mnemonicType: 'Mnemonic',
      privateKeyType: 'Private Key',
      mnemonicLabel: 'Mnemonic',
      mnemonicPlaceholder: 'Place input mnemonic',
      privateKeyLabel: 'Private Key',
      privateKeyPlaceholder: 'Please input private key',
      confirmLoading: 'Importing...',
      importSuccess: 'Import Success',
      importFailure: 'Import Failure'
    },
    header: {
      network: 'Network',
      defaultNetwork: 'Default network is main network',
      logout: 'Logout',
      viewMnemonic: 'View Mnemonic',
      exportPrivateKey: 'Export Private Key',
      createAccount: 'Create Account',
      importAccount: 'Import Account',
      about: 'Info',
      setting: 'Setting',
      mainnet: 'WICC MainNet',
      testnet: 'WICC TestNet'
    },
    addToken: {
      title: 'Add token',
      regIdLabel: 'Contract RegID',
      regIdPlaceholder: 'Please input contract RegID',
      nameLabel: 'Token name',
      namePlaceholder: 'Please input token name',
      precisionLabel: 'Token precision',
      precisionPlaceholder: 'Please input token precision',
      confirmLoading: 'Adding...',
      addSuccess: 'Add token success',
      addFailure: 'Add token failed'
    },
    sendToken: {
      title: 'Send',
      fromLabel: 'From',
      destLabel: 'To',
      destPlaceHolder: 'Recipient Address',
      valueLabel: 'Amount',
      valuePlaceHolder: 'Please input send amount',
      descLabel: 'Comment（Optional）',
      confirmButton: 'Confirm Send',
      confirmLoading: 'Submitting...',
      sendSuccess: 'Submit send success',
      sendFailure: 'Submit send failed'
    },
    send: {
      title: 'Send',
      fromLabel: 'From',
      destLabel: 'To',
      destPlaceHolder: 'Recipient Address',
      valueLabel: 'Amount',
      valuePlaceHolder: 'Please input send amount',
      descLabel: 'Comment（Optional）',
      addressInvalid: 'Please input the correct WICC mainnet address, ',
      testnetAddressInvalid: 'Please input the correct WICC testnet address',
      confirmButton: 'Confirm Send',
      confirmLoading: 'Submitting...',
      sendSuccess: 'Submit send success',
      sendFailure: 'Submit send failed'
    },
    main: {
      tokenList: 'Token List',
      removeToken: 'Hide Token',
      removeTokenSuccess: 'Hide success',
      removeTokenFailed: 'Hide failed',
      sendButton: 'Send',
      receiveButton: 'Receive',
      addTokenButton: 'Add Token'
    },
    dialog: {
      passwordTitle: 'Please input password',
      passwordPlaceHolder: 'Please input password',
      viewMnemonicTitle: 'View mnemonic',
      viewMnemonicTip: 'Having a mnemonic is equivalent to owning an asset, so be sure to keep it in a safe place.',
      downloadMnemonicButton: 'Download',
      exportPkTitle: 'Export private key',
      exportPkTip: 'The private key is not encrypted and the risk of disclosure is extremely high. Please keep it in a safe place.',
      copyPkButton: 'Copy',
      registerTitle: 'Are you sure to activate the wallet? ',
      registerTip: 'Activating the wallet requires 0.0001 WICC, and the activation wallet uses the WICC in the wallet.',
      registerLoading: 'Activating...',
      registerSuccess: 'Activate Success',
      registerFailed: 'Activate Failed'
    },
    transDetail: {
      fromLabel: 'From',
      toLabel: 'To',
      feesLabel: 'Fee',
      hashLabel: 'Hash',
      commentLabel: 'Comment',
      txTypeLabel: 'Type',
      confirmedTimeLabel: 'Confirmed Time'
    },
    transHistory: {
      title: 'History',
      statusConfirmed: 'Completed',
      statusPending: 'Pending',
      emptyBlock: 'No History'
    }
  },

  wallet: {
    create: {
      password: {
        title: 'Set Password',
        tip: 'WaykiChain doesn\'t store your wallet password and can\'t help you get it back, so keep it in mind.',
        password: 'Password',
        passwordPlaceholder: 'Please input password',
        password2: 'Confirm Password',
        password2Placeholder: 'Please input password again',
        confirmButton: 'Create',
        importButton: 'Import'
      },
      backup: {
        title: 'Backup mnemonic',
        tip: 'Having a mnemonic is equivalent to owning an asset, so be sure to keep it in a safe place.',
        mnemonicLabel: 'Please copy the following mnemonic, we will verify it in the next step.',
        nextButton: 'Next',
        downloadButton: 'Download'
      },
      validate: {
        title: 'Verify Mnemonic',
        mnemonicLabel: 'Please click on the mnemonic in order to confirm that your backup is correct.',
        validateErrorTip: 'The mnemonic input is incorrect, please check!',
        confirmLoading: 'Creating...',
        createSuccess: 'Create Success',
        createFailure: 'Create Failed'
      }
    },
    import: {
      title: 'Import Wallet',
      tip: 'This action will overwrite all account info in wallet, please pay attention !',
      mnemonic: 'Mnemonic',
      mnemonicPlaceholder: 'Place input mnemonic',
      password: 'Password',
      passwordPlaceholder: 'Please input password',
      password2: 'Confirm Password',
      password2Placeholder: 'Please input password again',
      confirmLoading: 'Importing...',
      importSuccess: 'Import Success',
      importFailure: 'Import Failed'
    }
  },

  setting: {
    index: {
      title: 'Setting',
      language: 'Language',
      changePassword: 'Change Password',
      walletTitle: 'Reset Wallet',
      createWallet: 'Create Wallet',
      importWallet: 'Import Wallet'
    },
    about: {
      title: 'Info',
      name: 'WaykiMax',
      links: 'Links',
      homepage: 'WaykiChain Offical Website',
      devCenter: 'WaykiChain Developer Center'
    },
    password: {
      title: 'Change Password',
      currentPassword: 'Current password',
      currentPasswordPlaceholder: 'Please input current password',
      newPassword: 'New password',
      newPasswordPlaceholder: 'Please input new password',
      newPassword2: 'Confirm new password',
      newPassword2Placeholder: 'Please input new password again',
      confirmLoading: 'Loading...',
      changeSuccess: 'Change password success',
      changeFailure: 'Change password failed'
    }
  },

  window: {
    contract: {
      title: 'WICC Contract Create',
      addressLabel: 'Address:',
      contractRegIdLabel: 'Contract regid:',
      valueLabel: 'WICC amount:',
      contractLabel: 'Contract:',
      closeButton: 'Close',
      confirmButton: 'Confirm',
      confirmLoading: 'Loading...',
      createSuccess: 'Call contract success',
      createFailure: 'Call contract failed'
    },
    publishContract: {
      title: 'WICC Contract Publish',
      addressLabel: 'Address:',
      scriptLabel: 'Contract Script:',
      scriptDescLabel: 'Contract Description:',
      closeButton: 'Close',
      confirmButton: 'Confirm',
      confirmLoading: 'Loading...',
      createSuccess: 'Create contract success',
      createFailure: 'Create contract failed'
    },
    transfer: {
      title: 'WICC Transfer Confirm',
      fromLabel: 'From:',
      toLabel: 'To:',
      valueLabel: 'Amount:',
      closeButton: 'Close',
      confirmButton: 'Confirm',
      confirmLoading: 'Loading...',
      createSuccess: 'Submit success',
      createFailure: 'Submit failed'
    },
    vote: {
      title: 'WICC Node Vote',
      addressLabel: 'Address:',
      valueLabel: 'Vote Amount:',
      withdrawValueLabel: 'Withdraw Amount:',
      maxVoteLimit: 'The voted address count should not big than 11.',
      closeButton: 'Close',
      confirmButton: 'Confirm',
      confirmLoading: 'Loading...',
      createSuccess: 'Submit success',
      createFailure: 'Submit failed'
    }
  }
}
