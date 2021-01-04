<template>
  <div>
    <Nav></Nav>
    <!-- 报销待审详情  审批-->
    <div class="tabBar">
      <van-tabs v-model="activeName">
          <van-tab v-for="(tabData,index) in tabName" :key="index" :title="tabData.name" >
          <div class="line"></div>
            <van-loading v-if="!haveData" size="24px" style="margin-top: 1rem;" vertical>加载中...</van-loading>
            <component v-if="haveData" v-show="index === index" :index="activeName" :is="active" :dataObject="chargeObject" :flow="instanceId" />
          </van-tab>
      </van-tabs>
    </div>   

  </div>
</template>
<script>
import Nav from "../common/navbar";
import { useoptionChian} from '@/core/common'
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
      chargeObject:{}, //详情数据
      haveData: false, // 是否有数据
      instanceId:[], //查询流转信息
    };
  },
  created() {
    this.$route.meta.navBarTxt = this.$route.query.title;
    if (this.$route.query.type) {
       this.active = this.$route.query.type;
       localStorage.setItem('title',this.$route.query.title);
    }else{
      this.$toast("获取详情失败，返回后重新进入");
    }
    this.getTabData(); //基本信息
    this.flow(); //流转信息
  },
  components: {
    Nav,
    PURCHASE: () => import('./expense/PURCHASE.vue'), // 非合同采购 --
    TRAVEL: () => import('./expense/TRAVEL.vue'), // 差旅费  -- 
    MEETING: () => import('./expense/MEETING.vue'), //会议费  --
    DIRECT: () => import('./expense/DIRECT.vue'), //直接报销  -- 
    GENERAL: () => import('./expense/GENERAL.vue'), //一般经费  -- 
    CAR_MAINTENANCE: () => import('./expense/CAR_MAINTENANCE.vue'), //车辆维修保养费 --
    DUTY_SUBSIDY: () => import('./expense/DUTY_SUBSIDY.vue'), //值班,带班补助 --
    ABROAD: () => import('./expense/ABROAD.vue'), //因公出国（境） --
    CAR_WASH: () => import('./expense/CAR_WASH.vue'), //洗车费 --
    OFFICIAL: () => import('./expense/OFFICIAL.vue'), //公务用车经费 公务接待 --
    RENTAL_FEE: () => import('./expense/RENTAL_FEE.vue'), //公务租车 --
    CONTRACT: () => import('./expense/CONTRACT.vue'), //合同资金
    SERVICE: () => import('./expense/SERVICE.vue'), //劳务费 --
    MULTI: () => import('./expense/MULTI.vue'), //多类经费 --
    TRAINING: () => import('./expense/TRAINING.vue'), //培训费 --
  },
  mounted() {
      
  },
  methods: {
    async getTabData(){ //详情信息
      var that = this;
      var dataUrl = `/app/index/reimbursement/get/${that.$route.query.id}`
      var msg = await that.$axios.get(apiAddress+dataUrl)
        if(msg.data.code != 200)return;
        if(that.$route.query.state != 'DONE'){ //如果是已办就跳过
            let traffic = { //差旅费的交通工具转换
              "PLANE":"飞机",
              "TRAIN":"火车",
              "CAR":"汽车",
              "OTHER":"其他",
            }
            let nwevalue = msg.data.data.travelExpenses;
            nwevalue.map((items)=>{
              items.details.map((item)=> {
                item.transportationFacility = traffic[item.transportationFacility]
              })
            })
        }
        if(useoptionChian(msg,'data?.data?.contract?.payments')){
          let payment = { //合同资金状态
            "PAYING":"在途",
            "TO_PAY":"待支付",
            "PAID":"已支付",
            "REIMBURSED":"已报销",
            "REIMBURSEMENT":"报销中",
          }
          msg.data.data.contract.payments.map((items)=>{
            items.paymentStr = payment[items.paymentState]
            items.amount = items.amount.toFixed(2)
          })
          console.log(msg.data.data.contract.payments,100)
        }
        localStorage.setItem('details',JSON.stringify(msg.data.data));
        that.chargeObject = msg.data.data;
        that.haveData = true;
    },
    flow(){ //流转信息 --流程图
      this.$axios.get(apiAddress+`/app/index/workflow/users?instanceIds=${this.$route.query.instanceId}`).then((res)=>{
          console.log(res)
          if(res.data.code != 200)return;
          this.instanceId = res.data.data.reverse();
      })
    }

     
  },
};
</script>
<style lang="css" scoped>
.tabBar /deep/ .van-tabs--line .van-tabs__wrap {
  height: 1rem;
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