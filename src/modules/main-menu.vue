<template>
    <div style="position: fixed; z-index: 999; background: linear-gradient(180deg,#00000033, #00000000)" class="w-100">
        <div class="flex-between flex-align-start "> 
            <div class="flex show-xs_sm">
                <social-media />
            </div>
            <div class="flex show-md_x">
                <!-- <a class="nodeco letter-s-3 noborder n-tx tx-lg n-conve clickable flex-center mx-3"
                    href="https://t.me/"  target="_blank"
                    style="border-radius: 0 0 30px 30px"
                >
                    <span class="px-3 pb-4 pt-3 opacity-hover-50">
                        <i class="fab fa-telegram"></i>
                    </span>
                </a> -->
                <a class="nodeco letter-s-3 noborder n-tx tx-md n-flat clickable flex-center"
                    href="https://www.gitbook.com/"  target="_blank"
                    style="border-radius: 0 30px 30px 0"
                >
                    <span class="px-5 pb-4 pt-3 opacity-hover-50">
                        <i class="mr-2 fas fa-external-link-alt"></i> Docs
                    </span>
                </a>
            </div>
            <div class="flex show-md_x" style="position: absolute; left: 50%; transform: translateX(-50%);">
                <social-media />
            </div>
            <div class="flex">
                <button class="noborder n-tx tx-md n-conca clickable flex-center border-r-15 mt-3 mr-3"
                    @click="changeNightMode"
                >
                    <span class="pa-4 opacity-hover-50">
                        <i class="fas fa-moon icon-moon" v-if="dark_mode" ></i>
                        <i class="fas fa-sun icon-sun" v-else ></i>
                    </span>
                </button>
                <button class="noborder n-tx tx-md n-conca clickable flex-center"
                    @click="changeEnglishMode"
                    style="border-radius: 0 0 0 40px"
                >
                    <span class="pa-4 opacity-hover-50">
                        <i class="fas fa-globe" v-if="english_mode" > <span> EN</span></i>
                        <i class="fas fa-globe-americas" v-else > <span> ES</span></i>
                    </span>
                </button>
            </div>
        </div>
    </div>
</template>
<script>
    import socialMedia from '../components/social-media.vue';
    export default {
        name: 'main-menu',    
        components: {
            socialMedia, 
        },
        computed: {
	        dark_mode()            { return this.$store.getters.dark_mode },
	        english_mode()         { return this.$store.getters.english_mode },
	        LANG()                 { return this.$store.getters.LANG },
	        first_acc()            { return this.$store.getters.first_acc },
	        accs_length()          { return this.$store.getters.accs_length },
        },
        created() {
            let darkMode = JSON.parse(localStorage.getItem("darkMode"))
            console.log(darkMode)
            let englishMode = JSON.parse(localStorage.getItem("englishMode"))
            console.log(englishMode)
            if (darkMode != null) { this.$store.dispatch("setDarkMode", darkMode) }
            if (englishMode != null) { this.$store.dispatch("setEnglishMode", englishMode) }
        },
        methods: {
            changeNightMode() {
                let newMode = !this.dark_mode
                localStorage.setItem("darkMode", JSON.stringify(newMode));
                this.$store.dispatch("setDarkMode", newMode)
            },
            changeEnglishMode() {
                let newMode = !this.english_mode
                localStorage.setItem("englishMode", JSON.stringify(newMode));
                this.$store.dispatch("setEnglishMode", newMode)
            },
        },
    }
</script>
