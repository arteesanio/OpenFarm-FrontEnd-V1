<template>
    <div>
        <div class="flex-column flex-lg2x-row">
            <div class="flex-center flex-1 my-8" style="min-width: 300px; " v-if="!accs_length">
                <span @click="connectWallet"
                     class="clickable opacity-hover-75 mx-2 pa-6 border-r-15 n-conve tx-xl mt-8 letter-s-15 tx-center"
                >
                    {{LANG.connect}} <br> {{LANG.wallet}}
                </span>
            </div>

            <exchange ref="exchange"/>
            
        </div>
        <div class="w-100 flex-center" v-if="loading">
            <infispinner />
        </div>

        <!-- <farms v-if="accs_length" /> -->
        <tx-maker v-if="accs_length" />

    </div>
</template>
<script>
    import infispinner from "../components/infispinner.vue";
    import newItem from "../components/new-item.vue";
    import exchange from "./exchange.vue";
    import txMaker from "./tx-maker.vue";

    export default {
        name: 'home-page',     
        components: {
            infispinner,

            exchange,
            txMaker,

            newItem,
        },
        data() {
            return {
                loading: false,
            };
        }, 
        computed: {
            LANG()                  { return this.$store.getters.LANG },
            accs_length()           { return this.$store.getters.accs_length },
            
            articles() {
                return this.$store.getters.articles;
            },
        },
        methods: {
            async connectWallet() {
                await this.$store.dispatch("connectWallet")
                this.$refs.exchange.getAccountBalances(true)
            },
        },
    }
</script>
