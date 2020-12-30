<template>
  <div>
      <!--  -->
       <van-search
            v-model="value"
            shape="round"
            class="search"
            placeholder="请输入搜索关键词"
            @clear="onClear"
            @search="onSearch"
        
        />
  </div>
</template>

<script>
export default {
  name:'search',
    data() {
        return {
          value:'',
        }
    },
    mounted() {
        
    },
    methods: {
       onClear(val){
          this.value = '';
       },
       onSearch(val){
        // 执行父元素的方法dataName    this.value传的参数
          this.$emit('dataName',this.value,'children');
       }

    },

}
</script>
<style scoped>
.search{
    padding: 0.36rem 0.2rem 0 0.2rem;
    background-color: #ffffff;
}

</style>