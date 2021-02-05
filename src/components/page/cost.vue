<template>
   <div id="page">
    <Nav></Nav>
    <!-- 事前申请待审详情 审批--> 
    <div class="tabBar">
      <van-tabs v-model="activeName">
          <van-tab v-for="(tabData,index) in tabName" :key="index" :title="tabData.name" >
              <div class="line"></div>
              <van-loading v-if="!haveData" size="24px" style="margin-top: 1rem;" vertical>加载中...</van-loading>
              <component v-if="haveData" v-show="index === index" :index="activeName" :is="active" :dataObject="costObject" :flow="instanceId" />
          </van-tab>
      </van-tabs>
    </div>
  </div>
</template>
<script>
import Nav from '../common/navbar';
import { useoptionChian} from '@/core/common';
import { pageChange } from '@/core/test';
export default {
    data() {
        return {
          activeName:0,
          tabName:[
              {name:'基本详情'},
              {name:'流转信息'},
              {name:'附件信息'},
          ],
         active:'',
         costObject:{}, //详情数据
         haveData:false, // 是否有数据
         instanceId:[], //查询流转信息  
        }
    },
    created(){
        this.$route.meta.navBarTxt = this.$route.query.title;
        if (this.$route.query.type) {
          this.active = this.$route.query.type;
        }else{
          this.$toast("获取详情失败，返回后重新进入");
        }
        
    },
    components: {  //
      Nav,
      TRAVEL: () => import('./cost/TRAVEL.vue'), // 差旅费 --
      MEETING: () => import('./cost/MEETING.vue'), //会议费 --
      GENERAL: () => import('./cost/GENERAL.vue'), //一般经费 --
      CAR_MAINTENANCE: () => import('./cost/CAR_MAINTENANCE.vue'), //车辆维修保养费 --
      DUTY_SUBSIDY: () => import('./cost/DUTY_SUBSIDY.vue'), //值班,带班补助 --
      ABROAD: () => import('./cost/ABROAD.vue'), //因公出国（境） --
      CAR_WASH: () => import('./cost/CAR_WASH.vue'), //洗车费 --
      OFFICIAL: () => import('./cost/OFFICIAL.vue'), //公务用车经费 --
      RENTAL_FEE: () => import('./cost/RENTAL_FEE.vue'), //公务租车 --
      SERVICE: () => import('./cost/SERVICE.vue'), //劳务费 --
      MULTI: () => import('./cost/MULTI.vue'), //多类经费 --
      TRAINING: () => import('./cost/TRAINING.vue'), //培训费 --
       
    },
    mixins:[pageChange],
    mounted(){
      this.getTabData(); //基本信息
      this.flow(); //流转信息
      this.onShow();
      this.onHide();
    },
    methods:{
      onShow(){
        console.log('onShow');//监听是否离开页面
        this.getTabData(); //详情基本信息
      },
      onHide(){
          console.log('onHide',111);
      },
     async getTabData(){
        var that = this;
        var msg = await this.$axios.get(apiAddress+`/app/index/reports/${this.$route.query.id}`)
        if(msg.data.code != 200)return;
        if(useoptionChian(msg,'data?.data?.travelExpenses')){
          let traffic = { //差旅费的交通工具转换
            "PLANE":"飞机",
            "TRAIN":"火车",
            "CAR":"汽车",
            "OTHER":"其他",
          }
          let travel = {
            "MEETING":"会议",
            "TRAINING":"培训",
            "EXAMINE":"督导检查",
            "OTHER":"其他",
          }
          let nwevalue = msg.data.data.travelExpenses;

          nwevalue.map((itemA)=>{
          
            itemA.travelReason = travel[itemA.travelReason]
          
          })

          nwevalue.map((items)=>{
            items.paymentDetails.map((item)=> {
            item.transportationFacility = traffic[item.transportationFacility]
            })
          })
        }
        localStorage.setItem('details',JSON.stringify(msg.data.data));
        that.costObject = msg.data.data;
        that.haveData = true;
      },
      flow(){ //流转信息 --流程图
        this.$axios.get(apiAddress+`/app/index/workflow/users?instanceIds=${this.$route.query.instanceId}`).then((res)=>{
            if(res.data.code != 200)return;
            this.instanceId = res.data.data.reverse();
        })
    }
    }

}
</script>
<style lang="css" scoped>
.tabBar{
  padding-top: 0.88rem;
}
.tabBar /deep/ .van-tabs--line .van-tabs__wrap {
  height: 1rem;
  position: fixed;
  width: 100%;
  z-index: 9999;
  top: 0.88rem
}
.tabBar /deep/ .van-tabs__content{
  padding-top: 1rem;
}
.tabBar /deep/ .van-tabs__line{
  width: 1rem;
  background-color: #1890ff;
}
.line {
  height: 0.2rem;
  background-color: #f3f6f9;
}
</style>