<template>
	<div>
		<!-- <h5 class="tx-center ma-0 pa-0">Item</h5> -->
		<div class="flex-center">
      
			<div class="clickable opacity-hover-75 mx-2 my-1 border-r-15 n-inset flex-column flex-align-end pa-5">
        <b class="mt-2 opacity-25">{{article.title}}</b>
        <span class="mt-2 opacity-25">{{article.description}}</span>
      </div>
			<!-- <h3 class="clickable opacity-hover-75 mx-2 pa-6 border-r-15 n-conve">{{asd}}</h3>
			<h3 class="clickable opacity-hover-75 mx-2 pa-6 border-r-15 n-inset">zzz</h3> -->
		</div>
	</div>
</template>
<script>

export default {
  props: ["article", "index"],
  name: 'new-item',     
  components: {
  },
  data() {
    return {
    	asd: "qwe",
    };
  }, 
  computed: {
    // memories() {
    //   return this.$store.getters.memories;
    // },
  },
}
</script>
