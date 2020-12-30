<template>
  <div id="page">
    <Nav></Nav>
      <!-- 报销待审 -->
      <van-pull-refresh v-model="refreshing" @refresh="onRefresh">
      <van-list
        v-model="loading"
        :finished="finished"
        finished-text="暂无更多数据"
        @load="onLoad"
        :offset="offset" >
     
        <div class="listBox">
          <div class="content" v-for="(item, index) in list" :key="index" @click="goDetail(item.relatedId,item.title,item.expenseType)" >
            <div class="title">{{ item.reason }}</div>
            <div class="money">
              <span class="monetary">￥ {{ item.amount }}</span>
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
</template>

<script>
import Nav from "../common/navbar";
export default {
  data() {
    return {
      list: [], //列表数据
      error: false, //是否加载失败
      refreshing: false,
      loading: false, // 是否处于加载状态
      finished: false, // 是否已加载完成
      pageNum: 0,
      pageSize: 10,
      offset: 10, //滚动条与底部距离小于 offset 时触发load事件
    };
  },
  created() {
    // this.$route.meta.navBarTxt= this.$route.query.title;
    //this.init()
  },
  components: {
    Nav,
  },
 
  mounted() {

  },
  methods: {
    goDetail(relatedId,title,expenseType) {
      //事前报销单详情
      this.$native.forward({
        path: "/charge",
        query: { 
          id: relatedId,
          title: title,
          type:expenseType,
        },
      });
      console.log(relatedId)
      console.log(expenseType)
    },
    init() {
      this.$axios.get(apiAddress + "/app/index/reimbursement/getAll?", {
          params: { page: this.pageNum, size: this.pageSize },
      }).then((res) => {
          if (res.status == 200) {
            
            // 数据小于10条，已全部加载完毕finished设置为true
            if (res.data.data < 10) {
              this.finished = true;
            }
            //没有数据
            if (res.data.data.length == 0) {
              this.loading = false;
              this.finished = false;
            }
            this.pageNum++;
            this.list = this.list.concat(res.data.data);
           console.log(this.list)
            // 加载状态结束
            this.loading = false;
          } else {
            this.$toast(res.msg);
          }
          this.refreshing = false;
          

      }).catch((error) => {
        console.log(error);
      });
    },
    onLoad(enevt) {
      if (enevt !== "istrue") {
        this.loading = true;
      }

      if (this.pageNum == 0) {
        this.list = [];
      }
      this.init();
     
    },

    onRefresh() {
      // 清空列表数据
      this.pageNum = 0;
      this.finished = false;
      // 重新加载数据 // 将 loading 设置为 true，表示处于加载状态
      this.loading = false;
      this.onLoad("istrue");//加载
      this.$toast("努力加载中...");
    },
  },
};
</script>
<style lang="css" scoped>
#page {
  background-color: #f3f6f9;
  min-height: calc(100vh - 46px);
}
.van-pull-refresh {
  min-height: calc(100vh - 46px);
}

.listBox {
  padding: 0.2rem 0.25rem;
}
.listBox .content {
  width: 92%;
  height: 2.2rem;
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