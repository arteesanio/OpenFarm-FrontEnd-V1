    <template>
    <div class="mx-2 my-1 border-r-25 n-flat flex-column pt-2">
        <!-- <span v-if="accs_length && !parentload && !_invalidInputAmount"
            @click="inputAmount = ''"
            class="tx-xs clickable opacity-hover-25 pb-1"
        >
            {{LANG.clear}}
        </span> -->
      <!-- <span
        class="clickable tx-secondary tx-xs opacity-hover-75 py-1"
        @click="approve" 
        v-if="accs_length &&
              BASE_TOKEN != token.id &&
              !first_acc.allowances[token.address] &&
              index == 0"
      >
        Accept TOS
      </span> -->

      <!-- <span
        class="tx-secondary tx-xs opacity-hover-75"
        v-if="accs_length && first_acc.allowances[token.address]"
      >
        allow: 
        {{first_acc.allowances[token.address]}}
      </span> -->
      
        <input v-model="inputAmount" placeholder="0.0" type="text" name="amount" style="max-width: 110px;"
            class="opacity-hover-75 border-r-5 px-2 tx-right n-tx mt-0 ma-3 n-inset tx-lg noborder"
        />
        <b class=" opacity-25"><small>{{token.id}}</small></b>
        <span v-if="accs_length" @click="setMaxBalance"
             class="clickable  tx-xs opacity-hover-75 pb-1"
             :class="[!index ? 'tx-primary' : 'tx-secondary']"
        >
            {{first_acc.balances[token.id]}}
        </span>
        <b v-if="accs_length && first_acc.balances[token.id] == null" @click="refreshData"
            class="tx-xs tx-tertiary pb-1 clickable" 
        >
            ?
        </b>
        <template v-if="!togglers.tokenList">
            <span @click="TOGGLESHOW_tokenList(true)"
                 class="ma-3 mt-0 pa-1 pb-0 n-flat border-r-100p clickable opacity-hover-50"
            >
                <img :src="token.image" :alt="token.id" style="max-width: 150px; max-height: 150px"
                    class=" border-r-100p"
                />
            </span>
        </template>
        <template v-else>
            <span @click="TOGGLESHOW_tokenList(false)"
                 class="ma-3 mt-0 pa-1 pb-0 n-flat border-r-100p clickable opacity-hover-50"
             >
                <img :src="token.image" :alt="token.id"
                    style="max-width: 50px; max-height: 50px" class="border-r-100p"
                />
            </span>
        </template>
        <div v-if="togglers.tokenList" style="max-width: 150px;" class="flex-wrap">
            <span v-for="(atoken, aindex) in tokensWithoutMe" @click="setToken(atoken)"
                class="pa-1  border-r-5"
                :class="[!parentload ? 'clickable opacity-hover-50' : 'nocursor opacity-25']"
            >
                <img :src="atoken.image" :alt="atoken.id" :title="atoken.id"
                    style="max-width: 28px; max-height: 28px" class="border-r-100p"
                />
            </span>
        </div>
    </div>
</template>
<script>
export default {
    props: ["parentload", "token", "index"],
    name: 'token-input',     
    components: {},
    data() {
        return {
            inputAmount: "",
            togglers: {
                tokenList: false,
            },
        };
    }, 
    computed: {
        LANG()                  { return this.$store.getters.LANG },
        first_acc()             { return this.$store.getters.first_acc },
        accs_length()           { return this.$store.getters.accs_length },
        
        BASE_TOKEN()            { return this.$store.getters.BASE_TOKEN },
        token_list()            { return this.$store.getters.token_list },
        tokensWithoutMe()       { return this.token_list.filter((item) => item.id != this.token.id) },
        _invalidInputAmount()   { return this.inputAmount == 0 || this.inputAmount == '' }
    },
    methods: {
        setMaxBalance() { this.inputAmount = this.first_acc.balances[this.token.id] + "" },
        TOGGLESHOW_tokenList(boolean) { this.togglers.tokenList = boolean },
        setToken(token) {
            if (this.parentload) return

            this.$store.dispatch("setToken", { token, index: this.index })
            this.togglers.tokenList = false
        },
        refreshData() {
            this.$parent.refreshData()
            // if (this.loading) { return } this.loading = true

            // let result = await this.$store.dispatch("refreshFirstAccount", true)
            // this.loading = false
        },


        async approve(token) {
            this.$parent.loading = true;
// 
            let result = await this.$store.dispatch("approve", { token: this.token, index: this.index })
            .then(async (res) => {
                console.log("a res!", res);
            }).catch((err) => {
                console.log("failed something", err);
            })
// 
            this.$parent.loading = false;
        },
    },
    watch: {
        inputAmount(newVal, oldVal)
        {
            this.$emit("updateInputAmount", newVal)
        },
    },
}
</script>

    <!-- <div class="n-flat border-r-25 mt-2" v-if="toggleToken" >
      <div class="tx-xs w-100 tx-bold pt-2 flex-around">
        <span>Change Token</span>
        <span class="clickable opacity-hover-75 n-flat border-r-50 px-3 py-2" @click="cancelToggleToken">x</span>
      </div>
      <div class="flex-row" style="max-width: 110px">
        <span v-for="(atoken, aindex) in tokensWithoutMe" class="pa-1  border-r-5 clickable opacity-hover-50 "
          @click="setToken(atoken)"
        >
          <img class="border-r-100p" :src="atoken.image" :alt="atoken.id" style="max-width: 20px; max-height: 20px" />
        </span>
      </div>
    </div> -->

          <!-- <small class="tx-xs">{{atoken.id}}</small> -->

      <!-- <small class=" opacity-75 letter-s-5 mt-3" :class="[!!index ? 'tx-primary' : 'tx-secondary']">{{ LANG[["from","to"][index]]}}</small> -->
