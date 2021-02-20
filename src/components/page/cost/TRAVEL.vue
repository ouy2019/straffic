<template>
<div id="page">
  <div class="shixiang" v-show="index == 0">
    <!-- 差旅费 事项详情-->
    <div class="detail">
      <div class="title"><img :src="shixiangIcon" alt="" srcset="" class="sxIcon" />事项详情</div>
      <van-cell-group :border="false">
        <van-cell :border="false" title="申请单号" :value="dataObject.code" size="small" class="text_l"/>
        <van-cell :border="false" title="单位名称" :value="dataObject.unit.name" size="small" class="text_l" />
        <van-cell :border="false" title="经办部门" :value="dataObject.department.name" size="small" class="text_l" />
        <van-cell :border="false" title="经办人" :value="dataObject.declarer.name" size="small" class="text_l" />
        <van-cell :border="false" title="申请部门" :value="dataObject.applyDepartment.name" size="small" class="text_l" />
        <van-cell :border="false" title="申请人" :value="dataObject.applyUser.name" size="small" class="text_l" />
        <van-cell :border="false" title="申请时间" :value="dataObject.applyDate" size="small" class="text_l" />
        <van-cell :border="false" title="申请人电话" :value="dataObject.applyPhoneNumber" size="small" class="text_l" />
        <van-cell :border="false" title="请示内容" :value="dataObject.content" size="small"  class="text_l" />
        <van-cell :border="false" title="业务标题" :value="dataObject.title" size="small" class="text_l" />
      </van-cell-group>
    </div>
    <!-- 差旅费 -->
    <div class="direct" v-if="dataObject.travelExpenses && !dataObject.travelExpenses.length==''">
      <div class="line"></div>
      <div class="detail">
        <div class="title"><img :src="shixiangIcon" alt="" srcset="" class="sxIcon" />{{title}}</div>
        <div class="" v-for="(item,index) in dataObject.travelExpenses" :key="index">
            <div v-if="index >= 1" class="spaceKey"></div>
            <van-cell-group :border="false">
            <van-cell :border="false" title="出差人员" :value="item.users" size="small" class="text_l" />
            <van-cell :border="false" title="出差地区" :value="item.travelLocation" size="small" class="text_l" />
            <van-cell :border="false" title="出差日期" :value="item.beginDate+'至'+item.endDate" size="small" class="text_l" />
            <van-cell :border="false" title="出差事由" :value="item.travelReason" size="small" class="text_l" />
            </van-cell-group>
            <div class="details disbursement">
                <van-collapse v-model="AcTab">
                  <van-collapse-item title="支出详情" :name="index">
                    <el-table :data="item.paymentDetails" stripe style="width: 100%" >
                      <el-table-column prop="transportationFacility" label="交通工具" ></el-table-column>
                      <el-table-column prop="expenseTypeDetail.name" label="支出类型" ></el-table-column>
                      <el-table-column prop="total" label="申请总金额"></el-table-column>
                    </el-table>
                  </van-collapse-item>
                </van-collapse>
            </div>
        </div>
        <div class="total">合计: {{dataObject.travelExpenseEstimateTotal | num}}</div>
      </div>
    </div>

    <div class="line"></div>
    <!--  指标信息 -->
    <div class="travel margin" v-if="!dataObject.rentalFeeIndexes.length == ''">
      <div class="title">
        <img :src="zhibiaoxinxi" alt="" srcset="" class="sxIcon" />指标信息
      </div>
      <div class="indicator">
        <el-table :data="dataObject.rentalFeeIndexes" style="width: 100%">
          <el-table-column prop="index.projectName" label="项目名称" ></el-table-column>
          <el-table-column prop="index.largeProjectName" label="支出明细" ></el-table-column>
          <el-table-column prop="availableAmount" label="指标余额"></el-table-column>
          <el-table-column prop="amount" label="申请金额"></el-table-column>
        </el-table>
        <div class="total">合计: {{dataObject.travelExpenseEstimateTotal | num}}</div>
      </div>
    </div>
    <div class="line"></div>
    <!-- 去审批 -->
    <div class="shenpiBtn">
      <van-button v-if="dataObject.workflowTask" class="info" type="info" @click="openNewOption">去审批</van-button>
      <van-button v-if="!dataObject.workflowTask" disabled class="info" type="info">已提交</van-button>
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
  <div style="height:1rem;"></div>
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
            title:'',
            state:false, //判断是否已办
        }
    },
    created() {
      this.title = this.$route.query.title;
      this.state = this.dataObject.state == 'DONE';//判断已办和待办
    },
    methods:{
      openNewOption(){ //跳转到下一个处理节点 -- 填写意见
        this.$toast.loading({
          message: '加载中...',
          forbidClick: true,
        });
        // if(!useoptionChian(this.dataObject,'workflowTask?.id')){
        //   this.$toast("已经在审核中，请勿重新提交！");
        //   return;
        // }
        localStorage.setItem('opion',this.$route.query.opion)
        goOption(this,this.dataObject.workflowTask.id,{
            test: false,
            workflowKey: this.$route.query.type,
            variables: this.dataObject,
        });

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
