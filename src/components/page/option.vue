<template>
<div id="page">
    <Nav />
    <div class="line"></div>
    <van-form @submit="onSubmit">
        <div class="box">
            <div class="send">
                <div v-for="(item,index) in listDataNode" :key="index">
                    <van-radio-group v-model="send" >
                    <div v-if="item.nextNodeFlag == 'GENERAL'" class="nextNodeBox">
                        <div class="back">下一节点 : </div>
                        <van-radio :name="item.nextNodeFlag">{{item.name}}</van-radio>
                    </div>
                    <div v-if="item.nextNodeFlag == 'BACK_TO_START'" class="nextNodeBox">
                        <div class="back">退回节点 : </div>
                        <van-radio :name="item.nextNodeFlag">{{item.name}}</van-radio>
                    </div>
                    </van-radio-group>
                </div>
            </div>
        
            <div class="handler title">下一环节处理人</div>
            <div class="value" v-if="send === 'GENERAL'">
                <van-dropdown-menu >
                    <van-dropdown-item v-model="value2" :options="option2" />
                </van-dropdown-menu>
            </div>
            <div class="option title">
                  <span>审批意见</span>
                  <span class="popup" @click="showPopup">常用意见</span>
            </div>
            <div class="optionContent">
                <van-popup v-model="show">
                       <div class="optionPopup">
                           <div class="optionTitle">
                               <span>常用审批意见</span>
                               <span class="close" @click="close">x</span>
                            </div>
                           <div class="optionSelect">
                               <van-radio-group v-model="optionSelect" v-for="(item,index) in optionText" :key="index">
                                    <van-radio :name="item.opinion"  @click="radioClick">{{item.opinion}}</van-radio>
                                    <!-- <van-radio name="b">不同意</van-radio> -->
                                </van-radio-group>
                           </div>
                           <div class="inputDisplay" v-show="showHidden">
                                <div class="input">
                                    <van-field v-model="inputValue" clearable  placeholder="请输入常用意见"/>
                                </div>
                                <div class="cancel clickButton" @click="downHidden">取消</div>
                                <div class="preserve clickButton" @click="preserve">保存</div>
                           </div>
                           <div class="addOption" @click="downShow">添加意见</div>
                       </div>
                </van-popup>
            </div>


            
            <div class="textarea">
                <van-field v-model="message" rows="1"  autosize type="textarea" placeholder="请输入内容" />
            </div>  
        </div>
         <div class="bottom">
              <div class="submit">
                 <van-button id="submitLeft" round block type="info" native-type="submit" @click="showSavePopup">保存</van-button>
                 <van-button id="submitRight" round block type="info" native-type="submit" @click="showSubmit">提交</van-button>
               </div>
         </div>
        <div class="showSave">
            <van-popup v-model="showSave">
                <div class="save">
                    <img :src="holdIcon" alt="">
                    <div class="txt">您的待办已保存！</div>
                    <van-button class="btn" round type="info" @click="hold">确定</van-button>
                </div>
            </van-popup>
        </div>
        <div class="showDisplay">
            <van-popup v-model="showDisplay">
               <div class="save">
                    <img :src="succeedIcon" alt="">
                    <div class="txt">您的待办已提交！</div>
                    <van-button class="btn" round type="info" @click="succeed">确定</van-button>
                </div>
            </van-popup>
        </div>
        
   </van-form>
</div>
</template>
<script>
import Nav from "../common/navbar";
import { useoptionChian} from '@/core/common';

export default {
    data() {
        return {
            checked: false,
            send:'1',
            nextNodeFlag:[],//下一环节点数据 
            listDataNode:[], //下一环节点判断后的数据 
            optionSelect:'',//常用意见选择
            optionText:[],//常用意见数据
            details:[], //详情数据
            value2: 'a', //下一环节处理人
            option2: [],//下一环节处理人数据
            message:'',//意见文本框值
            show: false, //常用意见弹出层
            showSave: false,//待办已保存弹出层
            showDisplay: false,//待办已提交弹出层
            showHidden:false,//取消隐藏输入框
            inputValue:'',//输入框值
            optionUserId:'',//保存常见意见人的user.id
            holdIcon:require("../../assets/img/hold.png"),
            succeedIcon:require("../../assets/img/succeed.png"),
            workflowTask:'',//送审的taskId
            workflowKeyType:'',//送审的workflowKey
        }
    },
    created() {
        if(localStorage.getItem("nextNodeUser") && localStorage.getItem('nextNodeFlag')){
            let nextNodeUser = [];  //下一环节处理人数据
            JSON.parse(localStorage.getItem("nextNodeUser")).map(
                (item)=>nextNodeUser.push({...item,text:item.name,value:item.id})
            )
            this.option2 = nextNodeUser;
            this.value2 = this.option2[0] ? this.option2[0].value : '';
            //下一环节点数据  
            this.nextNodeFlag = JSON.parse(localStorage.getItem('nextNodeFlag'))
            this.send = this.nextNodeFlag[0] ? this.nextNodeFlag[0].nextNodeFlag : '';
            
            this.details = JSON.parse(localStorage.getItem('details'))//详情数据
            let BACK_TO_START = false;
            let BACK_TO_PREVIOUS = false;
            let listNode = [];
            this.nextNodeFlag.forEach(item=>{
                if(item.nextNodeFlag === 'BACK_TO_START' && !BACK_TO_START){
                    listNode.push({id:item.id,name:'退回申请人',nextNodeFlag:item.nextNodeFlag})
                    BACK_TO_START = true;
                }else if(item.nextNodeFlag === 'BACK_TO_PREVIOUS' && !BACK_TO_PREVIOUS){
                    listNode.push({id:item.id,name:'退回上级审批',nextNodeFlag:item.nextNodeFlag})
                    BACK_TO_PREVIOUS = true;
                }else if(item.nextNodeFlag === 'BACK_TO_NODE'){
                    listNode.push({id:item.id,name:item.name,nextNodeFlag:item.nextNodeFlag})
                }else if(item.nextNodeFlag === 'GENERAL'){
                    listNode.push({id:item.id,name:item.name,nextNodeFlag:item.nextNodeFlag})
                }
            });
            this.listDataNode = listNode;
            if(this.details.workflowTask){
               this.workflowTask = this.details.workflowTask.id; //送审的taskId
            }else{
               this.workflowTask = this.details.reimbursement.workflowTask.id
            }
            if(localStorage.message){ this.message = localStorage.message; }
            
        }else{
            this.$toast("获取处理人失败");
        }
    },
    watch:{
       showSave(newSave,oldSave){
           if(!newSave){
               this.$native.back();
           }
       },
       showDisplay(newDisplay,oldDisplay){
           if(!newDisplay){
               this.$native.back();//保存成功返回上一个页面
           }
       }
    },
    
    components:{
        Nav,
    },
    mounted() {
       
    },
    methods: {
        
        onSubmit(values) {
            console.log('submit', values);
        },
        showSavePopup(){//待办已保存弹出层
          if(this.value2 == ''){
            this.$toast("请选择处理人")
          }else if(this.message == ''){
            this.$toast("请输入常用意见")
          }else{
            //存储保存的处理人和常用意见
            localStorage.value2 = this.value2; 
            localStorage.message = this.message; 
            this.showSave = true;
          };
        },
        showPopup() {//常用意见弹出层
            let optionTxt = this.option2.filter((item)=>item.value==this.value2);
           // console.log(optionTxt[0].id,'选中的id');
            this.optionUserId = optionTxt[0].id;//选中下一环节处理人的id
            var that = this;
            that.$axios.get(apiAddress+`/icm-base/common-opinion/all/${that.optionUserId}`).then((res)=>{
                if(!res.status == 200) return;
                that.optionText = res.data;      
            }).catch((res)=>{
                that.$toast("暂无常用意见");
            })
            that.show = true;
        },
        showSubmit() {//待办已提交弹出层
          if(this.value2 == ''){
            this.$toast("请选择处理人")
          }else if(this.message == ''){
            this.$toast("请输入常用意见")
          }else{  
            var that = this; 
            if(useoptionChian(that.details,'workflowTask?.instance?.definition?.workflowInfo?.workflowKey')){
               that.workflowKeyType = that.details.workflowTask.instance.definition.workflowInfo.workflowKey;
            }
            if(useoptionChian(that.details,'reimbursement?.workflowTask?.instance?.definition?.workflowInfo?.workflowKey')){
                that.workflowKeyType = that.details.reimbursement.workflowTask.instance.definition.workflowInfo.workflowKey;
            }
            let listNode = that.listDataNode.filter(item=>item.nextNodeFlag == that.send);//过滤nextNodeFlag
            
            if(listNode[0].nextNodeFlag == "GENERAL")listNode[0].nextNodeFlag = "COMPLETE"; //同意审批
            if(listNode[0].nextNodeFlag == "BACK_TO_START")listNode[0].nextNodeFlag = "REJECTION"//退回申请人
            
            
            that.$axios.put(apiAddress+`/app/complete/${that.details.id}?workflowKey=${that.workflowKeyType}`,{
                action:listNode[0].nextNodeFlag, 
                adivce:that.message, 
                nextNodeId:listNode[0].id, 
                nextUserIds:[that.value2],
                taskId:that.workflowTask,
                workflowInstanceEditInfo:{
                    variables:{}
                }
        
            }).then((res)=>{
                if(!res.status == 200) return;
                that.showDisplay = true;
            }).catch((err)=>{
                that.$toast(err.message);
            })
          }
        },
        downHidden(){//取消隐藏输入框
            this.showHidden = false;
        },
        downShow(){//显示输入框
            this.showHidden = true;
        },
        preserve(){//保存数据
            var that = this; 
            if(!that.inputValue == '' && !that.optionUserId == ''){
                that.$axios.post(apiAddress+`/icm-base/common-opinion`,{opinion: that.inputValue,userId:that.optionUserId}).then((res)=>{
                    that.optionText.push(res.data);
                    that.inputValue = '';
                }).catch((err)=>{
                    that.$toast(err.message);
                })
            }else{
                that.$toast("请输入常用意见");
            }
            
            
        },
        radioClick(){//单选框点击事件
            console.log(this.optionSelect);
            this.message = this.optionSelect;
            if(this.message == ''){
                this.optionSelect = '';
            }
            this.show = false;
        },
        close(){ //点击关闭按钮
            this.show = false;
        },
        succeed(){//待办已提交成功事件
           this.$native.back();//保存成功返回上一个页面
        },
        hold(){//待办保存事件
          this.$native.back();//保存成功返回上一个页面
        },
        

    },
}
</script>
<style lang="css" scoped>
#page{
    min-height: calc(100vh - 100px);
    position: relative;
}
.line{
  height: 0.2rem;
  background-color: #f3f6f9;
}
.title{
    font-size: 0.32rem;
    color: #1d1d1d;
    margin: 0.47rem 0 0.25rem 0;
    text-align: left;
}
.box{
    padding:  0 0.24rem;
}
.send{
    /* display: flex;
    justify-content: space-between;
    flex-wrap: wrap; */
    margin: 0.32rem 0;
    font-size: 0.32rem;
    
}
.send /deep/ .van-radio-group{
font-size: 0.28rem;
margin-top: 0.1rem;
}
.send .nextNodeBox /deep/ .van-radio .van-radio__icon{font-size: 0.24rem;}
.box .send .back{
  /* width:65%;
  text-align:left;
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden; */
}
.send .nextNodeBox{
    display: flex;
    justify-content: space-between;
}

.box .result{
margin: 0.15rem 0 0.25rem 0;
}
.value /deep/ .van-dropdown-menu__item{
    justify-content: left;
    background-color: #fdfeff;
    border: solid 1px #d5e5ef;
}
.value /deep/ .van-dropdown-menu__title{
   width: 95%;
   text-align: left;
}
.bottom{
    position: fixed;
    bottom: 0;
    left:0;
    width: 100%;
}

.submit{
   display: flex;
   justify-content: space-between;

}
.submit /deep/ .van-button--round{ border-radius: 0;}
.submit /deep/ .van-popup--center{border-radius: 0.2rem;}
#submitLeft{
    background-color: #efcb4a;
    border: 1px solid #efcb4a;
}
.send /deep/ .van-checkbox__label{font-size: 0.28rem;}
.send /deep/ .van-checkbox__icon--checked .van-icon{font-size: 0.24rem;}
.send /deep/ .van-radio__label{margin-left: 0.1rem}
.textarea{
    height: 4rem;
    background-color: #fdfeff;
    border: solid 1px #d5e5ef;
}
.save{
    width: 5.14rem;
	height: 4.10rem;
	background-color: #ffffff;
}
.save img{
    width: 1rem;
    height: 1rem;
    margin: 0.46rem 0;
}
.save .txt{

}
.save .btn{
    width: 85%;
    margin-top: 0.58rem;
}
.popup{
    color: #fff;
    background-color: #1890ff;
    border-color: #1890ff;
    text-shadow: 0 -1px 0 rgba(0, 0, 0, 0.12);
    box-shadow: 0 2px 0 rgba(0, 0, 0, 0.045);
    font-size: 0.24rem;
    padding: 0.1rem;
    border-radius: 5px;
}
.optionContent /deep/ .van-popup--center{border-radius: 0.2rem;}
.showSave /deep/ .van-popup--center{border-radius: 0.2rem;}
.showDisplay /deep/ .van-popup--center{border-radius: 0.2rem;}
.optionTitle{
 padding: 0.2rem;
display: flex;
justify-content: space-between;
}
.optionPopup{
    width: 5.14rem;
	min-height: 4.10rem;
	background-color: #ffffff;
}
.optionSelect /deep/ .van-radio{
    margin-bottom: 0.12rem;
    margin-left: 0.12rem;
}
.optionSelect /deep/ .van-radio__icon,.van-radio__label{
    font-size: 0.26rem;
}
.inputDisplay{
    justify-content: space-around;
    display: flex;
    line-height: 0.6rem;
}
.inputDisplay .input{
    width: 65%;
    border: 1px solid #e5e5e5;
}
.inputDisplay .input /deep/ .van-cell{
  padding: 6px 16px;  
}
.clickButton{
    padding: 0.1rem;
    color: #fff;
    background-color: #1890ff;
    border-radius: 5px;
}
.addOption{
    padding: 0.12rem;
    text-align: left;
    color: #fff;
    background-color: #1890ff;
    border-radius: 5px;
    width: 25%;
    margin: 0.1rem 0;
}
.close{
    width: 0.4rem;
    height: 0.4rem;
    background-color: #1890ff;
    color: #fff;
    line-height: 0.4rem;
    border-radius: 50%;
}
</style>