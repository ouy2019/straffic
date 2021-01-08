<template>
<div id="page">
  <div class="shixiang" v-show="index == 0">
    <!-- 值班,带班补助  事项详情-->
    <div class="detail">
      <div class="title"><img :src="shixiangIcon" alt="" srcset="" class="sxIcon" />事项详情</div>
      <van-cell-group :border="false">
        <van-cell :border="false" title="报销单号" :value="dataObject.reimbursement.code" size="small" class="text_l" />
        <van-cell :border="false" title="单位名称" :value="dataObject.reimbursement.unit.name" size="small" class="text_l" />
        <van-cell :border="false" title="申请部门" :value="dataObject.reimbursement.department.name" size="small" class="text_l" />
        <van-cell :border="false" title="申请人" :value="dataObject.reimbursement.declarer.name" size="small" class="text_l" />
        <van-cell :border="false" title="申请时间" :value="dataObject.reimbursement.applyDate" size="small" class="text_l" />
        <van-cell :border="false" title="支出事由" :value="dataObject.reimbursement.reason" size="small" class="text_l" />
        <van-cell :border="false" title="事前业务标题" :value="dataObject.paymentReport.title" size="small" class="text_l" />
        <van-cell :border="false" title="事前申请单号" :value="dataObject.reimbursement.paymentReportCode" size="small" class="text_l"  />
        <van-cell :border="false" title="事前资金申请金额(元)" :value="dataObject.paymentReport.total | num" size="small" class="text_l" />
        <van-cell :border="false" title="报销总额(元)" :value="dataObject.reimbursement.amount | num" size="small" class="text_l"  />
      </van-cell-group>
    </div>
    <div class="line"></div>
    <!--  指标信息 -->
    <div class="travel " v-if="!dataObject.indices.length == ''">
      <div class="margin">
        <div class="title"><img :src="zhibiaoxinxi" alt="" srcset="" class="sxIcon" />指标信息</div>
        <div class="indicator">
          <el-table :data="dataObject.indices" style="width: 100%">
            <el-table-column prop="reportIndex.index.projectName" label="项目名称" ></el-table-column>
            <el-table-column prop="reportIndex.index.largeProjectName" label="支出明细" ></el-table-column>
            <el-table-column prop="reportIndex.index.allocationAmount" label="指标余额"></el-table-column>
            <el-table-column prop="applyAmount" label="申请金额"></el-table-column>
          </el-table>
          <div class="total">合计:{{dataObject.reimbursement.amount | num}}</div>
        </div>
      </div>
      <div class="line"></div>
      <!-- 收款明细 -->
      <div class="details margin">
        <div class="title"><img :src="shixiangIcon" alt="" srcset="" class="sxIcon" />收款明细</div>
        <van-collapse v-model="details">
          <van-collapse-item title="收款人明细" name="1">
            <el-table :data="dataObject.details" style="width: 100%">
              <el-table-column prop="bankAccount" label="收款人" ></el-table-column>
              <el-table-column prop="collectionUserByNonUnit" label="非本单位收款人" ></el-table-column>
              <el-table-column prop="totalAmount" label="金额(元)"></el-table-column>
            </el-table>
            <div class="total">合计:{{dataObject.reimbursement.amount | num}}</div>
          </van-collapse-item>
        </van-collapse>
      </div>
    </div>

    <div class="line"></div>
    <!-- 去审批 -->
    <div v-if="!state" class="shenpiBtn">
      <van-button class="info" type="info" @click="openNewOption">去审批</van-button>
    </div>
  </div>

  <div v-show="index == 1" class="back">
    <van-empty description="暂无数据" v-if="flow.length == ''" />
      <div class="step" v-for="(item,index) in flow" :key="index">
          <div :class="index ==0 ? 'select' : 'stepList'">
              <div class="content">
                  <div class="title flex">
                      <div class="appay">{{item.name}}</div>
                      <div class="time">{{item.beginDate}}</div>
                  </div>
                  <div class="user flex">
                      <div class="userName">审核人：{{item.userName}}</div>
                  </div>
                  <div class="option flex">
                      <div class="optionS">意见：{{item.advice}}</div>
                  </div>
              </div>
              <div :class="index > -1 && index < flow.length - 1 ? 'setp_line' :  '' "></div>
            </div>
      </div>

  <div style="height:1rem"></div>
  </div>

  <div v-show="index == 2" class="back">
    <van-empty description="暂无数据" v-if="dataObject.attaches.length == ''" />
      <div v-for="(item,index) in dataObject.attaches" :key="index">
        <div class="file" v-for="(items,index) in item.files" :key="index" @click="gofilespage(items.originalName,items.name)">
          <img :src="activeIcon0" class="fileIcon" />
          <div class="fileNmae">{{items.originalName}}</div>
          <van-icon name="arrow" class="rightIcon" />
        </div>
      </div>
  </div>
</div>
</template>
<script>
import "../../../assets/css/details.css";
import { goOption } from '@/core/common.js';
import { useoptionChian} from '@/core/common';
export default {
    props: ["index", "dataObject","flow"],
    data() {
        return {
            shixiangIcon: require("../../../assets/img/shixianxiangqing.png"),
            zhibiaoxinxi: require("../../../assets/img/zhibiaoxinxi.png"),
            activeIcon0: require("../../../assets/img/file.png"),
            activeNames: [""],
            details: [""],
            AcTab: [""],
            title:localStorage.getItem('title'),
            state:false, //判断是否已办
        }
    },
    created() {
      if(this.$route.query.isDone){ //从首页跳转过来判断是否已办
        this.state == this.$route.query.isDone;
      }else{
        // this.state = this.$route.query.state == 'DONE';//事前报销页面跳转过来判断是否已办
        this.state = this.dataObject.reimbursement.state == 'DONE';
      }
      
    },
    components: {},
    mounted(){},
    methods:{
      openNewOption(){ //跳转到下一个处理节点 -- 填写意见
        this.$toast.loading({
          message: '加载中...',
          forbidClick: true,
        });
        if(!this.$route.query.taskId){
          this.$toast("已经在审核中，请勿重新提交！");
          return;
        }
        goOption(this,this.$route.query.taskId,{
            test: false,
            workflowKey: this.$route.query.type,
            variables: this.dataObject
        })
        
      },
      gofilespage(filesName,filesUrl){//调用原生跳转到pdf页面
        this.$toast.loading({
          message: '加载中...',
          forbidClick: true,
        });
        this.$native.loadpage(filesUrl,filesName);
      }
      
    }
}
</script>
<style lang="css" scoped>
#page {
  background-color: #f3f6f9;
  min-height: calc(100vh - 100px);
}

</style>