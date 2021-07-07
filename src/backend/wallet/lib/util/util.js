'use strict';

import _ from 'lodash';
import buffer from 'buffer';
import assert from 'assert';
import Decimal from 'decimal'

import js from './js';
import $ from './preconditions';
import BN from '../crypto/bn'
import errors from '../errors';
import BetItem from './betitem'
import VoteFund from './votefund'
import BufferWriter from '../encoding/bufferwriter';

export default {

    writeVarInt: function writeVarInt(n, value) {
        $.checkArgumentType(n, 'number', 'n')
        $.checkArgumentType(value, 'number', 'value');

        var bufLen = parseInt((n * 8 + 6) / 7)
        var len = 0

        var tmpbuf = Buffer.alloc(bufLen)

        while (true) {
            tmpbuf[len] = (value & 0x7F) | (len ? 0x80 : 0x00)
            if (value <= 0x7F)
                break
            value = parseInt(value / 128) - 1;
            len++
        }

        var buf = Buffer.alloc(len + 1)
        var i = 0;
        do {

            buf[i] = tmpbuf[len]
            i++

        } while (len--)

        return buf
    },

    checkNumber: function checkNumber(theObj) {
        var reg = /^[0-9]*$/;
        if (reg.test(theObj)) {
            return true;
        }
        return false;
    },

    isSimpleRegIdStr: function isSimpleRegIdStr(srcRegID) {
        var len = srcRegID.length
        if (len < 3)
            return false
        var arr = srcRegID.split('-')
        var size = arr.length

        if (size != 2)
            return false

        var strHeight = arr[0]
        if (strHeight.length > 10 || strHeight.length == 0)
            return false

        if (!this.checkNumber(strHeight))
            return false

        var strIndex = arr[1]
        if (strIndex.length > 10 || strIndex.length == 0)
            return false

        if (!this.checkNumber(strIndex))
            return false

        var REGID = {
            height: parseInt(strHeight),
            index: parseInt(strIndex)
        }

        return REGID

    },

    splitRegID: function splitRegID(srcRegID) {
        return this.isSimpleRegIdStr(srcRegID)
    },

    getSpcContractData: function getSpcContractData(address, spc) {
        $.checkArgumentType(address, 'string', 'address');
        $.checkArgumentType(spc, 'number', 'spc');

        var writer = new BufferWriter();
        writer.writeUInt8(0xf0)
        writer.writeUInt8(0x07)

        var addrBuf = new buffer.Buffer(address, 'utf8');
        writer.write(addrBuf)

        var bnSpc = BN.fromNumber(spc)

        writer.writeUInt64LEBN(bnSpc)

        return writer.toBuffer()

    },

    getBetContractData: function getBetContractData(lid, address, ltype, betList) {
        $.checkArgumentType(lid, 'string', 'lid');
        $.checkArgumentType(address, 'string', 'address');
        $.checkArgumentType(ltype, 'number', 'ltype');
        $.checkArgumentType(betList, 'object', 'betList');

        if (!betList instanceof Array) {
            throw new errors.InvalidArgumentType(betList, 'array', 'betList');
        }

        var writer = new BufferWriter();
        writer.writeUInt8(0xf0)
        writer.writeUInt8(0x02)

        var lidBuf = new buffer.Buffer(lid, 'utf8')
        writer.write(lidBuf)

        var addrBuf = new buffer.Buffer(address, 'utf8')
        writer.write(addrBuf)

        writer.writeUInt8(ltype)

        var len = betList.length
        writer.writeUInt32LE(len)
        for (var i = 0; i < len; i++) {
            var betItem = betList[i]

            if (!betItem instanceof BetItem) {
                throw new errors.InvalidArgumentType(betItem, 'BetItem', 'betItem');
            }

            writer.writeUInt8(betItem.playType)
            writer.writeUInt8(betItem.betType)
            writer.writeUInt32LE(betItem.times)

            var bnMoney = BN.fromNumber(betItem.money)

            writer.writeUInt64LEBN(bnMoney)
        }

        return writer.toBuffer()
    },

    getDelegateData: function getDelegateData(delegateList) {
        $.checkArgumentType(delegateList, 'object', 'delegateList');

        if (!delegateList instanceof Array) {
            throw new errors.InvalidArgumentType(delegateList, 'array', 'delegateList');
        }

        var writer = new BufferWriter();
        var len = delegateList.length
        writer.writeVarintNum(len)
        for (var i = 0; i < len; i++) {
            var votefund = delegateList[i]
            if (!votefund instanceof VoteFund) {
                throw new errors.InvalidArgumentType(votefund, 'VoteFund', 'votefund');
            }

            writer.writeUInt8(votefund.operType)

            var pubkeyBuf = new Buffer(votefund.pubkey, 'hex')
            var publen = pubkeyBuf.length
            writer.writeVarintNum(publen)
            writer.write(pubkeyBuf);

            var valueBuf = this.writeVarInt(8, votefund.value)
            writer.write(valueBuf)
        }

        return writer.toBuffer();
    },

    safeAdd: function safeAdd(a, b) {
        return new Decimal(a).add(new Decimal(b)).toNumber()
    },

    safeSub: function safeSub(a, b) {
        return new Decimal(a).sub(new Decimal(b)).toNumber()
    },

    safeMul: function safeMul(a, b) {
        return new Decimal(a).mul(new Decimal(b)).toNumber()
    },

    safeDiv: function safeDiv(a, b) {
        return new Decimal(a).div(new Decimal(b)).toNumber()
    },

    // check format for the regId
    checkRegId: function checkRegId(regId) {
        var regIdData = this.splitRegID(regId)
        if (_.isNull(regIdData.height) || _.isUndefined(regIdData.height))
            return false
        return true
    },


    isSpaceChar: function isSpaceChar(char) {
        return char.match(/\s/)
    },

    isHexChar: function isHexChar(char) {
        return char.match(/[0-9A-Fa-f]/)
    },

    hexToBytes: function hexToBytes(hexStr) {
        assert(_.isString(hexStr))

        var bytes = [];
        var curChar = "";
        var leftChar = ""

        for (var pos = 0; pos < hexStr.length; pos++) {
            curChar = hexStr.charAt(pos);
            if (this.isSpaceChar(curChar)) {
                continue;
            }
            if (!this.isHexChar(hexStr)) {
                // invalid hex char
                return null;
            }
            if (leftChar == "") {
                leftChar = curChar;
            }
            else {
                bytes.push(parseInt(leftChar + curChar, 16));
                leftChar = "";
            }
        }
        if (leftChar != "") {
            return null;
        }
        return bytes;
    }
};