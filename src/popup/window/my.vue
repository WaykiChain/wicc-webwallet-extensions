<template>
  <div class="myTest">
    测试界面
    <p>{{urlQuery}}</p>
    <div>
      <button @click="click">抵押wicc测试</button>
      <p>
        nValidHeight
        <input type="text" name="height" id v-model="height" />
      </p>
      <p>
        txUid
        <input type="text" name="height" id v-model="txuid" />
      </p>
      <p>
        fees
        <input type="text" name="height" id v-model="fees" />
      </p>
      <p>
        cdpTxId
        <input type="text" name="height" id v-model="cdpTxid" />
      </p>
      <p>
        bcoinsToStake（抵押WICC）
        <input type="text" name="height" id v-model="bcoinsToStake" />
      </p>
      <p>
        scoinsToMint（WUSD）
        <input type="text" name="height" id v-model="scoinsToMint" />
      </p>
      <p class="hex">签名：{{resMsg}}</p>
    </div>
    <div class="liquid">
      <button @click="clickLiquid">清算测试</button>
      <p>
        nValidHeight
        <input type="text" name="height" id v-model="height" />
      </p>
      <p>
        txUid
        <input type="text" name="height" id v-model="txuid" />
      </p>
      <p>
        fees
        <input type="text" name="height" id v-model="fees" />
      </p>
      <p>
        cdpTxId
        <input type="text" name="height" id v-model="cdpTxid" />
      </p>
      <p>
        scoinsToLiquidate(清算的WUSD)
        <input type="text" name="height" id v-model="scoinsToLiquidate" />
      </p>
      <p class="hex">签名：{{resMsgLiquid}}</p>
    </div>

    <div class="liquid">
      <button @click="clickRedeem">赎回测试</button>
      <p>
        nValidHeight
        <input type="text" name="height" id v-model="height" />
      </p>
      <p>
        txUid
        <input type="text" name="height" id v-model="txuid" />
      </p>
      <p>
        fees
        <input type="text" name="height" id v-model="fees" />
      </p>
      <p>
        cdpTxId
        <input type="text" name="height" id v-model="cdpTxid" />
      </p>
      <p>
        scoins_to_repay(销毁的数量wusd)
        <input type="text" name="height" id v-model="scoins_to_repay" />
      </p>
      <p>
        bcoins_to_redeem(赎回的数量wicc)
        <input type="text" name="height" id v-model="bcoins_to_redeem" />
      </p>
      <p class="hex">签名：{{resMsgRedeem}}</p>
    </div>


  </div>
</template>
<script>
import API from "../api";
import WindowMixin from "./mixin";
import axios from "axios";
export default {
  mixins: [WindowMixin],
  data() {
    return {
      urlQuery:"",
      resMsg: "",
      resMsgLiquid:"",
      resMsgRedeem:"",
      height: 23594,
      txuid: "0-1",
      fees: "0.001",
      cdpTxid:
        "009c0e665acdd9e8ae754f9a51337b85bb8996980a93d6175b61edccd3cdc144",
      bcoinsToStake: "200",
      scoinsToMint: "300",
      scoinsToLiquidate:"300",
      bcoins_to_redeem:"200",
      scoins_to_repay:"100",

    };
  },
  created(){
    const query = this.$router.currentRoute.query;
    this.urlQuery = query
  },
  methods: {
    click() {
      let param = {
        nValidHeight: this.height,
        txUid: this.txuid,
        fees: parseFloat(this.fees) * Math.pow(10, 8),
        cdpTxId: this.cdpTxid,
        bcoinsToStake: parseFloat(this.bcoinsToStake) * Math.pow(10, 8),
        scoinsToMint: parseFloat(this.scoinsToMint) * Math.pow(10, 8)
      };
      API.callRaw("cdpStake", { info: param }).then(res => {
        this.resMsg = res;
      });
    },
    clickLiquid(){
      let param = {
        nValidHeight: this.height,
        txUid: this.txuid,
        fees: parseFloat(this.fees) * Math.pow(10, 8),
        cdpTxId: this.cdpTxid,
        scoinsToLiquidate: parseFloat(this.scoinsToLiquidate) * Math.pow(10, 8),
      };
      API.callRaw("cdpLiquid", { info: param }).then(res => {
        this.resMsgLiquid = res;
      });
    },
    clickRedeem(){
      
      let param = {
        nValidHeight: this.height,
        txUid: this.txuid,
        fees: parseFloat(this.fees) * Math.pow(10, 8),
        cdpTxId: this.cdpTxid,
        scoins_to_repay: parseFloat(this.scoins_to_repay) * Math.pow(10, 8),
        bcoins_to_redeem: parseFloat(this.bcoins_to_redeem) * Math.pow(10, 8),
      };
      API.callRaw("cdpRedeem", { info: param }).then(res => {
        this.resMsgRedeem = res;
      });
    }
  }
};
</script>
<style lang="scss" scoped>
.myTest {
  background: #eeeeee;
  height: 100%;
  p {
    margin-bottom: 0;
  }
  input {
    width: 100%;
  }
}
.liquid{
  border-top: red 5px solid;
  background: #eeeeee;
}
.hex {
  width: 100%;
  height: 200px;
  word-break: break-all;
  background: #eeeeee;
}
</style>

