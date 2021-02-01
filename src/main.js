// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import axios from 'axios'
import vConsole from 'vconsole'
import './core/http';
import './core/vant';
import echarts from 'echarts';
import native from '@/jslibs/native/native';
import backHome from '@/jslibs/native/native';
import loadpage from '@/jslibs/native/native';
import filter from './core/filter';
// new vConsole();
Vue.prototype.$native = native;
Vue.prototype.$backHome = backHome;
Vue.prototype.$echarts = echarts;
Vue.prototype.$axios = axios;
Vue.prototype.$loadpage = loadpage;
Vue.config.productionTip = false;
/* 注册过滤器 */
for (const key in filter) {
    if (filter.hasOwnProperty(key)) {
        const element = filter[key]
        Vue.filter(key, element)
    }
}


// 路由拦截
router.beforeEach((from,to,next)=>{
  //  console.log(from,to,'000')
  let {token,userId,title} = from.query;
  if(token) {
    localStorage.token = token;
  } 
  if(userId) {
    localStorage.userId = userId;
  }
  // 自动跳转到下一个页面，没有调用则页面空白
  next();
});
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
