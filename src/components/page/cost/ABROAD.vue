<template>
<div id="page">
  <div class="shixiang" v-show="index == 0">
    <div class="detail">
      <div class="title"><img :src="shixiangIcon" alt="" srcset="" class="sxIcon" />事项详情</div>
      <van-cell-group :border="false">
        <van-cell :border="false" title="申请单号" :value="dataObject.code" size="small" class="text_l" />
        <van-cell :border="false" title="单位名称" :value="dataObject.unit.name" size="small" class="text_l" />
        <van-cell :border="false" title="经办部门" :value="dataObject.department.name" size="small" class="text_l" />
        <van-cell :border="false" title="经办人" :value="dataObject.declarer.name" size="small" class="text_l"/>
        <van-cell :border="false" title="申请部门" :value="dataObject.applyDepartment.name" size="small" class="text_l" />
        <van-cell :border="false" title="申请人" :value="dataObject.applyUser.name" size="small" class="text_l" />
        <van-cell :border="false" title="申请时间" :value="dataObject.applyDate" size="small" class="text_l" />
        <van-cell :border="false" title="申请人电话" :value="dataObject.applyPhoneNumber" size="small" class="text_l" />
        <van-cell :border="false" title="是否列入本年度出访计划" :value="dataObject.isVisitPlan ? '是' : '否'" size="small" class="text_l" />
        <van-cell :border="false" title="团组名称" :value="dataObject.title" size="small" class="text_l" />
        <van-cell :border="false" title="组团单位全称" :value="dataObject.groupFullName" size="small" class="text_l"  />
        <van-cell :border="false" title="组团单位主管部门" :value="dataObject.groupDepartment" size="small" class="text_l" />
        <van-cell :border="false" title="出访任务" :value="dataObject.mission" size="small" class="text_l" />
      </van-cell-group>
    </div>
    <!-- 因公出国（境） -->
    <div class="direct" v-if="!dataObject.abroadExpenses.length == ''">
      <div class="line"></div>
      <div class="detail">
        <div class="title"><img :src="zhibiaoxinxi" alt="" srcset="" class="sxIcon" />{{title}}</div>
        <div v-for="(item,index) in dataObject.abroadExpenses" :key="index">
          <div v-if="index >= 1" class="spaceKey"></div>
          <van-cell-group :border="false">
            <van-cell :border="false" title="出访国家和地区" :value="item.country.area+item.regional.area" size="small" class="text_l" />
            <van-cell :border="false" title="开始日期" :value="item.beginDate" size="small" class="text_l" />
            <van-cell :border="false" title="结束日期" :value="item.endDate" size="small" class="text_l" />
            <van-cell :border="false" title="姓名" :value="item.financialPersonnels[0].name" size="small" class="text_l" />
            <van-cell :border="false" title="单位" :value="item.financialPersonnels[0].unit" size="small" class="text_l" />
            <van-cell :border="false" title="职务" :value="item.financialPersonnels[0].post" size="small" class="text_l" />
            <van-cell :border="false" title="备注" :value="item.financialPersonnels[0].remark" size="small" class="text_l" />
          </van-cell-group>
          <!-- 申请财政经费人员名单 -->
          <div class="details disbursement">
              <van-collapse v-model="AcTab">
                <van-collapse-item title="申请财政经费人员名单" name="1">
                  <el-table :data="item.financialPersonnels" style="width: 100%" >
                    <el-table-column prop="name" label="姓名"></el-table-column>
                    <el-table-column prop="unit" label="单位"></el-table-column>
                    <el-table-column prop="post" label="职务"></el-table-column>
                    <el-table-column prop="total" label="行政级别"></el-table-column>
                    <el-table-column prop="remark" label="备注"></el-table-column>
                  </el-table>
                </van-collapse-item>
              </van-collapse>
          </div>
          <!-- 支出详情 -->
          <div class="details disbursement">
              <van-collapse v-model="AcTab">
                <van-collapse-item title="支出详情" name="1">
                  <el-table :data="item.paymentDetails" style="width: 100%" >
                    <el-table-column prop="expenseTypeDetail.name" label="费用类型"></el-table-column>
                    <el-table-column prop="passageAmount" label="申请金额(元)"></el-table-column>
                  </el-table>
                </van-collapse-item>
              </van-collapse>
          </div>
        </div>
        <div class="total">合计: {{dataObject.total | num}}</div>
      </div>
    </div>
    <div class="line"></div>
    <!--  指标信息 -->
    <div class="travel margin" v-if="!dataObject.abroadIndexes.length==''">
      <div class="title"><img :src="zhibiaoxinxi" alt="" srcset="" class="sxIcon" />指标信息</div>
      <div class="indicator">
        <el-table :data="dataObject.abroadIndexes" style="width: 100%">
          <el-table-column prop="index.projectName" label="项目名称" ></el-table-column>
          <el-table-column prop="index.largeProjectName" label="支出明细" ></el-table-column>
          <el-table-column prop="availableAmount" label="指标余额"></el-table-column>
          <el-table-column prop="amount" label="申请金额"></el-table-column>
        </el-table>
        <div class="total">合计: {{dataObject.total | num}}</div>
      </div>
    </div>
    <div class="line"></div>
    <!-- 去审批 -->
    <div class="shenpiBtn">
      <van-button v-if="!state" class="info" type="info" @click="openNewOption">去审批</van-button>
      <van-button v-if="state" disabled class="info" type="info">已提交</van-button>
    </div>
  </div>

  <div v-show="index == 1" class="back">
    <van-empty description="暂无数据" v-if="flow.length == ''" />
      <div class="step" v-for="(item,index) in flow" :key="index">
          <div :class="index == 0 ? 'select' : 'stepList'">
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
            details: ["1"],
            AcTab: ["1"],
            title:'',
            state:false,  //判断已办和待办
        }
    },
    created() {
      this.title = this.$route.query.title;
      this.state = this.dataObject.state == 'DONE';//判断已办和待办
    },
    components: {},
    mounted(){},
    methods:{
      openNewOption(){ //跳转到下一个处理节点 -- 填写意见
        this.$toast.loading({
          message: '加载中...',
          forbidClick: true,
        });
        if(!useoptionChian(this.dataObject,'workflowTask?.id')){
          this.$toast("已经在审核中，请勿重新提交！");
          return;
        }
        goOption(this,this.dataObject.workflowTask.id,{
            test: false,
            workflowKey: this.$route.query.type,
            variables: this.dataObject,
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