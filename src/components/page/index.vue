<template>
   <div id="page">
       <!-- 首页 -->
     <div class="header">
          <!-- <img :src="topIcon" alt="加载失败"> -->
     </div>
     <div class="background"></div>
     <div class="menu">
        <div class="menuBox" >
             <div class="title">审批</div>
             <div class="MenuList" >
                 <div class="small"  v-for="(item,indexs) in menu" :key="indexs" @click="goApproval(item)">
                    <el-badge :value="item.count" :max="99" class="item" >
                      <img :src="require('../../assets/img/menu'+indexs+'.png')" alt="" />
                    </el-badge>
                    <p>{{item.name}}</p>    
                 </div>
             </div>
        </div>
     </div>
     
     <div class="matter">
        <div class="tab" >
              <li v-for="(tab,index) in tabbar" :key="index" >
                  <span :class="{activeColor:active == index}" @click="oontabbar(index)">{{tab}}</span>
              </li>
        </div>
        <div class="content" v-for="(tabs,index) in tabbar" :key="index" v-show="active == index">
      
       
            <van-pull-refresh v-model="tabBarIndex[index].refreshing" @refresh="onRefresh">
            <van-list v-model="tabBarIndex[index].loading"
            :finished="tabBarIndex[index].finished"
            finished-text="暂无更多数据"
            @load="onLoad"
            :offset="offset">
                
                <div class="eventsBox" v-for="(item, index) in tabBarIndex[index].list" :key="index"
                    @click="goDetail(item)">
                    <div class="events">
                        <div class="message">{{item.title}}</div>
                        <div class="timer">{{item.createTime}}</div>
                    </div>
                    <div class="user">
                        <span class="userName">申请人:{{item.username}}</span>
                        <span class="cost">{{item.workFlowName}}</span>
                    </div>
                </div>
               
        
            </van-list>
            </van-pull-refresh>
         

        </div>
     </div>

  

  </div>
</template>
<script>
let isTrue = true;
export default {
    data() {
        return {
            // topIcon:require('../../assets/img/indextxt.png'),
            menu:[] , //菜单数据
            tabbar:["待办事项","已办事项","全部事项"], //tab栏数据
            tabList:[], //待办--已办--全部数据
            error: false, //是否加载失败
            active: 0, // 下标
            pageSize: 10,
            // list: [], //列表数据
            offset: 100, //滚动条与底部距离小于 offset 时触发load事件
            tabBarIndex : [],
            value:'',
            isTrue:false, //是否有数据
            type:'',//事项的type类型
        }
    },
    created() {
        for(var i=0; i<3;i++){
        let vanPull = {
            refreshing: false,
            loading: false, // 是否处于加载状态
            finished: false, // 是否已加载完成
            list: [],
            pageNum: 0,
        }
        this.tabBarIndex.push(vanPull);
        this.showPage();
    }

    },
    components: {
      
    },
    mounted(){
         this.mssgae();//菜单总数信息
    },
    
    methods:{
        showPage() {
            let that = this;
            var hiddenProperty = 'hidden' in document ? 'hidden' : 'webkitHidden' in document ? 'webkitHidden' : 'mozHidden' in document ? 'mozHidden' : null;
            var visibilityChangeEvent = hiddenProperty.replace(/hidden/i, 'visibilitychange');
            var onVisibilityChange = function(){
                if (!document[hiddenProperty]) {   
                        that.mssgae();
                 }else{
                 }
             }
            console.log(document[visibilityChangeEvent],11)
            document.addEventListener(visibilityChangeEvent, onVisibilityChange)
        },
        goApproval(menu) {  //菜单事件传参
            this.$native.forward({path:menu.linkUrl});
        },
        tabClick(index){ //tab事件
            this.activeName = index;
        },
        mssgae(){  //菜单 信息数据 
            if(!isTrue) return;
            isTrue = false 
            setTimeout(()=>{isTrue = true},500);
            var that = this;
            this.$axios.get(apiAddress+`/app/index/getCount`).then((res)=>{
              
               if(res.status == 200) that.menu = res.data.data;
             
            })
        },
        async goDetail(applyDate) {
            console.log(applyDate.id)
             var that = this;
            if(applyDate.taskType == 'payment'){ //跳转到事前申请  reimbursement报销申请
                var linkUrl = "/cost";
                var msg = await that.$axios.get( apiAddress+`/app/index/reports/${applyDate.id}/getType`)
                if(!msg.code == 200)return;
                that.type = msg.data.data;
            }else{
               var linkUrl = "/charge";
               var msg = await that.$axios.get( apiAddress+`/app/index/reimbursement/${applyDate.id}/type`)
                if(!msg.code == 200)return;
                that.type = msg.data.data;
               
            }
            this.$native.forward({
                path: linkUrl,
                query: { 
                    id:applyDate.id,
                    instanceId: applyDate.id,
                    type: that.type,
                    title: applyDate.workFlowName,
                    isDone:applyDate.isDone, //首页判断已办和待办
                },
            });
        },
        oontabbar(index){
            this.active = index;
            if(!this.tabBarIndex[this.active].list.length){
                this.onLoad();
            }
        },
        init() {
        
        let api = `/app/index/`;
        let dataUrl= [`getAllUndone`,`getAllDone`,`getAll`];
        
        let {pageNum,finished,loading,refreshing,list} = this.tabBarIndex[this.active];
        this.$axios.get(apiAddress+api+dataUrl[this.active], {

            params: { page: pageNum, size: this.pageSize },

            }).then((res) => {
        
            if (res.data.code == 200) {
                
                // 数据小于10条，已全部加载完毕finished设置为true
                if (res.data.data.data < 10){
                finished = true;
                } 
                //没有数据
                if (res.data.data.data.length == 0) {
                    loading = false;
                    finished = true;
                }
                pageNum++;
                list = list.concat(res.data.data.data);
            
                // 加载状态结束
                loading = false;
            } else {
                this.$toast(res.msg);
            }
            refreshing = false;
            this.$set(this.tabBarIndex,this.active,{pageNum,finished,loading,refreshing,list})
            })
            .catch((err) => {
               console.log(err);
            });
        },
        onLoad(enevt) {
        let {list,pageNum,loading} = this.tabBarIndex[this.active];
        if (enevt !== "istrue") {
            loading = true;
        }

        if (pageNum == 0) {
            list = [];
        }
        this.init();
        },

        onRefresh() {
        let {pageNum,finished,loading} = this.tabBarIndex[this.active];
        // 清空列表数据
        pageNum = 0;
        finished = false;
        // 重新加载数据
        // 将 loading 设置为 true，表示处于加载状态
        loading = false;
        // this.onLoad(); //加载
        this.onLoad("istrue");
        this.$toast("努力加载中...");
        },
       
        
    }

}
</script>
<style lang="css" scoped>
#page {
  /* background-color: #f3f6f9; */
  /* min-height: calc(100vh - 46px); */
}
.header{
  height: 2.46rem;
  background-image: linear-gradient(-63deg, #4dbaff 0%, #1890ff 100%), linear-gradient( #ffffff, #ffffff);
  background-blend-mode: normal, normal;
}
.header img{
    width:100%;
    height: 3.44rem;
}
.background{
    height: 1.64rem;
    background-color: #f7fafc;
}
.menu{
    height: 2.22rem;
    background-image: linear-gradient( #ffffff, #ffffff), linear-gradient( #ffffff, #ffffff);
    background-blend-mode: normal, normal;
    width: 94%;
    margin: 0 auto;
    margin-top: -2.6rem;
    z-index: 9;
}
.menu .menuBox{
text-align: left;
}
.menu .menuBox .title{
    font-size: 0.34rem;
    padding: 0.3rem 0 0 0.3rem;
    height: 0.7rem;
}
.menu .menuBox .MenuList{
    display: flex;
    justify-content: space-around;
}
.menu .small{
    display: flex;
}
.menu .small img{
    width:1rem;
    height: 1rem;
}
.menu .small p{
    line-height: 1rem;
    margin-left: 0.2rem;
}
.matter{
    /* width: 6.3rem; */
    width: 94%;
    margin: 0 auto;
    padding: 0 2%;
    position: relative;
    text-align: left;
}
.tab{}
.tab li{
    width: 1.73rem;
    display: inline-block;
    color: #829baa;
    padding: 0.44rem 0;
}
.activeColor{
    font-size: 0.34rem;
    color: #1d1d1d;
    padding-bottom: 0.1rem;
    position: relative;
}


.active::after {
    content: " ";
  width: 0.36rem;
  height: 0.04rem;
  background: #349eff;
  position: absolute;
  border-radius: 2px;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
}
.content .eventsBox{
    border-bottom: 1px solid #e8ecef;
    padding-top: 0.32rem;
}
.content .eventsBox .events{
    display: flex;
    justify-content: space-between;
}
.content .eventsBox .events .message{
    font-size: 0.3rem;
    width: 60%;
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
}
.content .eventsBox .events .timer{
    margin-top: 0.05rem;
    color: #ced2d4;
    font-size: 0.24rem;
}
.content .eventsBox .user{
    display: flex;
    justify-content: space-between;
    margin: 0.2rem 0 0.3rem 0;
}
.content .eventsBox .user .userName{
    color: #a8acb0;
    font-size: 0.26rem;
}
.content .eventsBox .user .cost{
    font-size: 0.24rem;
    border: solid 1px #1c92ff;
    color: #1c92ff;
    padding: 0.05rem;
}
.Number{
  position: relative;
}
.Number .flguer{
    position: absolute;
    top: 0;
    right: 0;
    width: 0.3rem;
    background-color: red;
    border-radius: 50%;
    text-align: center;
    color: #fff;
    font-size: 0.22rem;
}
</style>