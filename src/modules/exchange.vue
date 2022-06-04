<template>
	<div class="flex-column flex-1">
		<div class="flex-align-start flex-justify-start flex-1 flex-column flex-xl2x-row my-5">
			<markets v-if="accs_length && configEditToggle" ref="markets" :loadup="loading"/>
			<!-- <markets class="show-xl_x" v-if="accs_length && configEditToggle" ref="markets" :loadup="loading"/> -->

		    <div class="flex-wrap flex-align-start flex-1 w-100" style="position: relative;">


				<div class="flex-between" style="width: 420px">
					<span class="tx-lg nowrap opacity-25 flex-1 tx-center" :class="[accs_length ? 'mr-8' : '']" >
						{{LANG.exchange}}
					</span>
					<div class="flex" v-if="accs_length">
			        	<div v-if="accs_length" @click="getTradeData" class="pa-2"
				        	:class="[ loading ? 'opacity-50 noclick' : 'clickable opacity-hover-50' ],
			        				[(!loading && _secondInputIs0 ) ? 'tx-success' : '']"
		    			>
			                <div v-if="loading"><i class="fas fa-circle-notch spin-nback"></i></div>
				            <i v-if="!loading" class="n-tx-s fas fa-sync"></i>
			        	</div>
			        	<div v-if="accs_length " @click="editConfig"
			        		class="pa-2 clickable opacity-hover-50"
		        		>
				            <!-- <i v-else class="fas fa-cubes"></i> -->

		        			<!-- <i v-if="configEditToggle" class="fas fa-times-circle"></i> -->
				            <!-- <i v-else class="fas fa-cog"></i> -->

		        			<i v-if="configEditToggle" class="fas fa-tasks"></i>
				            <i v-else class="fas fa-sliders-h"></i>
			        	</div>
					</div>
				</div>
				<span class="w-100"></span>
		    	<!-- <span v-if="!loading && _bothInputsAre0" class="w-100 mb-4 tx-success tx-xs mt-3 opacity-75 tx-center">
		    		{{LANG.help_inputAmount}}
		    	</span> -->
		        <token-input ref="token0ref" :index="0" :token="tokens[0]" :parentload="loading"
		        	@updateInputAmount="token0amount = $event"
	        	/>
		        <div class="flex-column">
		        	<!-- <div v-if="accs_length && !loading" @click="editConfig"
		        		class="pa-2 clickable opacity-hover-50"
	        		>
	        			<i v-if="configEditToggle" class="fas fa-cube"></i>
			            <i v-else class="fas fa-cubes"></i>
		        	</div> -->
		        	<div @click="reverseToken" class="pa-2" 
		        		:class="[ loading ? 'opacity-50 noclick' : 'clickable opacity-hover-75' ]"
	        	 	>
		                <div v-if="loading"><i class="fas fa-circle-notch spin-spin"></i></div>
			            <!-- <i v-if="!loading" class="n-tx-s fas fa-sync"></i> -->
			            <i v-if="!loading" class="fas fa-exchange-alt"></i>
		        	</div>
		        	<!-- <div v-if="accs_length" @click="getTradeData" class="pa-2"
			        	:class="[ loading ? 'opacity-50 noclick' : 'clickable opacity-hover-50' ],
		        				[(!loading && _secondInputIs0 ) ? 'tx-success' : '']"
	    			>
		                <div v-if="loading"><i class="fas fa-circle-notch spin-nback"></i></div>
			            <i v-if="!loading" class="n-tx-s fas fa-calculator"></i>
		        	</div> -->
		        	<!-- <span v-if="accs_length && !loading && _someTokenNeedsBalance"
		        		@click="refreshData"
		        		class="tx-success tx-xs my-3 opacity-hover-75 tx-center clickable"
	        		>
		        		<i  class="tx-xl n-tx-s fas fa-solid fa-coins"></i>
		        	</span> -->
		        	<span v-if="accs_length && (loading)"
		        		class="text-center tx-success tx-xs mt-3 opacity-75 tx-center"
	        		>
		        		<small class="tx-center tx-sm tx-success">loading...</small>
		        	</span>
		        	<span v-if="accs_length && (loading)" @click="loading = false"
		        		class="clickable text-center tx-error tx-xs mt-3 opacity-hover-50 tx-center"
	        		>
		        		<small class="tx-center tx-sm tx-error">cancel <br> load</small>
		        	</span>
		        </div>
		        <token-input ref="token1ref" :index="1" :token="tokens[1]" :parentload="loading"
		        	@updateInputAmount="token1amount = $event"
	        	/>
				<div v-if="accs_length" class="w-100 flex-column">
		        	<!-- <hr class="w-50 opacity-5"> -->
		        	<div class="flex-center tx-sm">
		        		<span>{{LANG.trade}}</span>
			        	<span class="tx-primary mx-2 tx-center">
			        		{{token0amount ? token0amount : "..."}} <br> <small>{{tokens[0].id}}</small>
			        	</span>
			        	<span class="">{{LANG.for}}</span>
		        		<span class="w-100 flex-1 tx-center tx-secondary mx-2 tx-center">
		        			{{token1amount ? token1amount : "..."}} <br> <small>{{tokens[1].id}}</small>
		        		</span>
			        	<div class="flex-center">
				            <div class="clickable opacity-hover-75 my-2 border-r-25 n-flat flex-column py-2 px-3" 
				            	v-if="	!loading > 0 &&
			    						_bothInputsAreSomething &&
			    						_hasFirstTokenAllowance"
				            	@click="makeTrade"
				            >
				        		{{LANG.confirm}}
				        	</div>
				            <div class="noclick opacity-50 my-2 border-r-25 n-flat-disabled flex-column py-2 px-3" 
				            	v-if="loading || token0amount == 0 || token1amount == 0 || !_hasFirstTokenAllowance" 
				            >
					        	<span class="tx-sm opacity-50 ">
					        		{{LANG.confirm}}
					        	</span>
				        	</div>
				        </div>
		    		</div>
		        </div>


				<liquidity v-show="accs_length && configEditToggle" ref="liquidity"
					:tokenInputs="{token0amount,token1amount}" :loadup="loading" class="mt-8"
				/>

	        	<div v-if="!accs_length" class="mt-2 w-100 tx-center">
	        		<span class="tx-sm opacity-50">
		        		{{LANG.connectToContinue}}...
	        		</span>
	        	</div>
		    	<!-- <span v-if="accs_length && !loading && _secondInputIs0"
		    		class="w-100 tx-success tx-xs mt-3 opacity-75 tx-center">
		    		{{LANG.help_calculator}}
		    	</span> -->
		        <!-- <div v-if="accs_length" class="w-100 flex-column">
		        	<hr class="w-50 opacity-5">
		        	<span>{{LANG.trade}}</span>
		        	<div class="flex-center ">
			        	<span class="tx-primary mx-2">
			        		{{token0amount ? token0amount : "..."}} <small>{{tokens[0].id}}</small>
			        	</span>
			        	<span class="">{{LANG.for}}</span>
		        		<span class="w-100 flex-1 tx-center tx-secondary mx-2">
		        			{{token1amount ? token1amount : "..."}} <small>{{tokens[1].id}}</small>
		        		</span>
			        </div>
		        	<div class="flex-column">
			        	<div class="flex-center">
				            <div class="clickable opacity-hover-75 my-2 border-r-15 n-flat flex-column py-3 px-6" 
				            	v-if="	!loading > 0 &&
			    						_bothInputsAreSomething &&
			    						_hasFirstTokenAllowance"
				            	@click="makeTrade"
				            >
				        		Confirm
				        	</div>
				            <div class="noclick opacity-50 my-2 border-r-15 n-flat flex-column py-3 px-6" 
				            	v-if="loading || token0amount == 0 || token1amount == 0 || !_hasFirstTokenAllowance" 
				            >
					        	<span class="tx-sm opacity-50 ">
					        		Confirm
					        	</span>
				        	</div>
				        </div>
		    		</div>
		        </div>
	        	<div v-if="!accs_length" class="mt-2 w-100 tx-center">
	        		<span class="tx-sm opacity-50">
		        		{{LANG.connectToContinue}}...
	        		</span>
	        	</div> -->
			</div>

			<settings v-show="accs_length && configEditToggle" ref="settings"
				:tokenInputs="{token0amount,token1amount}" :loadup="loading" 
			/>

	    	<!-- <markets class="show-xs_lg" v-if="accs_length && configEditToggle" ref="markets2" :loadup="loading"/> -->

		</div>
    	<div class="w-100" v-if="accs_length && configEditToggle">
    		<farms  />
    	</div>
	</div>
</template>
<script>
	import { parseDecimals, ERROR_HELPER } from '../store/helpers';
    import tokenInput from "../components/token-input.vue";
    import settings from "../modules/settings.vue";
    import liquidity from "../modules/liquidity.vue";
    import markets from "../components/markets.vue";
    import farms from "../modules/farms.vue";

	export default {   
		data() {
			return {
				configEditToggle: false,
				token0amount: 0,
				token1amount: 0,
                loading: false,
                loadings: {},
			}
		},
        components: {
        	farms,

        	settings,
        	liquidity,
        	markets,
            tokenInput,
        },
	    computed: {
            LANG()                  { return this.$store.getters.LANG },
	        first_acc()         	{ return this.$store.getters.first_acc },
	        accs_length()     		{ return this.$store.getters.accs_length },
	        
	        BASE_TOKEN()            { return this.$store.getters.BASE_TOKEN },
	        token_list()            { return this.$store.getters.token_list },
	        tokens() 				{ return this.$store.getters.tokens },

	        _hasFirstTokenAllowance() {
	            // if (!this.first_acc) return false
	            if (this.tokens[0].id == this.BASE_TOKEN) return true
	            return this.first_acc.allowances[this.tokens[0].address] > 0;
	        },

	        // CONDITIONAL RENDERING
	        _bothInputsAreSomething()
	        {
	        	return 	this.accs_length &&
	        			this.first_acc.balances[this.tokens[0].id] &&
	        			(
	        				(this.token0amount > 0) &&
	        				(this.token1amount > 0)
        				)
	        },
	        _bothInputsAre0()
	        {
	        	return 	this.accs_length &&
	        			this.first_acc.balances[this.tokens[0].id] &&
	        			(
	        				(this.token0amount == 0 || this.token0amount == "") &&
	        				(this.token1amount == 0 || this.token1amount == "")
        				)
	        },
	        _secondInputIs0()
	        {
	        	return 	this.accs_length &&
	        			this.first_acc.balances[this.tokens[0].id] &&
        				(this.token1amount == 0 || this.token1amount == "")
	        },
	        _someTokenNeedsBalance()
	        {
	        	return  this.first_acc.balances &&
	        			(
	        				typeof this.first_acc.balances[this.tokens[0].id] == "undefined"||
	        				typeof this.first_acc.balances[this.tokens[1].id] == "undefined"
        				)
	        },
		},
		methods: {
			async approveToken0() {
                if (this.loading) { return }
                this.loading = true
				let result = await this.$store.dispatch("approve", {token: this.tokens[0], index: 0} )
                this.loading = false
			},
			async makeTrade() {
                if (this.loading) { return }
				if (this.token0amount < 0.00001 || this.token1amount < 0.00001) { return alert("too low")}
                this.loading = true
				let trade = {token0amount: this.token0amount, token1amount: this.token1amount, slippage: parseFloat(this.$refs.settings.form.slippage)}
				
            	const action = "makeTrade"
	            try {
					let result = await this.$store.dispatch(action, trade)
				} catch (error)
				{
					let errorMeaning = ERROR_HELPER.handleError({action}, error)
					console.log(errorMeaning)
				}
            	this.loading = false
			},
			async editConfig()
			{
				this.configEditToggle = !this.configEditToggle
			},
			async getAccountBalances() {
                if (this.loading) { return } this.loading = true

				await this.$store.dispatch("refreshFirstAccount", true)
				
                this.loading = false
			},
			async getTradeData(refreshBalances = false) {
                if (this.loading) { return } this.loading = true

            	if (this.token0amount == "" || !this.token0amount || this.token0amount == 0)
            	{
	            	this.token0amount = "1"
					this.$refs.token0ref.inputAmount = "1"
				}
				let trade = {token0amount: this.token0amount, token1amount: this.token1amount}
				if (refreshBalances)
				{
					await this.$store.dispatch("refreshFirstAccount", true)
				}
				try {
					let priceResult = await this.$store.dispatch("getTradeData", trade )

					this.token1amount = priceResult + ""
					this.$refs.token1ref.inputAmount = priceResult + ""
				} catch (error)
				{
					if (error == "not ready")
					{
						alert("Proximamente")
					}
					console.log(error)
				}
				
                this.loading = false
			},
			reverseToken() {
                if (this.loading) { return }

				this.$store.dispatch("reverseToken")
				let token1amount = this.token1amount
				this.token1amount = this.token0amount
				this.token0amount = token1amount
				this.$refs.token1ref.inputAmount = this.token1amount
				this.$refs.token0ref.inputAmount = this.token0amount
				// this.getTradeData()
			},
            async refreshData() {
                if (this.loading) { return } this.loading = true

                let result = await this.$store.dispatch("refreshFirstAccount", true)
                this.loading = false
            },
		},
	}
</script>


	        	<!-- <span  @click="getTradeData" class="tx-success tx-xs mt-3 opacity-hover-75 tx-center clickable">
	        		<template v-if="!loading && first_acc.balances[tokens[0].id] && token0amount > 0 && token1amount == 0">
		        		{{LANG.click}} <i  class="n-tx-s tx-xl fas fa-calculator"></i>
		        		<br>
		        		to generate exchange rate
	        		</template>
	        		<template v-if="!loading && (!first_acc.balances[tokens[0].id] && !first_acc.balances[tokens[1].id])">
		        		{{LANG.click}} <i  class="ml-2 n-tx-s tx-xl fas fa-calculator"></i>
		        		<br>
		        		{{LANG.refreshBalance}}
	        		</template>
	        	</span> -->
	        	<!-- <span
	        		v-if="!loading && token0amount && token1amount && !_hasFirstTokenAllowance"
	        		@click="approveToken0"
	        		class="tx-success tx-xs mt-3 opacity-hover-75 tx-center clickable"
        		>
	        		{{LANG.click}} Accept TOS to continue
	        		<br>
	        		(Terms Of Services)
	        	</span> -->