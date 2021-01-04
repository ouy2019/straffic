import axios from 'axios';
import config from '../../config';



  function tip(){
    Toast({
      message: msg,
      duration: 1000,
      forbidClick: true,
    });
  };
  
function toLogin(){

}
/**
 * 请求失败后的错误统一处理
 * @param {Number} status 请求失败的状态码
 */
function errorHandle (status, other) {
    // 状态码判断
    switch (status) {
    // 401: 未登录状态，跳转登录页
    case 401:
      toLogin();
      break;
      // 403 token过期
      // 清除token并跳转登录页
    case 403:
      tip('登录过期，请重新登录');
      localStorage.removeItem('token');
      setTimeout(() => {
        toLogin();
      }, 1000);
      break;
      // 404请求不存在
    case 404:
      tip('请求的资源不存在');
      break;
    case 500:
        tip('未知错误');
        break;
    default:
      console.log(other);
    }
  };
  // 设置post请求头
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';
//请求拦截器
axios.interceptors.request.use((config) => {
	//config.headers.Authorization ='Bearer '+"eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiLmnY7ngb_kupEiLCJleHAiOjE2MTAyNjY5NzQsImlhdCI6MTYwOTY2MjE3NCwianRpIjoiMjI2NjMzNzY4OTEwMzI3ODA4In0.beDBo0MZkVEHVSvJzLZulH3h7p2BF1-TZFrwgT2X1q7Rf0wzw-xovYpf59Rt852SQ_u4aWLjEvmOoLnJVC3MyA";
	config.headers.Authorization ='Bearer '+localStorage.getItem('token');
	// config.headers.Authorization = localStorage.getItem('Authorization');
	return config;
},(error)=>{
    errorHandle(error.status, error.data.message);
    return Promise.reject(error);
});

// 响应了拦截器
// axios.interceptors.response.use((response)=>{
//   // console.log(response,'6666');
//   // if(response.request.status == 200){
//   //   errorHandle(response.request.status, response.request.data.message);
//   //   return Promise.reject(response);
//   // }

// },(error)=>{
//   errorHandle(error.status, response.data.message);
//   return Promise.reject(response);
// })
// export default instance;