import axios from 'axios';
import Vue from 'vue';
import { Toast } from 'vant';
/**
 * 请求失败后的错误统一处理
 * @param {Number} status 请求失败的状态码
 */
function errorHandle (status, other) {
  console.log(status)
  console.log(other)
    // 状态码判断
    switch (status) {
    // 401: 未登录状态，跳转登录页
    case 401:
      Toast('没有足够的权限访问，也许是token失效，请重新登录！');
      break;
      // 403 token过期 清除token并跳转登录页
    case 403:
      Toast('登录过期，请重新登录');
      localStorage.removeItem('token');
      break;
      // 404请求不存在
    case 404:
      Toast('请求的资源不存在');
      break;
    case 500:
      Toast('未知错误');
        break;
    default:
      Toast('未知错误');
     
    }
  };
// 设置post请求头
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';
//请求拦截器
axios.interceptors.request.use((config) => {
	config.headers.Authorization ='Bearer '+"eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiLmnY7ngb_kupEiLCJleHAiOjE2MTI3ODIzMTUsImlhdCI6MTYxMjE3NzUxNSwianRpIjoiMjI2NjMzNzY4OTEwMzI3ODA4In0.LUqkljVCFZTMPqgxbfGQRjajxm9oWuQlI8MGyvzaMmMzayjUvVV4u7wQtTWq4upi7xyZHW-12KVxIsStB9FAlw";
	// config.headers.Authorization ='Bearer '+"eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiLlvKDmnbAiLCJleHAiOjE2MTI3ODA4NzYsImlhdCI6MTYxMjE3NjA3NiwianRpIjoiMjU1MzU2Mzc4OTcyMDMzMDI0In0.NE9OroJBencVMmDKqE0s3OZS3I83MlkAiNhAV7hLXPATugFgFWaJLbXCpN26ze2bMA9_uxxGSLhi5cTLFFCqow";
  //config.headers.Authorization ='Bearer '+localStorage.getItem('token');
  
	// config.headers.Authorization = localStorage.getItem('Authorization');
	return config;
},(error)=>{
    Toast('登录已过期，请重新登录！');
    return Promise.reject(error);
});

// 响应拦截器
// instance.interceptors.response.use(
//   // 请求成功
//   (res) => (res.status === 200 ? Promise.resolve(res) : Promise.reject(res)),
//   // 请求失败
//   // eslint-disable-next-line consistent-return
//   (error) => {
//     const { response } = error;
//     if (response) {
//       // 请求已发出，但是不在2xx的范围
//       errorHandle(response.status, response.message);
//       return Promise.reject(response);
//     }
//     // 处理断网的情况
//     // eg:请求超时或断网时，更新state的network状态
//     // network状态在app.vue中控制着一个全局的断网提示组件的显示隐藏
//     // 关于断网组件中的刷新重新获取数据，会在断网组件中说明
//     if (!window.navigator.onLine) {
//       console.log(1);
//     } else {
//       return Promise.reject(error);
//     }
//   },
// );

// export {
//   instance,
// } 