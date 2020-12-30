<template>
  <div id="page">
    <Nav />
    <!-- 自定义方法 子组件调用 -->
    <Search @dataName="init" />
    <ul class="Tab">
      <li  @click="oontabbar(index)" v-for="(items,index) in dataList" :key="index"
        :class="{tabColor:active == index}" >{{items}}</li>
    </ul>
    <!-- 报销待审 -->
    <div v-show="active==index" v-for="(itemss,index) in dataList" :key="index">
      
      <van-pull-refresh v-model="tabBarIndex[index].refreshing" @refresh="onRefresh">
      <van-list v-model="tabBarIndex[index].loading"
        :finished="tabBarIndex[index].finished"
        finished-text="暂无更多数据"
        @load="onLoad"
        :offset="offset">

        <div class="listBox">
          <div class="content"
            v-for="(item, index) in tabBarIndex[index].list" :key="index"
            @click="goDetail(item)" >

            <div class="title">{{ item.content }}</div>
            <div class="money">
              <span class="monetary">￥ {{ item.total }}</span>
              <van-icon class="rightIcon" name="arrow" />
            </div>
            <div class="line"></div>
            <div class="type">
              <span>{{ item.title }}</span>
              <span>{{ item.applyDate }}</span>
            </div>
          </div>
        </div>
      </van-list>
      </van-pull-refresh>
    </div>
  </div>
</template>

<script>
import Nav from "../common/navbar";
import Search from "../common/search";
export default {
  data() {
    return {
      error: false, //是否加载失败
      dataList:['待办事项','已办事项','全部事项'],
      active: 0, // 下标
      pageSize: 10,
      // list: [], //列表数据
      offset: 100, //滚动条与底部距离小于 offset 时触发load事件
      tabBarIndex : [],
      value:'',
      // curTab:0,
    };
  },
  created() {
    // this.$route.meta.navBarTxt= this.$route.query.title;
    //this.init()
    for(var i=0; i<3;i++){
      let vanPull = {
          refreshing: false,
          loading: false, // 是否处于加载状态
          finished: false, // 是否已加载完成
          list: [],
          pageNum: 0,
      }
      this.tabBarIndex.push(vanPull);
    }
   

  },
  components: {
    Nav,
    Search,
  },
  watch: {
   
  },
  mounted() {},
  methods: {
    goDetail(applyDate) {
      //  this.$router.push({path:"/",query:{id:e.id,type:e.taskType,title:title}});
     
      this.$native.forward({
        path: "/cost",
        query: { 
          id: applyDate.id,
          type: applyDate.expenseType, 
          title: applyDate.title,
          instanceId:applyDate.instanceId, //查询流转信息id 
        },
      });
    },
    oontabbar(index){
        this.active = index;
        if(!this.tabBarIndex[this.active].list.length){
             this.onLoad();
        }
    },
    init(val,children) {
      // 子组件传参 val
    
      let api = `/app/index/reports`;
      let dataUrl= [`?stateType=UNDONE&`,`?stateType=DONE&`,`?`];
      
      if(children === 'children'){  //判断是否是子组件的值
        this.tabBarIndex[this.active].pageNum = 0; //当前选项卡的数据页数为0页
        this.value = val;  
        this.tabBarIndex[this.active].list = [];  //是否是子组件的值有就为空 
      }
      if(this.value){ //防止关键字被覆盖
         dataUrl[this.active] +=`declarerName=${this.value}`;
      }

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
  },
};
</script>
<style lang="css" scoped>
#page {
  background-color: #f3f6f9;
  /* min-height: calc(100vh - 46px); */
}
.van-pull-refresh {
  min-height: calc(100vh - 46px);
}
.Tab{
  display: flex;
  height: 1rem;
  line-height: 1rem;
  background-color: #ffffff;
  justify-content: space-around;
}
.tabColor{
  font-size: 0.32rem;
  color: #1890ff;
  border-bottom: 2px solid #1890ff;
}

.listBox {
  padding: 0.2rem 0.25rem;
}
.listBox .content {
  width: 92%;
  height: 2.25rem;
  background-color: #ffffff;
  padding: 0.2rem 0.3rem;
  margin-bottom: 0.2rem;
}
.listBox .content .title {
  text-align: left;
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
}
.listBox .content .money {
  display: flex;
  justify-content: space-between;
  margin: 0.23rem 0 0.37rem 0;
}
.listBox .content .money .monetary {
  font-size: 0.4rem;
}
.listBox .content .money .rightIcon {
  font-size: 0.4rem;
  margin-top: 0.1rem;
  color: #b4c5d5;
}
.listBox .content .line {
  height: 1px;
  background-color: #ecf0f6;
  margin-bottom: 0.23rem;
}
.listBox .content .type {
  display: flex;
  justify-content: space-between;
}
.listBox .content .type span:nth-child(1) {
  border: solid 1px #1c92ff;
  padding: 0.05rem;
  font-size: 0.24rem;
  color: #1c92ff;
}
.listBox .content .type span:nth-child(2) {
  color: #95a4b1;
  margin-top: 0.1rem;
}
</style>