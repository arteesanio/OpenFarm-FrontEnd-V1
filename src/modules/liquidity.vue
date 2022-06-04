
<template>
	<div class="flex-column flex-1 w-100"  >
        
    	<div  class="flex-column border-r-5 pa-3 mt-2 border-r-5 n-inset" v-if="!_tradingUSDToken">
        	<div class="flex">
        		<span v-if="!loading" class="tx-primary  opacity-50">NO SELF LIQUIDITY</span>
    		</div>
    	</div>
    	<div  class="flex-column pt-0 pa-3 mt-2 border-r-5" v-if="_tradingUSDToken">
        	<div class="flex">
	        	<div v-if="!hasLpBalance && !loading">
		        	<div class=" my-2 border-r-15 flex-column letter-s-3 py-1 px-3 tx-success clickable opacity-hover-75 n-flat mx-2" 
		            	@click="getLiquidity(false)"
		            >
		            	{{LANG.mys}} {{LANG.liquiditys}}
		        	</div>
		        </div>
	        	<div v-if="hasLpBalance || loading" class="flex-row">
		        	<div class="clickable opacity-hover-75 my-2 border-r-15 n-flat py-1 px-3 nowrap" 
		            	@click="getLiquidity(false)"
		            >
		        		{{LANG.mys}} {{LANG.liquiditys}}:
		        		<span v-if="!loading && currentLp" class="tx-tertiary">{{currentLp.balance}}</span>
						<i v-if="loading" class="tx-success fas fa-circle-notch spin-spin"></i>
		        	</div>
		        </div>
	        </div>

        	<div class="flex" >
	        	<details v-if="!currentLp && togglers.createPair">
					<summary class="mt-2 clickable opacity-hover-50 tx-xs letter-s-3">Handle Null Pairs</summary>
					<div>
			        	<div v-if="!hasLpBalance && !loading">
				        	<div class=" my-2 border-r-15 flex-column letter-s-3 py-1 px-3 tx-tertiary clickable opacity-hover-75 n-flat mx-2" 
				            	@click="getLiquidity(true)"
				            >
				            	Create Pair
				        	</div>
				        </div>
					</div>
				</details>
	        </div>

        	<div v-if="currentLp ">
				<!-- <span class="mt-2 clickable opacity-hover-50 tx-xs letter-s-3">{{LANG.manage}} {{LANG.liquiditys}}</span> -->
        		<div class=" ma-2 border-r-25">

		        	<div class="flex-row">
		        		<div class="flex-column pa-2 n-flat border-r-15">
		        			<div class="tx-xs tx-primary">{{tokenInputs.token0Amount}} {{tokens[0].id}}</div>
		        			<div class="tx-xs tx-secondary">{{tokenInputs.token1Amount}} {{tokens[1].id}}</div>
		        			<div class="tx-xs tx-secondary">Min: {{parseDecimals(tokenInputs.token1Amount * form.slippage / 100)}}</div>

				        	<div class="flex-around w-100 ">
				        		
						        
					        	<div  v-if="!hasFirstTokenAllowance">
						        	<div
						        		class="clickable opacity-hover-75 my-2 border-r-15 n-flat flex-column tx-xs py-1 px-3 tx-success" 
						            	@click="approveTokenFrom"
						            >
						        		<i v-if="loadings.approveFrom" class="tx-success fas fa-circle-notch spin-spin"></i>
						        		{{LANG.approve}} <br> {{tokens[0].id}}
						        	</div>
						        </div>
						        
					        	<!-- <div  v-if="this.tokens[0].id != this.BASE_TOKEN && hasFirstTokenAllowance">
						        	<div
						        		class="clickable opacity-hover-75 my-2 border-r-15 n-flat flex-column tx-xs py-1 px-3" 
						            	@click="disapproveTokenFrom"
						            >
						        		<i v-if="loadings.approveFrom" class="tx-success fas fa-circle-notch spin-spin"></i>
						        		{{LANG.disapprove}} <br> {{tokens[0].id}}
						        	</div>
						        </div> -->
						        
					        	<div v-if="!hasSecondTokenAllowance">
						        	<div
						        		class="clickable opacity-hover-75 my-2 border-r-15 n-flat flex-column tx-xs py-1 px-3 tx-success" 
						            	@click="approveTokenTo"
						            >
						        		<i v-if="loadings.approveTo" class="tx-success fas fa-circle-notch spin-spin"></i>
						        		{{LANG.approve}} <br> {{tokens[1].id}}
						        	</div>
					        	</div>
						        
					        	<!-- <div  v-if="this.tokens[1].id != this.BASE_TOKEN && hasSecondTokenAllowance">
						        	<div
						        		class="clickable opacity-hover-75 my-2 border-r-15 n-flat flex-column tx-xs py-1 px-3" 
						            	@click="disapproveTokenTo"
						            >
						        		<i v-if="loadings.approveTo" class="tx-success fas fa-circle-notch spin-spin"></i>
						        		{{LANG.disapprove}} <br> {{tokens[1].id}}
						        	</div>
					        	</div> -->
					        	
					        	<!-- <div v-if="!hasLPAllowance">
						        	<div class=" my-2 border-r-15 flex-column tx-xs py-1 px-3 clickable opacity-hover-50 n-flat mx-2" 
						            	@click="approveLiquidity"
						            >
						        		<i v-if="loadings.approveLiquidity" class="tx-success fas fa-circle-notch spin-spin"></i>
						        		{{LANG.approve}} <br> Liquidity
						        	</div>
						        </div>
					        	<div v-if="hasLPAllowance">
						        	<div class=" my-2 border-r-15 flex-column tx-xs py-1 px-3 clickable opacity-hover-50 n-flat mx-2" 
						            	@click="disapproveLiquidity"
						            >
						        		<i v-if="loadings.approveLiquidity" class="tx-success fas fa-circle-notch spin-spin"></i>
						        		{{LANG.disapprove}} <br> Liquidity
						        	</div>
						        </div> -->


					        	<!-- <div class="flex-column flex-align-end pa-3 tx-xs " >
					        		<div class="tx-lg mb-2"> Pool Stats </div>
						        	<div class="tx-end">
						        		<span class="  opacity-50">Total {{tokens[0].id}}: </span>
						        		<br>
						        		<span v-if="currentLp.token0 == tokens[0].address">{{currentLp.token0Reserve}}</span>
						        		<span v-if="currentLp.token0 == tokens[1].address">{{currentLp.token1Reserve}}</span>
							        </div>
						        	<div  class="tx-end">
						        		<span class="  opacity-50">Total {{tokens[1].id}}: </span>
						        		<br>
						        		<span v-if="currentLp.token1 == tokens[0].address">{{currentLp.token0Reserve}}</span>
						        		<span v-if="currentLp.token1 == tokens[1].address">{{currentLp.token1Reserve}}</span>
							        </div>
					        	</div> -->
				        	</div>

				        	<div :class="[hasFirstTokenAllowance && hasSecondTokenAllowance ? 'clickable opacity-hover-75 n-flat' : 'n-flat-disabled nocursor']"
				        		class="mt-1 border-r-15 flex-column tx-xs py-1 px-3" 
				            	@click="addLiquidity"
				            >
				        		{{LANG.buy}} {{LANG.liquiditys}}
				        	</div>
		        		</div>
			        	<div class="mx-1"></div>
		        		<div class="flex-column pa-2 n-flat border-r-15">
				        	<div  @click="setMaxLp" class="clickable tx-tertiary tx-xs opacity-hover-75 border-b-1-tertiary">
					        	<span >{{currentLp.balance}} {{LANG.liquiditys}}</span>
					        </div>
			        		<input
			        			v-model="form.exitLiquidity"
			        			style="max-width: 120px;"
			        			type="string" name="" placeholder="0.0"
			        			class="border-r-5 px-2 py-1 tx-right n-tx my-2  n-inset noborder"
		        			>
				        	<div class="clickable opacity-hover-75  border-r-15 n-flat flex-column tx-xs py-1 px-3" 
				            	@click="exitLiquidity"
				            >
				        		{{LANG.sell}} {{LANG.liquiditys}}
				        	</div>
			        	</div>
		        	</div>
		        	<div class="tx-center mt-2 tx-xs opacity-75 letter-s-3">{{LANG.slippage}} ({{LANG.liquiditys}})</div>
		        	<div class="flex-row n-flat border-r-25 pa-2 ma-2">
			    		<input type="range" min="1" max="100" step="0.2" v-model="slippageSlider" class="nosaturation">
			    		<input
			    			v-model="form.slippage"
			    			type="text" name="" min="0" max="100"
			    			style="width: 50px"
			    			class="border-r-5 px-2 py-1 tx-right n-tx  n-inset mx-2 noborder opacity-hover-75 clickable"
						>
					</div>
		        	<!-- <div class="flex-column flex-align-end opacity-50 tx-xs " >
		        		{{currentLp.token0}}
		        		{{currentLp.token1}}
		        	</div> -->
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

        BASE_USD_ID()            { return this.$store.getters.BASE_USD_ID },
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
	        _tradingUSDToken() {
	      	return this.tokens[0].id == this.BASE_USD_ID || this.tokens[1].id == this.BASE_USD_ID
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
                if (!this.hasFirstTokenAllowance) { return }
                if (!this.hasSecondTokenAllowance) { return }
				// if (this.tokenInputs.token0Amount < 0.000001 || this.tokenInputs.token1Amount < 0.000001) { return alert("too low er")}
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
				if (this.tokenInputs.token0Amount < 0.000001 || this.tokenInputs.token1Amount < 0.000001) { return alert("too low ass")}
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