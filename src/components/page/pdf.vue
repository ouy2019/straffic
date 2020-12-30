<template>
   <div id="page">
      
      <div>pdf</div>
      <!-- <div @click="toPdf">pdf</div> -->
  <div>
        <pdf :src="xieyiUrl" :page="currentPage" ></pdf>
  </div>
  </div>
</template>
<script>
import pdf from 'vue-pdf'
export default {
    name: 'pdf',
    data() {
        return {
            currentPage: 1, // pdf文件页码
            pageCount: 12, // pdf文件总页数
            xieyiUrl:'http://dfs2.520shq.com:80/group1/M00/07/8C/wKgAC18tLD6AVdpKAAJAd0N-Ujo688.pdf',
            
        }
    },
    components: {
     pdf
    },
    mounted(){

    },
    methods:{

    }

}
</script>
<style lang="css" scoped>


</style>