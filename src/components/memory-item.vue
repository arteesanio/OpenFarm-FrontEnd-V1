<template>
	<div>
		<!-- <h5 class="tx-center ma-0 pa-0">Item</h5> -->
		<div class="flex-center">
      
			<div class="clickable opacity-hover-75 mx-2 my-1 border-r-15 n-inset flex-column">
        <b class="mt-2 opacity-25"><small>{{memory.id}}</small></b>
        <span class="ma-3 pa-1 pb-0 n-flat border-r-100p">
          <img class=" border-r-100p" :src="memory.image" :alt="memory.title" style="max-width: 150px; max-height: 150px" />
        </span>
      </div>
			<!-- <h3 class="clickable opacity-hover-75 mx-2 pa-6 border-r-15 n-conve">{{asd}}</h3>
			<h3 class="clickable opacity-hover-75 mx-2 pa-6 border-r-15 n-inset">zzz</h3> -->
		</div>
	</div>
</template>
<script>

export default {
  props: ["memory", "index"],
  name: 'list-item',     
  components: {
  },
  data() {
    return {
    	asd: "qwe",
    };
  }, 
  computed: {
    memories() {
      return this.$store.getters.memories;
    },
  },
}
</script>
