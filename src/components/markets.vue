<template>
    <div class="flex-column flex-1 w-100"  >
        <div class="mt-8 flex show-xl_x"></div>
        <div class="py-8" :class="[togglers.advanced ? 'n-flat ' : '']">
            <!-- <div class="n-inset py-8 px-3 mt-8"> -->
                <!-- <div v-for="(article, index) in articles" :key="article.id">
                    <new-item class="item" :key="index" :article="article"></new-item>
                </div> -->
            <!-- </div> -->
                <!-- <div  :class="[togglers.advanced ? 'tx-lg' : '']"
                    class="tx-center" 
                >
                    <span class="mt-8 letter-s-5  opacity-25 tx-center pa-2 ">
                        <b>{{LANG.rates}}</b>
                    </span>
                </div>
            <div class="my-8 flex"></div> -->

            <ul class="flex-column-r " v-if="togglers.threed">
                <li v-for="(token, index) in token_list_r" :key="token.address" class="clickable" @click="setToken(token)"
                :class="[_amISelected(token.id) ? 'n-conca ' : '']">
                    <div class="flex-between w-100">
                        <span>{{token.id}}</span>
                        <span class="mx-2"></span>
                        <span v-if="token.price == 0" class="opacity-25">
                            ?
                        </span>
                        <span v-else>{{token.price}}</span>
                    </div>
                </li>
            </ul>

            <div  class="flex-column flex-justify-start  " v-if="!togglers.threed">
                <!-- <span class="tx-lg my-4 opacity-50 w-100 tx-center">{{LANG.myDashboard}}</span> -->


                <div class="flex-align-start flex-1 flex-column flex-lg2x-row my-5">
                    <div class="flex-column flex-1 w-100"  >
                        <div v-for="(token, index) in token_list" :key="token.address" class="flex-between w-100">
                            <!-- <div class=""> -->
                                <span class="px-3 py-1 clickable border-r-15" :class="[_amISelected(token.id) ? 'n-conca opacity-hover-75' : 'opacity-hover-50']" @click="setToken(token)">
                                    <!-- <i class="opacity-25 mr-2 fas fa-angle-right"></i> -->
                                    <span>{{token.id}}</span>
                                </span>
                                
                                <span class="mx-2"></span>
                                <span v-if="token.price == 0" class="opacity-25">
                                    ?
                                </span>
                                <span v-else>{{token.price}}</span>
                            <!-- </div> -->
                        </div>
                    </div>
                </div>
                
            </div>
            <!-- <div class="my-8 flex"></div>
            <div class="flex-between">
                <div class="tx-xs clickable n-flat flex-align-start pa-2 border-r-10" @click="togglers.threed = !togglers.threed">
                    {{LANG.switchTo}} {{!togglers.threed ? '3D' : '2D'}}
                </div>
            </div> -->
        </div>
    </div>
</template>
<script>
import { ethers, Contract }  from 'ethers';
import newItem from "../components/new-item.vue";
import { ABIS, CURRENT_NETWORK } from '../store/constants';

export default {   
  props: ["loadup", "tokenInputs"],
    name: 'markets',     
    data()
    {
        return {
            

            ABIS,
            CURRENT_NETWORK,

            loading: false,
            loadings: {},

            togglers: {
                advanced: false,
                threed: true,
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
    },
    computed: {
        LANG()                  { return this.$store.getters.LANG },
        first_acc()             { return this.$store.getters.first_acc },
        accs_length()           { return this.$store.getters.accs_length },
        BASE_TOKEN()            { return this.$store.getters.BASE_TOKEN },

        articles()              { return this.$store.getters.articles },
        tokens()                { return this.$store.getters.tokens },
        token_list()            { return this.$store.getters.token_list },
        token_list_r()          { return [...this.token_list].reverse() },
        pools()                 { return this.$store.getters.pools },
        pools_length()          { return this.$store.getters.pools_length },
        retrieved_pool_length() { return this.$store.getters.retrieved_pool_length },
	},
	methods: {
        setToken(token) {
            // if (this.parentload) return
            // if (this.tokens[1].id != this.token_list[1])
            // {
                // console.log(this.token_list)
                // console.log({ token: this.token_list[1], index: 1 })
                // this.$store.dispatch("setToken", { token: this.token_list[1], index: 1 })
            // }
            // if (this.tokens[0].id != token.id)
            // {
                this.$store.dispatch("setToken", { token, index: 0 })
            // }
            // this.togglers.tokenList = false
        },
        _amISelected(id)
        {
            return this.tokens[0].id == id
        },
        setMaxLps(poolLp, amount)
        {
            this.form.poolLpInputs[poolLp] = amount
        },
        async farm_approve(poolLp)
        {
            let firstAddress = this.first_acc.address
            const BLOCKCHAIN = this.$store.getters.newProvider
            const USER_WALLET = await BLOCKCHAIN.getSigner()
            const fruitContract = new Contract(poolLp, ABIS.PAIR, USER_WALLET)
            try {
                const allowanceTx = await fruitContract.approve(CURRENT_NETWORK.MASTERCHEF_ADDRESS, ethers.constants.MaxUint256.toString())
                console.log("done")
            } catch (error)
            {
                console.log("***error!!!")
                console.log(error)
            }
        },
        async farm_add(poolLp)
        {
            let firstAddress = this.first_acc.address
            const BLOCKCHAIN = this.$store.getters.newProvider
            const USER_WALLET = await BLOCKCHAIN.getSigner()
            const chefContract = new Contract(CURRENT_NETWORK.MASTERCHEF_ADDRESS, ABIS.MASTERCHEF, USER_WALLET)
            try {
                console.log("deposit")
                const redeem = await chefContract.deposit(this.pools[poolLp].pid, ethers.utils.parseEther(this.form.poolLpInputs[poolLp]))
                console.log("done")
            } catch (error)
            {
                console.log("***error!!!")
                console.log(error)
            }
        },
        async farm_remove(poolLp)
        {

        },
        async farm_redeem(poolLp)
        {
            let firstAddress = this.first_acc.address
            const BLOCKCHAIN = this.$store.getters.newProvider
            const USER_WALLET = await BLOCKCHAIN.getSigner()
            const chefContract = new Contract(CURRENT_NETWORK.MASTERCHEF_ADDRESS, ABIS.MASTERCHEF, USER_WALLET)
            try {
                const redeem = await chefContract.updatePool(this.pools[poolLp].pid)
                console.log("done")
            } catch (error)
            {
                console.log("***error!!!")
                console.log(error)
            }
        },
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
