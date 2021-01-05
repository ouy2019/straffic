export const pageChange = {
    data(){
      return{
      }
    },
    mounted() {
      // 判断是否后台切换为h5页面 与小程序onShow功能类似
      // document.addEventListener("visibilitychange",()=>{
      //   let isHide = document.hidden || document.webkitHidden;
      //   console.log(isHide,555)
      //   if (isHide) {
      //     this.onHide();
      //   } else {
      //     this.onShow();
      //   }
      // })
      // 设置隐藏属性和可见改变事件的名称，属性需要加浏览器前缀
    // since some browsers only offer vendor-prefixed support
      let that = this;
      var hidden, state, visibilityChange;
      if (typeof document.hidden !== "undefined") {
        hidden = "hidden";
        visibilityChange = "visibilitychange";
        state = "visibilityState";
      } else if (typeof document.mozHidden !== "undefined") {
        hidden = "mozHidden";
        visibilityChange = "mozvisibilitychange";
        state = "mozVisibilityState";
      } else if (typeof document.msHidden !== "undefined") {
        hidden = "msHidden";
        visibilityChange = "msvisibilitychange";
        state = "msVisibilityState";
      } else if (typeof document.webkitHidden !== "undefined") {
        hidden = "webkitHidden";
        visibilityChange = "webkitvisibilitychange";
        state = "webkitVisibilityState";
      }
       // 添加一个标题改变的监听器
        document.addEventListener(visibilityChange, function(e) {
        let isHide = document.hidden || document.webkitHidden;
        if (isHide) {
          that.onHide();
          
        } else {
          that.onShow();
          
        }
        // 开始或停止状态处理
      }, false);
    },
    methods: {

    },
}