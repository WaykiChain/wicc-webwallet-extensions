'use strict';

import _ from 'lodash';
import $ from '../util/preconditions';

var VoteFund = function VoteFund(arg) {
  if (!(this instanceof VoteFund)) {
    return new VoteFund(arg);
  }
  var info = VoteFund._from(arg);
  this.operType = info.operType;
  this.pubkey = info.pubkey;
  this.value = info.value;

  return this;
};

VoteFund._from = function _from(arg) {
  var info = {};
  if (_.isObject(arg)) {
    info = VoteFund._fromObject(arg);
  } else {
    throw new TypeError('Unrecognized argument for VoteFund');
  }
  return info;
};

VoteFund._fromObject = function _fromObject(data) {
  $.checkArgument(data, 'data is required');

  var info = {
    operType: data.operType,
    pubkey: data.pubkey,
    value: data.value
  };
  return info;
};

VoteFund.NULL_OPER = 0;
VoteFund.ADD_FUND = 1;
VoteFund.MINUS_FUND = 2;

export default VoteFund;