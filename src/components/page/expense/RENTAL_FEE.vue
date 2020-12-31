<template>
  <div id="page">
     <div class="shixiang" v-show="index == 0">
      <div class="detail">
        <div class="title">
          <img :src="shixiangIcon" alt="" srcset="" class="sxIcon" />
          事项详情
        </div>
        <van-cell-group>
          <van-cell
            title="单位名称"
            :value="dataObject.unit.shortName"
            size="small"
            class="text_l"
          />
          <van-cell
            title="申请部门"
            :value="dataObject.department.shortName"
            size="small"
            class="text_l"
          />
          <van-cell
            title="申请人"
            :value="dataObject.applyUser.name"
            size="small"
            class="text_l"
          />
          <van-cell
            title="申请时间"
            :value="dataObject.applyDate"
            size="small"
            class="text_l"
          />
          <van-cell
            title="申请单号"
            :value="dataObject.code"
            size="small"
            class="text_l"
          />
          <van-cell
            title="支出事由"
            :value="dataObject.title"
            size="small"
            class="text_l"
          />
           <van-cell
            title="事前业务标题"
            value="87654345678"
            size="small"
            class="text_l"
          />
          <van-cell
            title="事前申请单号"
            value="202019999298"
            size="small"
            class="text_l" 
          />
           <van-cell
            title="本次报销(元)"
            value="0"
            size="small"
            class="text_l" 
          />
           <van-cell
            title="总额(元)"
            value="600"
            size="small"
            class="text_l" 
          />
        </van-cell-group>
      </div>
      
     
        <!--公务租车-->
      <div class="direct" v-if="!dataObject.rentalFees.length == ''">
        <div class="line"></div>
       <div class="detail">
         <div class="title"><img :src="shixiangIcon" alt="" srcset="" class="sxIcon" />{{title}} </div>
         <div class="" v-for="(item,index) in dataObject.rentalFees" :key="index">
                <van-cell-group>
                <van-cell
                title="租车供应商"
                :value="item.supplier"
                size="small"
                class="text_l"
                />
                <van-cell
                title="租用车型"
                :value="item.carType"
                size="small"
                class="text_l"
                />
                <van-cell
                title="租金总额"
                :value="item.total"
                size="small"
                class="text_l"
                />
                </van-cell-group>
                <div class="details disbursement">
                    <van-collapse v-model="AcTab">
                    <van-collapse-item title="租车费用信息" name="1">
                            <el-table :data="item" stripe style="width: 100%" >
                                <el-table-column prop="rentDay" label="租用天数" ></el-table-column>
                                <el-table-column prop="price" label="租赁单价(元/天)"></el-table-column>
                                <el-table-column prop="total" label="租金总额(元)"></el-table-column>
                            </el-table>
                    </van-collapse-item>
                    </van-collapse>
                </div>
         </div>
       </div>
      </div>
      
      <div class="line"></div>
      <!--  指标信息 -->
      <div class="travel margin" v-if="!dataObject.rentalFeeIndexes.length==''">
        <div class="title">
          <img :src="zhibiaoxinxi" alt="" srcset="" class="sxIcon" />指标信息
        </div>
        <div v-for="(item,index) in dataObject.rentalFeeIndexes" :key="index"> 
           <van-cell-group>
            <van-cell
              title="项目名称"
              :value="item.index.projectName"
              size="small"
              class="text_l"
            />
            <van-cell
              title="支出明细"
              :value="item.index.largeProjectName"
              size="small"
              class="text_l"
            />
            <van-cell
              title="指标余额"
              :value="item.availableAmount"
              size="small"
              class="text_l"
            />
            <van-cell
              title="申请金额"
              :value="item.amount"
              size="small"
              class="text_l"
            />
            </van-cell-group>
            <div class="details">
                <van-collapse v-model="details">
                  <van-collapse-item title="收款信息" name="1">
                          <el-table :data="dataObject.details" style="width: 100%">
                                  <el-table-column prop="payee.name" label="收款人" ></el-table-column>
                                  <el-table-column prop="collectionUserByNonUnit" label="非本单位收款人" ></el-table-column>
                                  <el-table-column prop="totalAmount" label="金额(元)"></el-table-column>
                          </el-table>
                  </van-collapse-item>
                </van-collapse>
            </div>
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
              <div :class="index === flow.length-1 ? 'select' : 'stepList'">
                  <div class="content">
                      <div class="title flex">
                          <div class="appay">{{item.name}}</div>
                          <div class="time">{{item.beginDate}}</div>
                      </div>
                      <div class="user flex">
                          <div class="userName">审核人：{{item.userName}}</div>
                          <div class="next">下一环节处理人：姚建平</div>
                      </div>
                      <div class="option flex">
                          <div class="optionS">意见：{{item.advice}}</div>
                          <div class="isTrue" v-if="item.enable">同意</div>
                          <div class="ifFalse" v-if="!item.enable">不同意</div>
                      </div>
                  </div>
                  <div :class="index > -1 && index < flow.length - 1 ? 'setp_line' :  '' "></div>
                </div>
          </div>

      <div style="height:1rem"></div>
      </div>

      <div v-show="index == 2" class="back">
        <van-empty description="暂无数据" v-if="dataObject.attaches == ''" />
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
            isEnable:true, //流转信息 亮灯
           
        }
    },
    created() { //SKETCH  UNDONE
      if(this.$route.query.taskId){ //从首页跳转过来判断是否已办
        this.state == this.$route.query.taskId;
      }else{
        this.state = this.$route.query.state == 'DONE';//事前报销页面跳转过来判断是否已办
      }
    },
    components: {

    },
    mounted(){

    },
    methods:{
       openNewOption(){ //跳转到下一个处理节点 -- 填写意见
        this.$toast.loading({
          message: '加载中...',
          forbidClick: true,
        });
        goOption(this,this.$route.query.taskId,{
            test: false,
            workflowKey: this.$route.query.type,
            variables: this.dataObject
        })
      },
      gofilespage(filesName,filesUrl){//调用原生跳转到pdf页面
      console.log(filesName)
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