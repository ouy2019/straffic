<template>
  <div>
    <van-nav-bar
      :title="$route.meta.navBarTxt" 
      right-text="首页"
      :left-arrow="$route.meta.showBack"
      :class="$route.meta.class" 
      @click-left="onClickLeft"
      @click-right="onClickRight" >
        <!-- <template #right>
            <img v-show="$route.meta.rightIcon" 
                 src="" slot="right" srcset=""
                  class="rightIcon" @click="onClickRight()" />
        </template> -->

    </van-nav-bar>
    <router-view></router-view>
  </div>
</template>

<script>
import '../../jslibs/native/native.js';
export default {
  name:'navbar',
    data() {
        return {
            // rightIcon:require('../../assets/img/yiban.png'),
           
        }
    },
    mounted() {
        
    },
    methods: {
        onClickLeft(){
            this.$native.back();
        },
         onClickRight() {
            this.$router.push('/')
        }
    },

}
</script>
<style scoped>

.bluestyle {
  background-color: #1c92ff !important;
  height: 0.88rem !important;
}
.bluestyle /deep/ .van-nav-bar__title{
  color: #fff !important;
}
.bluestyle /deep/ .van-nav-bar__text{
  color: #fff !important;
}
.bluestyle /deep/ .van-icon{
  color: #fff !important;
}

.whitestyle {
  background-color: #ffffff !important;
  height: 0.88rem !important;
}
.whitestyle /deep/ .van-nav-bar__title{
  color: #1d1d1d !important;
}
.whitestyle /deep/ .van-nav-bar__text{
  color: #1d1d1d !important;
}
.whitestyle /deep/ .van-icon{
  color: #1d1d1d !important;
}




.rightIcon {
  width: 1rem;
  height: 1rem;
}
</style>