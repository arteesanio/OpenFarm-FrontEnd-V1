
<template>
	<div class="flex-column flex-1 w-100" >
		<div class="mt-8 mb-3 flex show-xl_x"></div>
    	<div class="flex-column n-flat pt-0 pa-3  border-r-25" >
        	<div class="flex-between pa-2 w-100">
	            <span class="opacity-25 tx-sm">{{LANG.settings}}</span>
	            <!-- <i v-if="true" class="fas fa-times tx-xs"></i> -->
        	</div>
        	<!-- <div @click="editConfig" class="flex-between pa-2 w-100 clickable opacity-hover-75">
	            <span class="opacity-25 tx-sm">{{LANG.settings}}</span>
	            <i v-if="true" class="fas fa-times tx-xs"></i>
        	</div> -->
        	<!-- <hr class="w-100 opacity-5"> -->
        	<!-- <hr class="w-100 opacity-5"> -->
    		<div class="tx-center tx-xs opacity-75 letter-s-3">{{LANG.slippage}}</div>
        	<div class="flex-row n-flat border-r-25 pa-2 ma-2">
	    		<input type="range" min="1" max="100" step="0.2" v-model="slippageSlider" class="nosaturation">
	    		<input
	    			v-model="form.slippage"
	    			type="text" name="" min="0" max="100"
	    			style="width: 50px"
	    			class="border-r-5 px-2 py-1 tx-right n-tx  n-inset mx-2 noborder opacity-hover-75 clickable"
				>
			</div>
        	<hr class="w-100 opacity-5">
        	<div class="flex">
	        	<small class=" opacity-25  flex-column flex-align-start mr-2 " v-if="accs_length">
	        		<small class="tx-xs letter-s-2 word-s-5">
	        			{{LANG.connectedAddress}}
	        		</small>
	        		<small class="letter-s-2 word-s-5">
	        			<b>{{shortAddress(first_acc.address)}}</b>
	        		</small>
	        		<b class="tx-xs">{{ BASE_TOKEN }} Balance: <span class="tx-lg">{{first_acc.balance}}</span></b>
	        	</small>
	        	<div>
		        	<a class="  letter-s-3 py-1 px-3 tx-secondary clickable opacity-hover-75 x-2 flex tx-sm nodeco" 
		            	href="https://ftmscan.com/" target="_blank" 
		            >
		            	<span>My Account</span>
		            	<i class="fas fa-external-link-alt ml-1"></i>
		        	</a>
		        </div>
	        </div>
        </div>
        
	</div>
</template>
<script>
	import { parseDecimals, ERROR_HELPER, shortAddress } from '../store/helpers';

	export default {
	  props: ["loadup", "tokenInputs"],
	  name: 'settings',     
	  components: {
	  },
	  data() {
	    return {
				form: {
					slippage: 99.2,
					balpercent: 50,
					exitLiquidity: 0,
				},
				slippageSlider: 99.2,
				loading: false,
				loadings: {
					approveLiquidity: false,
					approveFrom: false,
					approveTo: false,
				},

				togglers: {
					createPair: false,
				}
	    };
	  }, 
	  computed: {
        LANG()                  { return this.$store.getters.LANG },
        first_acc()         	{ return this.$store.getters.first_acc },
        accs_length()           { return this.$store.getters.accs_length },
        
        BASE_TOKEN()            { return this.$store.getters.BASE_TOKEN },
	    token_list() {
	      return this.$store.getters.token_list;
	    },
	        tokens() {
	            return this.$store.getters.tokens;
	        },
	        hasLpBalance() {
	            // if (!this.first_acc) return false
	            // if (this.tokens[0].id == this.BASE_TOKEN) return true
	            if (!this.currentLp) return false
	            return this.currentLp.balance > 0;
	        },
	        currentLp() {
	        	if (!!this.$store.getters.lpAt(this.tokens[0].address+this.tokens[1].address))
	        		return this.$store.getters.lpAt(this.tokens[0].address+this.tokens[1].address)
	        	if (!!this.$store.getters.lpAt(this.tokens[1].address+this.tokens[0].address))
	        		return this.$store.getters.lpAt(this.tokens[1].address+this.tokens[0].address)
	        },
	        hasLPAllowance() {
	            // if (!this.first_acc) return false
            	if (!this.currentLp) return false
            	if (!this.first_acc.allowances) return false
	            return this.first_acc.allowances[this.currentLp.address] > 0;
	        },
	        hasFirstTokenAllowance() {
	            // if (!this.first_acc) return false
	            if (this.tokens[0].id == this.BASE_TOKEN) return true
            	if (!this.first_acc.allowances) return false
	            return this.first_acc.allowances[this.tokens[0].address] > 0;
	        },
	        hasSecondTokenAllowance() {
	            // if (!this.first_acc) return false
	            if (this.tokens[1].id == this.BASE_TOKEN) return true
            	if (!this.first_acc.allowances) return false
	            return this.first_acc.allowances[this.tokens[1].address] > 0;
	        },
	        _tradingBaseToken() {
	        	return this.tokens[0].id == this.BASE_TOKEN || this.tokens[1].id == this.BASE_TOKEN
	        },
    	},
	  methods: {
	  		parseDecimals,
	  		shortAddress,
	  		editConfig()
	  		{
	  			this.$parent.editConfig()
	  		},
            async approveTokenFrom() {
                if (this.loadings.approveFrom) { return } this.loadings.approveFrom = true

            	const action = "approveToRouter"
	            try {
					let result = await this.$store.dispatch(action, this.tokens[0].address)
				} catch (error)
				{
					let errorMeaning = ERROR_HELPER.handleError({action}, error)
					console.log(errorMeaning)
				}
                this.loadings.approveFrom = false
            },
            async approveTokenTo() {
                if (this.loadings.approveTo) { return } this.loadings.approveTo = true

            	const action = "approveToRouter"
	            try {
					let result = await this.$store.dispatch(action, this.tokens[1].address)
				} catch (error)
				{
					let errorMeaning = ERROR_HELPER.handleError({action}, error)
					console.log(errorMeaning)
				}
                this.loadings.approveTo = false
            },

            async disapproveTokenFrom() {
                if (this.loadings.approveFrom) { return } this.loadings.approveFrom = true

            	const action = "disapproveToRouter"
	            try {
					let result = await this.$store.dispatch(action, this.tokens[0].address)
				} catch (error)
				{
					let errorMeaning = ERROR_HELPER.handleError({action}, error)
					console.log(errorMeaning)
				}
                this.loadings.approveFrom = false
            },
            async disapproveTokenTo() {
                if (this.loadings.approveTo) { return } this.loadings.approveTo = true

            	const action = "disapproveToRouter"
	            try {
					let result = await this.$store.dispatch(action, this.tokens[1].address)
				} catch (error)
				{
					let errorMeaning = ERROR_HELPER.handleError({action}, error)
					console.log(errorMeaning)
				}
                this.loadings.approveTo = false
            },
            async sendDustToLPFrom() {
                if (this.loading) { return } this.loading = true

                let result = await this.$store.dispatch("sendDustToLP", 0)
                this.loading = false
            },
            async sendDustToLPTo() {
                if (this.loading) { return } this.loading = true

                let result = await this.$store.dispatch("sendDustToLP", 1)
                this.loading = false
            },
			async getLiquidity(createPair) {
                if (this.loading) { return }
                this.loading = true
            	const action = "getLiquidity"
	            try {
					let result = await this.$store.dispatch(action, createPair)
				} catch (error)
				{
					this.togglers.createPair = true
					let errorMeaning = ERROR_HELPER.handleError({action}, error)
					console.log(errorMeaning)
				}
            	this.loading = false
			},
			async addLiquidity() {
                if (this.loading) { return }
				if (this.tokenInputs.token0Amount < 0.0001 || this.tokenInputs.token1Amount < 0.0001) { return alert("too low")}
                this.loading = true
				let trade = {token0Amount: this.tokenInputs.token0Amount, token1Amount: this.tokenInputs.token1Amount, slippage: parseFloat(this.form.slippage)}
            	const action = "addLiquidity"
	            try {
					let result = await this.$store.dispatch(action, trade)
				} catch (error)
				{
					let errorMeaning = ERROR_HELPER.handleError({action}, error)
					console.log(errorMeaning)
				}
            	this.loading = false
			},
			async exitLiquidity() {

                if (this.loading) { return }
                if (!this.hasLpBalance) { return }
				if (this.tokenInputs.token0Amount < 0.0001 || this.tokenInputs.token1Amount < 0.0001) { return alert("too low")}
                this.loading = true
				let trade = {liquidity: this.form.exitLiquidity, token0Amount: this.token0Amount, token1Amount: this.token1Amount, slippage: parseFloat(this.form.slippage)}
          		// console.log("exhange??");
				// this.$store.dispatch("newTrade", {token0Amount: this.token0Amount, token1Amount: this.token1Amount})
				let result = await this.$store.dispatch("removeLiquidity", trade )
				.then((res) => {
					console.log("succesfull trade: thereceipt", res)
                	this.loading = false
            	})
				.catch((err) => {
					// console.log("*************", err.data)
					if (err)
					{
						if (err.data)
						{
							console.log("*************", err.data)
							if (
									err.data.code == 3 && 
									err.data.message == "execution reverted: TransferHelper: TRANSFER_FROM_FAILED"
								)
							{
								alert("please approve both tokens")
							}
						}
						if (!err.code) console.log("error code", err.code)
						if (!err.message) console.log("error message", err.message)
              		} else { console.log("undefined error")}
                	this.loading = false
            	})
			},

		    async approveLiquidity() {
                if (this.loadings.approveLiquidity) { return }
    			if (!this.currentLp) return
				this.loadings.approveLiquidity = true;

            	const action = "approveToRouter"
	            try {
					let result = await this.$store.dispatch(action, this.currentLp.address)
				} catch (error)
				{
					let errorMeaning = ERROR_HELPER.handleError({action}, error)
					console.log(errorMeaning)
				}

				this.loadings.approveLiquidity = false;
		    },
		    async disapproveLiquidity() {
                if (this.loadings.approveLiquidity) { return }
    			if (!this.currentLp) return
				this.loadings.approveLiquidity = true;

            	const action = "disapproveToRouter"
	            try {
					let result = await this.$store.dispatch(action, this.currentLp.address)
				} catch (error)
				{
					let errorMeaning = ERROR_HELPER.handleError({action}, error)
					console.log(errorMeaning)
				}

				this.loadings.approveLiquidity = false;
		    },

		    setMaxLp() {
	    		if (!this.currentLp) return
		    	this.form.exitLiquidity = this.currentLp.balance
		    },
	  },
	  watch:
	  {
	  	slippageSlider(newVal, oldVal)
	  	{
	  		this.form.slippage = newVal
	  	},
	  }
	}
</script>

        	<!-- <div class="flex-row">
	        	<div
	        		class="clickable opacity-hover-75 my-2 border-r-15 n-flat flex-column tx-xs py-1 px-3" 
	            	v-if="	!loading > 0"
	            	@click="sendDustToLPFrom"
	            >
	        		Send 0.1 Token "FROM"
	        	</div>
	            <div class="noclick opacity-50 my-2 border-r-15 n-flat flex-column tx-xs py-1 px-3" 
	            	v-if="loading" 
	            >
		        	<span class="tx-sm opacity-50 ">
        				Send 0.1 Token "FROM"
		        	</span>
	        	</div>
	        	<div
	        		class="clickable opacity-hover-75 my-2 border-r-15 n-flat flex-column tx-xs py-1 px-3" 
	            	v-if="	!loading > 0"
	            	@click="sendDustToLPTo"
	            >
	        		Send 0.1 Token "TO"
	        	</div>
	            <div class="noclick opacity-50 my-2 border-r-15 n-flat flex-column tx-xs py-1 px-3" 
	            	v-if="loading" 
	            >
		        	<span class="tx-sm opacity-50 ">
        				Send 0.1 Token "TO"
		        	</span>
	        	</div>
	        </div> -->

    		<!-- <div class="tx-center tx-xs">Set Balance Percent: {{form.balpercent}}</div>
    		<input
    			v-model="form.balpercent"
    			type="text" name="" min="0" max="100"
    			style="width: 100px"
    			class="border-r-25 px-2 tx-right n-tx ma-3 clickable mb-0 n-flat tx-lg noborder"
			>
			<span
				@click="setFirstTokenBalancePercent"
				style="width: 100px"
    			class="tx-xs clickable border-r-25 pa-2 tx-center n-tx ma-3 n-flat noborder"
			>
    			Set Percent
    		</span> -->