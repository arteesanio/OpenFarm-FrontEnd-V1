<template>
  <div class="flex-column n-flat pa-2 mb-2 border-r-15">
      <!-- <div v-if="isFarmStake(index)">
          Stake
      </div> -->
      <div class="flex-center">
        <div v-if="first_token" class="ma-1 mt-0 pa-1 pb-1 border-r-100p n-flat opacity-75" style="width: 30px; height: 30px">
          <img :src="first_token.image" :alt="first_token.id" style="max-width: 30px; max-height: 30px"
              class=" border-r-100p"
          />
        </div>
        <div class="flex-center mx-2">
          <span class="tx-sm opacity-hover-75">{{first_token.id}}</span>
          <span class="mx-1">/</span>
          <span class="tx-sm opacity-hover-75">{{second_token.id}}</span>
        </div>
        <div v-if="second_token" class="ma-1 mt-0 pa-1 pb-1 border-r-100p n-flat opacity-75" style="width: 30px; height: 30px">
          <img :src="second_token.image" :alt="second_token.id" style="max-width: 30px; max-height: 30px"
              class=" border-r-100p"
          />
        </div>
      </div>
      <div class="">
        <span class="tx-xs opacity-50">{{LANG.farmLevel}}:</span>
        <span class="tx-tertiary ml-1">{{farm.allocPoint}}</span>
      </div>
      <div class="opacity-75 flex-center w-100">
          <div class="tx-sm opacity-50 mr-2"> {{LANG.rewards}}: </div>

          <div>
              <span class="tx-lg tx-success">{{farm.pendingCake}}</span>
          </div>
      </div>
      <div class="flex-center">
        <div v-if="farm.pendingCake" @click="farm_redeem(index)" class="border-r-15 clickable tx-xs opacity-hover-75 n-flat pa-2">
          <i v-if="loadings.redeem" class="tx-success fas fa-circle-notch spin-spin"></i>
          {{LANG.redeem}}
        </div>
        <div @click="farm_refresh(index)" class="border-r-15 clickable tx-xs opacity-hover-75 n-flat pa-2 ml-2">
          <i v-if="loadings.refresh" class="tx-success fas fa-circle-notch spin-spin"></i>
          {{LANG.refresh}}
        </div>
      </div>
      <hr class="w-100 opacity-5">
      <details class="flex-column">
          <summary class="mb-2 clickable opacity-hover-50 tx-xs letter-s-3 tx-center">{{LANG.manage}}</summary>
          <div class="flex-column">
              <div class="tx-sm opacity-75" v-if="farm.amount">
                  {{LANG.mys}} {{LANG.investedLps}}:
                  <span @click="setMaxLps" class="border-b-1-tertiary clickable tx-tertiary">{{farm.amount}}</span>
              </div>
              <div class="my-2 mopacity-50 flex-column w-100">
                <div class="tx-xs opacity-50 mr-2"> {{LANG.totalRewards}}: </div>
                <span class="tx-lg ">{{farm.rewardDebt}}</span>
                <div class="tx-xs opacity-25">{{LANG.lastRewardBlock}}: {{farm.lastRewardBlock}}</div>
              </div>
              <!-- <div class="w-100 pa-2 flex">
                  <input type="text" name="" v-model="form.lpInput" class="n-inset n-tx flex-1 pa-2">
              </div> -->
              <div class="flex-between w-100 pa-2">
                  <div v-if="farm.allowance != 666.666" @click="farm_approve(index)" class="clickable tx-sm opacity-hover-50 n-flat pa-2 border-r-15">
                    <i v-if="loadings.approve" class="tx-success fas fa-circle-notch spin-spin"></i>
                    {{LANG.approve}}
                  </div>
                  <div v-if="farm.allowance == 666.666" @click="farm_disapprove(index)" class="clickable tx-xs opacity-hover-50 n-flat pa-2 mr-2 border-r-15">
                    <i v-if="loadings.approve" class="tx-success fas fa-circle-notch spin-spin"></i>
                    {{LANG.disapprove}}
                  </div>
                  <input type="text" name="" v-model="form.lpInput" class="n-inset n-tx flex-1 pa-2 border-r-5 noborder tx-right" style="width: 80px">
                  <div @click="farm_add(index)" class="border-r-15 mx-2 clickable tx-xs opacity-hover-75 n-flat pa-2">
                    <i v-if="loadings.add" class="tx-success fas fa-circle-notch spin-spin"></i>
                    {{LANG.add}}
                  </div>
                  <div @click="farm_remove(index)" class="border-r-15 clickable tx-xs opacity-hover-75 n-flat pa-2">
                    <i v-if="loadings.remove" class="tx-success fas fa-circle-notch spin-spin"></i>
                    {{LANG.remove}}
                  </div>
              </div>
              <!-- <hr class="w-100 opacity-5">
              <div class="tx-sm opacity-50">{{LANG.farmStats}}</div>
              <div class="flex-between w-100 tx-xs opacity-25">
                  <div>{{LANG.weight}}: {{farm.allocPoint}}</div>
                  <div>{{LANG.allocation}}: {{farm.accCakePerShare}}</div>
              </div>
              <div class="tx-xs opacity-25 mt-2">{{farm.lpToken}}</div>
              <div class="tx-xs opacity-25 "><small>{{farm.token0}}</small></div>
              <div class="tx-xs opacity-25 "><small>{{farm.token1}}</small></div> -->

              <!-- <span class="ma-3 mt-0 pa-1 pb-0 n-flat border-r-100p clickable opacity-hover-50">
                <img :src="second_token.image" :alt="second_token.id" style="max-width: 50px; max-height: 50px"
                    class=" border-r-100p"
                />
              </span> -->
          </div>
      </details>
  </div>
</template>
<script>
    import { ethers, Contract }  from 'ethers';
    import { ABIS, CURRENT_NETWORK } from '../store/constants';

export default {
  props: ["farm"],
  name: 'farm-item',     
  components: {
  },
  data() {
    return {
      loadings: {
        redeem: false,
        approve: false,
        add: false,
        remove: false,
        refresh: false,
      },
    	form: {
        lpInput: 0,
      },
    };
  }, 
  computed: {
    LANG()                  { return this.$store.getters.LANG },
    first_acc()             { return this.$store.getters.first_acc },
    accs_length()           { return this.$store.getters.accs_length },
    BASE_TOKEN()            { return this.$store.getters.BASE_TOKEN },

    token_list()            { return this.$store.getters.token_list },
    first_token()           { return this.token_list.find(x => x.address == this.farm.token0) },
    second_token()          { return this.token_list.find(x => x.address == this.farm.token1) },
    
    // memories() {
    //   return this.$store.getters.memories;
    // },
  },
  methods: {

            setMaxLps()
            {
                this.form.lpInput = this.farm.amount
            },
            async farm_approve()
            {
                if (this.loadings.approve) { return }
                this.loadings.approve = true

                let firstAddress = this.first_acc.address
                const BLOCKCHAIN = this.$store.getters.newProvider
                const USER_WALLET = await BLOCKCHAIN.getSigner()
                const fruitContract = new Contract(this.farm.lpToken, ABIS.PAIR, USER_WALLET)
                try {
                    const allowanceTx = await fruitContract.approve(CURRENT_NETWORK.MASTERCHEF_ADDRESS, ethers.constants.MaxUint256.toString())
                    await allowanceTx.wait()
                    const refresh = this.$store.dispatch("refreshAFarm", {lpToken: this.farm.lpToken, pid: this.farm.pid})
                    console.log("done")
                } catch (error)
                {
                    console.log("***error!!!")
                    console.log(error)
                }

                this.loadings.approve = false
            },
            async farm_disapprove()
            {
                if (this.loadings.approve) { return }
                this.loadings.approve = true

                let firstAddress = this.first_acc.address
                const BLOCKCHAIN = this.$store.getters.newProvider
                const USER_WALLET = await BLOCKCHAIN.getSigner()
                const fruitContract = new Contract(this.farm.lpToken, ABIS.PAIR, USER_WALLET)
                try {
                    const allowanceTx = await fruitContract.approve(CURRENT_NETWORK.MASTERCHEF_ADDRESS, 0)
                    await allowanceTx.wait()
                    const refresh = this.$store.dispatch("refreshAFarm", {lpToken: this.farm.lpToken, pid: this.farm.pid})
                    console.log("done")
                } catch (error)
                {
                    console.log("***error!!!")
                    console.log(error)
                }

                this.loadings.approve = false
            },
            async farm_add()
            {
                if (this.loadings.add) { return }
                if (this.form.lpInput == "" || this.form.lpInput == 0) { return }
                this.loadings.add = true

                let firstAddress = this.first_acc.address
                const BLOCKCHAIN = this.$store.getters.newProvider
                const USER_WALLET = await BLOCKCHAIN.getSigner()
                const chefContract = new Contract(CURRENT_NETWORK.MASTERCHEF_ADDRESS, ABIS.MASTERCHEF, USER_WALLET)
                try {
                    console.log("deposit")
                    const add = await chefContract.deposit(this.farm.pid, ethers.utils.parseEther(this.form.lpInput))
                    await add.wait()
                    const refresh = this.$store.dispatch("refreshAFarm", {lpToken: this.farm.lpToken, pid: this.farm.pid})
                    console.log("done")
                } catch (error)
                {
                    console.log("***error!!!")
                    console.log(error)
                }

                this.loadings.add = false
            },
            async farm_remove()
            {
                if (this.loadings.remove) { return }
                if (this.form.lpInput == "" || this.form.lpInput == 0) { return }
                this.loadings.remove = true

                let firstAddress = this.first_acc.address
                const BLOCKCHAIN = this.$store.getters.newProvider
                const USER_WALLET = await BLOCKCHAIN.getSigner()
                const chefContract = new Contract(CURRENT_NETWORK.MASTERCHEF_ADDRESS, ABIS.MASTERCHEF, USER_WALLET)
                try {
                    const remove = await chefContract.withdraw(this.farm.pid, ethers.utils.parseEther(this.form.lpInput))
                    await remove.wait()
                    const refresh = this.$store.dispatch("refreshAFarm", {lpToken: this.farm.lpToken, pid: this.farm.pid})
                    console.log("done")
                } catch (error)
                {
                    console.log("***error!!!")
                    console.log(error)
                }

                this.loadings.remove = false
            },
            async farm_redeem()
            {
                if (this.loadings.redeem) { return }
                this.loadings.redeem = true

                let firstAddress = this.first_acc.address
                const BLOCKCHAIN = this.$store.getters.newProvider
                const USER_WALLET = await BLOCKCHAIN.getSigner()
                const chefContract = new Contract(CURRENT_NETWORK.MASTERCHEF_ADDRESS, ABIS.MASTERCHEF, USER_WALLET)
                try {
                    const redeem = await chefContract.deposit(this.farm.pid, 0)
                    await redeem.wait()
                    const refresh = this.$store.dispatch("refreshAFarm", {lpToken: this.farm.lpToken, pid: this.farm.pid})
                    console.log("done")
                } catch (error)
                {
                    console.log("***error!!!")
                    console.log(error)
                }

                this.loadings.redeem = false
            },

            async farm_refresh()
            {
                if (this.loadings.refresh) { return }
                this.loadings.refresh = true

                let firstAddress = this.first_acc.address
                const BLOCKCHAIN = this.$store.getters.newProvider
                const USER_WALLET = await BLOCKCHAIN.getSigner()

                try {
                    const refresh = await this.$store.dispatch("refreshAFarm", {lpToken: this.farm.lpToken, pid: this.farm.pid})
                    console.log("done")
                } catch (error)
                {
                    console.log("***error!!!")
                    console.log(error)
                }

                this.loadings.refresh = false
            },
          },
}
</script>
