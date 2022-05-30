<template>
    <div class="py-8" :class="[togglers.advanced ? 'n-flat ' : '']">
        <!-- <div class="n-inset py-8 px-3 mt-8"> -->
            <!-- <div v-for="(article, index) in articles" :key="article.id">
                <new-item class="item" :key="index" :article="article"></new-item>
            </div> -->
            <div  :class="[togglers.advanced ? 'tx-lg' : '']"
                class="tx-center" 
            >
                <span @click="toggleAdvanced" class="mt-8 clickable letter-s-3 tx-tertiary opacity-hover-50 tx-center pa-2 border-b-1-tertiary pb-2">
                    <span>{{LANG.farms}}</span>
                    <span v-if="!togglers.advanced">. . .</span>
                </span>
            </div>
        <!-- </div> -->
        <div v-if="togglers.advanced" class="flex-column flex-justify-start  " style="min-height: 600px">
            <!-- <span class="tx-lg my-4 opacity-50 w-100 tx-center">{{LANG.myDashboard}}</span> -->


            <div class="flex-align-start flex-1 flex-column flex-lg2x-row my-5">
                <div class="flex-column flex-1 w-100"  >
                    <div class="tx-md my-4 opacity-50 w-100 tx-center ma-3">
                        <span class="border-b-1-success tx-success pb-2">
                            {{LANG.savingsComissions}}
                        </span>
                    </div>
                    <span class="tx-lg my-4 opacity-25 w-100 tx-center nowrap">{{LANG.comingSoon}} . . .</span>

                    
                    <!-- <div class="flex-column tx-xs">
                        <span>FRUIT:{{CURRENT_NETWORK.FRUIT_ADDRESS}}</span>
                        <span>SEED:{{CURRENT_NETWORK.SEED_ADDRESS}}</span>
                        <span>MASTERCHEF:{{CURRENT_NETWORK.MASTERCHEF_ADDRESS}}</span>
                        <span>transferOwnership</span>
                        <span>0x7441c3ecf133d78b14ef27cb9e02b18c0af6a919</span>
                    </div>
                    <div class="w-50">
                        <input type="text" v-model="form.contractAbi"       class=" tx-primary n-flat ma-3" placeholder="abi">
                        <input type="text" v-model="form.contractAddress"   class=" tx-primary n-flat ma-3" placeholder="address">
                        <input type="text" v-model="form.functionName"      class=" tx-primary n-flat ma-3" placeholder="function">
                        <input type="text" v-model="form.arg1"              class=" tx-primary n-flat ma-3" placeholder="arg 1">
                        <input type="text" v-model="form.arg2"              class=" tx-primary n-flat ma-3" placeholder="arg 2">
                        <input type="text" v-model="form.arg3"              class=" tx-primary n-flat ma-3" placeholder="arg 3">
                        <div class="clickable n-flat opacity-hover-50 pa-2" @click="tx">
                            send tx
                        </div>
                        <div class="clickable n-flat opacity-hover-50 pa-2" @click="call">
                            get
                        </div>
                    </div> -->
                </div>
                <div class="flex-wrap flex-align-start flex-1">
                    <span class="nowrap tx-md my-4 opacity-50 w-100 tx-center">{{LANG.availFarms}} ({{retrieved_pool_length}})</span>
                    <div v-if="!pools_length">
                        <div v-if="loading"><i class="fas fa-circle-notch spin-spin"></i></div>
                    </div>
                    <div v-else>
                        <div v-for="(pool, index) in pools" :key="pool.pid">
                            <farm-item :farm="pool" />
                            <!-- <div class="flex-column n-flat pa-2 mb-2 border-r-15">
                                <div class="tx-sm opacity-75" v-if="pool.amount">
                                    My Invested LPs:
                                    <span @click="setMaxLps(index, pool.amount)" class="border-b-1-tertiary clickable tx-tertiary">{{pool.amount}}</span>
                                </div>
                                <div class="tx- mopacity-50 flex-around w-100">
                                    <div class="tx-sm opacity-50 mr-2"> {{LANG.rewards}}: </div>
                                    <div>
                                        <span class="tx-lg tx-success">{{pool.rewardDebt}}</span>
                                        /
                                        <span>{{pool.pendingCake}}</span>
                                    </div>
                                </div>
                                <div class="tx-xs opacity-25">{{LANG.lastRewardBlock}}: {{pool.lastRewardBlock}}</div>
                                <details>
                                    <summary class="mt-4 clickable opacity-hover-50 tx-xs letter-s-3">{{LANG.manage}}</summary>
                                    <div>
                                        <div class="w-100 pa-2 flex">
                                            <input type="text" name="" v-model="form.poolLpInputs[index]" class="n-inset n-tx flex-1 pa-2">
                                        </div>
                                        <div class="flex-between w-100 pa-2">
                                            <div v-if="pool.allowance != 666.666" @click="farm_approve(index)" class="clickable tx-sm opacity-hover-50 n-flat pa-2">
                                                Approve
                                            </div>
                                            <div @click="farm_add(index)" class="border-r-15 clickable tx-xs opacity-hover-75 n-flat pa-2">{{LANG.add}}</div>
                                            <div @click="farm_remove(index)" class="border-r-15 clickable tx-xs opacity-hover-75 n-flat pa-2">Remove</div>
                                            <div @click="farm_redeem(index)" class="border-r-15 clickable tx-xs opacity-hover-75 n-flat pa-2">Redeem</div>
                                        </div>
                                        <hr class="w-100 opacity-5">
                                        <div class="tx-sm opacity-50">{{LANG.farmStats}}</div>
                                        <div class="flex-between w-100 tx-xs opacity-25">
                                            <div>{{LANG.weight}}: {{pool.allocPoint}}</div>
                                            <div>{{LANG.allocation}}: {{pool.accCakePerShare}}</div>
                                        </div>
                                        <div class="tx-xs opacity-25 mt-2">{{pool.lpToken}}</div>
                                        <div class="tx-xs opacity-25 "><small>{{pool.token0}}</small></div>
                                        <div class="tx-xs opacity-25 "><small>{{pool.token1}}</small></div>
                                    </div>
                                </details>
                            </div> -->
                        </div>
                    </div>


                </div>
            </div>
            <!-- 
            <div class="flex-column">
                <span>Add Farm</span>
                <div>
                    <input type="text" v-model="form.newFarm"   class=" tx-primary n-flat ma-3" placeholder="address">
                    <input type="text" v-model="form.newFarmAlloc"   class=" tx-primary n-flat ma-3" placeholder="Alloc">
                </div>
                <div class="clickable n-flat opacity-hover-50 pa-2" @click="addFarm">
                    send tx
                </div>
            </div> -->

            
        </div>
    </div>
</template>
<script>
    import { ethers, Contract }  from 'ethers';
    import { ABIS, CURRENT_NETWORK } from '../store/constants';
    import newItem from "../components/new-item.vue";
    import farmItem from "../components/farm-item.vue";

	export default {   
        name: 'farms',     
        data()
        {
            return {
                ABIS,
                CURRENT_NETWORK,

                loading: false,
                loadings: {},

                togglers: {
                    advanced: false,
                },

                form: {
                    poolLpInputs: {},
                    newFarm: "",
                    newFarmAlloc: "",

                    contractAbi: "",
                    contractAddress: "",
                    functionName: "",

                    arg1: "",
                    arg2: "",
                    arg3: "",
                },
            }
        },
        components: {
            newItem,
            farmItem,
        },
	    computed: {
            LANG()                  { return this.$store.getters.LANG },
            first_acc()             { return this.$store.getters.first_acc },
            accs_length()           { return this.$store.getters.accs_length },
            BASE_TOKEN()            { return this.$store.getters.BASE_TOKEN },

            articles()              { return this.$store.getters.articles },
            token_list()            { return this.$store.getters.token_list },
            pools()                 { return this.$store.getters.pools },
            pools_length()          { return this.$store.getters.pools_length },
            retrieved_pool_length() { return this.$store.getters.retrieved_pool_length },
		},
		methods: {
            isFarmStake(poolLp)
            {
                return CURRENT_NETWORK.FRUIT_ADDRESS.toUpperCase() == this.pools[poolLp].lpToken.toUpperCase()
            },
            toggleAdvanced()
            {
                this.togglers.advanced = !this.togglers.advanced
                if (this.togglers.advanced)
                {
                    this.getFarmsData()
                }
            },
            async getFarmsData()
            {
                this.loading = true
                await this.$store.dispatch("refreshFarms")
                this.loading = false
            },
            async addFarm()
            {
                let firstAddress = this.first_acc.address
                const BLOCKCHAIN = this.$store.getters.newProvider
                const USER_WALLET = await BLOCKCHAIN.getSigner()
                const chefContract = new Contract(CURRENT_NETWORK.MASTERCHEF_ADDRESS, ABIS.MASTERCHEF, USER_WALLET)

                console.log("asd")
                try {
                    let transaction = await chefContract.add(this.form.newFarmAlloc, this.form.newFarm, true)
                    // let transaction = await fruitContract[this.form.functionName](this.form.arg1, ethers.constants.MaxUint256.toString())
                    await transaction.wait()
                    alert("done")
                    // const allowanceTx = await fruitContract.allowance(firstAddress, CURRENT_NETWORK.ROUTER_ADDRESS)
                    // let parsedAllowanceTx = parseDecimals(parseFloat(ethers.utils.formatEther(allowanceTx)))
                    // context.commit(
                    //     "updateAccountAllowance",
                    //     {
                    //     address: firstAddress,
                    //     tokenAddress: tokenAddress,
                    //     allowance: parsedAllowanceTx,
                    //     }
                    // )
                } catch (error)
                {
                    console.log("***error!!!")
                    console.log(error)
                }
            },
            async tx()
            {
                if (!this.first_acc) return

                let firstAddress = this.first_acc.address
                const BLOCKCHAIN = this.$store.getters.newProvider
                const USER_WALLET = await BLOCKCHAIN.getSigner()
                const fruitContract = new Contract(this.form.contractAddress, ABIS[this.form.contractAbi], USER_WALLET)
                console.log("asd")
                try {
                    let transaction = await fruitContract[this.form.functionName](this.form.arg1, ethers.utils.parseUnits('0.1', 18))
                    // let transaction = await fruitContract[this.form.functionName](this.form.arg1, ethers.constants.MaxUint256.toString())
                    await transaction.wait()
                    alert("done")
                    // const allowanceTx = await fruitContract.allowance(firstAddress, CURRENT_NETWORK.ROUTER_ADDRESS)
                    // let parsedAllowanceTx = parseDecimals(parseFloat(ethers.utils.formatEther(allowanceTx)))
                    // context.commit(
                    //     "updateAccountAllowance",
                    //     {
                    //     address: firstAddress,
                    //     tokenAddress: tokenAddress,
                    //     allowance: parsedAllowanceTx,
                    //     }
                    // )
                } catch (error)
                {
                    console.log("***error!!!")
                    console.log(error)
                }
            },
            async call()
            {
                if (!this.first_acc) return

                let firstAddress = this.first_acc.address
                const BLOCKCHAIN = this.$store.getters.newProvider
                const USER_WALLET = await BLOCKCHAIN.getSigner()
                const fruitContract = new Contract(this.form.contractAddress, ABIS[this.form.contractAbi], USER_WALLET)
                try {
                    let transaction = await fruitContract[this.form.functionName](this.form.arg1)
                    console.log(transaction)
                    // await transaction.wait()
                    // alert("done")
                    // const allowanceTx = await fruitContract.allowance(firstAddress, CURRENT_NETWORK.ROUTER_ADDRESS)
                    // let parsedAllowanceTx = parseDecimals(parseFloat(ethers.utils.formatEther(allowanceTx)))
                    // context.commit(
                    //     "updateAccountAllowance",
                    //     {
                    //     address: firstAddress,
                    //     tokenAddress: tokenAddress,
                    //     allowance: parsedAllowanceTx,
                    //     }
                    // )
                } catch (error)
                {
                    console.log("***error!!!")
                    console.log(error)
                }
            },
            
		},
	}
</script>
