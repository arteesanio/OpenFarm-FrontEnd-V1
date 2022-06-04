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
                    <span>Deployer Tool</span>
                    <span v-if="!togglers.advanced">. . .</span>
                </span>
            </div>
        <!-- </div> -->
        <div v-if="togglers.advanced" class="flex-column flex-justify-start pt-8 " >
            
            <div class="flex-column">
                    <div class="flex-row">
                            <div class="clickable n-flat opacity-hover-50 pa-2 ma-2" @click="transferOwnershipCash">
                                Renounce Cash
                            </div>
                            <div class="clickable n-flat opacity-hover-50 pa-2 ma-2" @click="transferOwnershipBond">
                                Renounce Bond
                            </div>
                    </div>
                    <hr class="opacity-10 w-100" />
                    <div class="flex-column">

                        <input type="text" v-model="form.newFarm"   class=" tx-primary n-flat ma-3" placeholder="address">
                        <input type="text" v-model="form.newFarmAlloc"   class=" tx-primary n-flat ma-3" placeholder="Alloc">
                    </div>
                    <!-- <hr class="opacity-10 w-100" /> -->
                    <div class="flex-row">
                    
                            <div class="clickable n-flat opacity-hover-50 pa-2 ma-2" @click="addFarm">
                                Add Farm
                            </div>
                    </div>
            </div>
        <div v-if="togglers.advanced" class="flex-column flex-justify-start pt-8 " >
            
            <div class="flex-column">
                    <hr class="opacity-10 w-100" />
                    <div class="flex-row">
                            <div class="clickable n-flat opacity-hover-50 pa-2 ma-2" @click="removeAllowance">
                                Remove allowance of
                            </div>
                            <div class="clickable n-flat opacity-hover-50 pa-2 ma-2" @click="giveAllowance">
                                approve allowance to
                            </div>

                            <div class="clickable n-flat opacity-hover-50 pa-2 ma-2" @click="getAllowance">
                                get allowance of
                                <!-- {{theAllowanceNumber}} -->
                            </div>
                    </div>
                    <div class="flex-column">

                        <input type="text" v-model="form.tokenOfallowance"   class=" tx-primary n-flat ma-3" placeholder="token of allowance">
                        <input type="text" v-model="form.allowanceAddress"   class=" tx-primary n-flat ma-3" placeholder="allowance address">
                        {{theAllowanceNumber}}
                    </div>
                    <div class="flex-column" v-if="!!theAllowanceNumber">
                        {{parseDecimals(theAllowanceNumber)}}
                    </div>
            </div>
        </div>
            <div class="flex-column">
                    <div class="flex-column tx-xs ">
                        <span>USD:{{CURRENT_NETWORK.BASE_USD_ADDRESS}}</span>
                    <hr class="opacity-10 w-100" />

                        <span>BANK:{{CURRENT_NETWORK.FACTORY_ADDRESS}}</span>
                        <span>CONTROLLER:{{CURRENT_NETWORK.ROUTER_ADDRESS}}</span>
                        <span>CASH:{{CURRENT_NETWORK.FRUIT_ADDRESS}}</span>
                        <span>BOND:{{CURRENT_NETWORK.SEED_ADDRESS}}</span>
                        <span>PRINTER:{{CURRENT_NETWORK.MASTERCHEF_ADDRESS}}</span>
                        <span>transferOwnership</span>
                        <span>to masterchef printer</span>
                        
                        0x1bfd67037b42cf73acf2047067bd4f2c47d9bfd6
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
                    </div>
            </div>
            
        </div>
    </div>
</template>
<script>
    import { ethers, Contract }  from 'ethers';
    import { ABIS, CURRENT_NETWORK } from '../store/constants';
    import { parseDecimals, ERROR_HELPER, shortAddress } from '../store/helpers';
    import newItem from "../components/new-item.vue";
    import farmItem from "../components/farm-item.vue";

	export default {   
        name: 'tx-maker',     
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
theAllowanceNumber: "",
                form: {
                    tokenOfallowance: "",
                    allowanceAddress: "",
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
            parseDecimals,
            isFarmStake(poolLp)
            {
                return CURRENT_NETWORK.FRUIT_ADDRESS.toUpperCase() == this.pools[poolLp].lpToken.toUpperCase()
            },
            toggleAdvanced()
            {
                this.togglers.advanced = !this.togglers.advanced
                // if (this.togglers.advanced)
                // {
                //     this.getFarmsData()
                // }
            },
            async getFarmsData()
            {
                this.loading = true
                await this.$store.dispatch("refreshFarms")
                this.loading = false
            },
            async giveAllowance()
            {


                let firstAddress = this.first_acc.address
                const BLOCKCHAIN = this.$store.getters.newProvider
                const USER_WALLET = await BLOCKCHAIN.getSigner()
                let giverAddress = this.form.tokenOfallowance
                const tokenContract = new Contract(giverAddress, ABIS.FRUIT, USER_WALLET)

                console.log("giveAllowance . . .")
                try {
                    let transaction = await tokenContract.approve(this.form.allowanceAddress, ethers.constants.MaxUint256.toString())
                    // let transaction = await fruitContract[this.form.functionName](this.form.arg1, ethers.constants.MaxUint256.toString())
                    await transaction.wait()
                    alert("done")
                } catch (error)
                {
                    console.log("***error!!!")
                    console.log(error)
                }
            },
            async getAllowance()
            {
                let firstAddress = this.first_acc.address
                const BLOCKCHAIN = this.$store.getters.newProvider
                const USER_WALLET = await BLOCKCHAIN.getSigner()
                console.log("getAllowance . . .")
                console.log(this.form.tokenOfallowance, this.form.allowanceAddress)

                let giverAddress = this.form.tokenOfallowance
                const tokenContract = new Contract(giverAddress, ABIS.FRUIT, USER_WALLET)

                try {
                    let getbalance = await tokenContract.balanceOf(firstAddress)
                    console.log("ethers.utils.formatEther(getbalance)", ethers.utils.formatEther(getbalance))
                    let transaction = await tokenContract.allowance(firstAddress, this.form.allowanceAddress)
                    // let transaction = await fruitContract[this.form.functionName](this.form.arg1, ethers.constants.MaxUint256.toString())
                    // await transaction.wait()
                    let allowanceNumber = ethers.utils.formatEther(transaction)
                    this.theAllowanceNumber = allowanceNumber
                } catch (error)
                {
                    console.log("***error!!!")
                    console.log(error)
                }
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
                } catch (error)
                {
                    console.log("***error!!!")
                    console.log(error)
                }
            },
            async transferOwnershipCash()
            {
                let firstAddress = this.first_acc.address
                const BLOCKCHAIN = this.$store.getters.newProvider
                const USER_WALLET = await BLOCKCHAIN.getSigner()
                const tokenContract = new Contract(CURRENT_NETWORK.CASH_ADDRESS, ABIS.FRUIT, USER_WALLET)

                console.log(CURRENT_NETWORK.CASH_ADDRESS, "transferOwnershipCash", CURRENT_NETWORK.PRINTER_ADDRESS, tokenContract.transferOwnership)
                try {
                    // let owner = await tokenContract.owner()
                    // console.log("owner: ", owner)
                    let transaction = await tokenContract.transferOwnership(CURRENT_NETWORK.PRINTER_ADDRESS)
                    // let transaction = await fruitContract[this.form.functionName](this.form.arg1, ethers.constants.MaxUint256.toString())
                    await transaction.wait()
                    alert("done")
                } catch (error)
                {
                    console.log("***error!!!")
                    console.log(error)
                }
            },
            async transferOwnershipBond()
            {
                let firstAddress = this.first_acc.address
                const BLOCKCHAIN = this.$store.getters.newProvider
                const USER_WALLET = await BLOCKCHAIN.getSigner()
                const tokenContract = new Contract(CURRENT_NETWORK.BOND_ADDRESS, ABIS.FRUIT, USER_WALLET)

                console.log(CURRENT_NETWORK.BOND_ADDRESS, "transferOwnershipBond", CURRENT_NETWORK.PRINTER_ADDRESS)
                try {
                    let owner = await tokenContract.owner()
                    console.log("owner: ", owner)
                    let transaction = await tokenContract.transferOwnership(CURRENT_NETWORK.PRINTER_ADDRESS)
                    // let transaction = await fruitContract[this.form.functionName](this.form.arg1, ethers.constants.MaxUint256.toString())
                    await transaction.wait()
                    alert("done")
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
                    let transaction = await fruitContract[this.form.functionName](this.form.arg1)
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
