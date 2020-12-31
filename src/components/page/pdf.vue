<template>
   <div id="page">
      <Nav></Nav>
      <div>pdf</div>
      <!-- <div @click="toPdf">pdf</div> -->
  <div class="pdfBox">
        <!-- <pdf :src="this.linkurl" :page="currentPage" ></pdf> -->
        <img :src="this.linkurl" alt="">
  </div>
  </div>
</template>
<script>
import pdf from 'vue-pdf'
import Nav from '../common/navbar';
export default {
    name: 'pdf',
    data() {
        return {
            currentPage: 1, // pdf文件页码
            pageCount: 12, // pdf文件总页数
            linkurl:'',
            
        }
    },
    created() {
        this.$route.meta.navBarTxt = this.$route.query.title;
        this.linkurl = this.$route.query.linkurl;
    },
    components: {
        pdf,
        Nav,
    },
    mounted(){

    },
    methods:{

    }

}
</script>
<style lang="css" scoped>


</style>