'use strict';

import _ from 'lodash';
import $ from '../util/preconditions';

var BetItem = function BetItem(arg) {
  if (!(this instanceof BetItem)) {
    return new BetItem(arg);
  }
  var info = BetItem._from(arg);
  this.playType = info.playType;
  this.betType = info.betType;
  this.times = info.times;
  this.money = info.money;

  return this;
};

BetItem._from = function _from(arg) {
  var info = {};
  if (_.isObject(arg)) {
    info = BetItem._fromObject(arg);
  } else {
    throw new TypeError('Unrecognized argument for BetItem');
  }
  return info;
};

BetItem._fromObject = function _fromObject(data) {
  $.checkArgument(data, 'data is required');

  var info = {
    playType: data.playType,
    betType: data.betType,
    times: data.times,
    money: data.money
  };
  return info;
};

export default BetItem;