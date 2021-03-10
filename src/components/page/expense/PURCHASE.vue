<template>
   <div id="page">
      <!-- 非合同采购 -->
    <div class="shixiang" v-show="index == 0">
      <div class="detail">
        <div class="title"><img :src="shixiangIcon" alt="" srcset="" class="sxIcon" />基本信息</div>
        <van-cell-group :border="false">
          <van-cell :border="false" title="报销单号" :value="dataObject.reimbursement.code" size="small" class="text_l" />
          <!-- <van-cell :border="false" title="单位名称" :value="dataObject.reimbursement.unit.name" size="small" class="text_l" /> -->
          <van-cell :border="false" title="申请部门" :value="dataObject.reimbursement.department.name" size="small"  class="text_l" />
          <van-cell :border="false" title="申请人" :value="dataObject.reimbursement.declarer.name" size="small" class="text_l" />
          <van-cell :border="false" title="申请时间" :value="dataObject.reimbursement.applyDate" size="small" class="text_l" />
          <van-cell :border="false" title="采购申请单号" :value="dataObject.purchaseReport.code" size="small" class="text_l" />
          <van-cell :border="false" title="采购名称" :value="dataObject.purchaseReport.title" size="small" class="text_l" />
          <van-cell :border="false" title="是否最后一笔报销" :value="dataObject.isLastOne = dataObject.isLastOne ? '是' : '否'" size="small" class="text_l" />
          <van-cell :border="false" title="验收结果" :value="dataObject.purchaseReport.purchaseAcceptance[0].acceptanceResult ? '已通过' : '未通过'" size="small" class="text_l" />
          <van-cell :border="false" title="验收说明" :value="dataObject.purchaseReport.reason" size="small" class="text_l" />
          <van-cell :border="false" title="备注" :value="dataObject.reimbursement.reason" size="small" class="text_l" />
        </van-cell-group>
      </div>
      <!--  采购内容明细 -->
      <div class="direct" v-if="!dataObject.purchaseReport.categories.length==''">
        <div class="line"></div>
        <div class="detail">
          <div class="title"><img :src="zhibiaoxinxi" alt="" srcset="" class="sxIcon" />采购信息</div>
          <div class="indicator">
            <el-table :data="dataObject.purchaseReport.categories" style="width: 100%">
              <el-table-column prop="name" label="项目名称" ></el-table-column>
              <el-table-column prop="spec" label="规格型号" ></el-table-column>
              <el-table-column prop="price" label="采购金额"></el-table-column>
              <el-table-column prop="total" label="申请金额"></el-table-column>
            </el-table>
            <div class="total">合计: {{dataObject.reimbursement.amount | num}}</div>
          </div>
        </div>
      </div>
      <div class="line"></div>
      <!-- 收款明细 -->
      <div class="details margin" v-if="dataObject.details">
        <div class="title"><img :src="shixiangIcon" alt="" srcset="" class="sxIcon" />收款明细</div>
        <van-collapse v-model="details">
          <van-collapse-item title="收款人明细" name="1">
            <el-table :data="dataObject.details" style="width: 100%">
              <el-table-column prop="bankAccount" label="收款人" ></el-table-column>
              <el-table-column prop="payee.oaAccount" label="非本单位收款人" ></el-table-column>
              <el-table-column prop="totalAmount" label="金额(元)"></el-table-column>
            </el-table>
            <div class="total">合计: {{dataObject.reimbursement.amount | num}}</div>
          </van-collapse-item>
        </van-collapse>
      </div>
      <div class="line"></div>
      <!-- 去审批 -->
      <div class="shenpiBtn">
        <van-button v-if="dataObject.reimbursement.workflowTask" class="info" type="info" @click="openNewOption">去审批</van-button>
        <!-- <van-button v-if="!dataObject.reimbursement.workflowTask" disabled class="info" type="info">已提交</van-button> -->
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
                      <div class="filePdf"  v-for="(items,indexs) in item.files" :key="indexs">
                        <div class="filePdfName">{{items.originalName}}</div>
                        <van-button round type="info" @click="gofilesPdf(items.originalName,items.name)">预览</van-button>
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
            activeNames: ["1"],
            details: ["1"],
            title:localStorage.getItem('title'),
            state:false, //判断是否已办
            instance:'',
        }
    },
    created() { //SKETCH  UNDONE
      // if(this.$route.query.isDone){ //从首页跳转过来判断是否已办
      //   this.state == this.$route.query.isDone;
      // }else{
      //   // this.state = this.$route.query.state == 'DONE';//事前报销页面跳转过来判断是否已办
      //   this.state = this.dataObject.reimbursement.state == 'DONE';
      // }
    },
    components: {},
    mounted(){},
    methods:{
       openNewOption(){ //跳转到下一个处理节点 -- 填写意见
        this.$toast.loading({message: '加载中...',forbidClick: true,});
      
        localStorage.setItem('opion',this.$route.query.opion)

        //这一步必须。不然流程走不通
        if(this.dataObject.reimbursement.amount){
          this.dataObject.amount = this.dataObject.reimbursement.amount;
        }
        if(this.dataObject.reimbursement.workflowTask.instance){//有流程key才可以提交审批
          this.instance = this.dataObject.reimbursement.workflowTask.instance.definition.workflowInfo.workflowKey;
        }
        goOption(this,this.dataObject.reimbursement.workflowTask.id,{
            test: false,
            workflowKey: this.instance,
            variables: this.dataObject
        })

      },
      gofilespage(filesName,filesUrl){//调用原生跳转到pdf页面
        this.$toast.loading({ message: '加载中...',forbidClick: true,});
        this.$native.loadpage(filesUrl,filesName);
      },
      gofilesPdf(filesName,filesUrl){
        this.$toast.loading({ message: '加载中...',forbidClick: true,});
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
