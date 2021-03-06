/* eslint-disable */
const jsb = require('../jsBridge');
import router from '../../router'
import qs from 'qs';
let $qs = qs.stringify;
var userAgent = navigator.userAgent.toLowerCase();
// 调用原生方法返回
function back() {
    if (equipment('iphone')) {
        naviBack();
       
    } else if (equipment('ipad')) {
        naviBack();
    } else if(equipment('android')) {
        JsBridge.call('JSBridge', 'naviBack', { isRefresh: false, callBack: 'isRefresh()' }, (res) => {});
    } else {
        window.history.go(-1);
    }
}
function backHome() {
    if (equipment('iphone')) {
        done({ isRefresh: '0', callBack: 'isRefresh()' });
    } else if (equipment('ipad')) {
        done({ isRefresh: '0', callBack: 'isRefresh()' }); //返回到首页传递一个参数
    } else if(equipment('android')) {
        JsBridge.call('JSBridge', 'naviBack', {backNum : 2, isRefresh: false, callBack: 'isRefresh()' }, (res) => {});
    } else {
        window.history.go(-1);
    }
}



function equipment(val){
    var res = false;
    var userAgent = navigator.userAgent.toLowerCase();
    if(userAgent.indexOf(val) > -1) {
      res = true;
    }
    return res;
  
  };


// 调用原生打开页面
function forward(url) {
    let appUrl = location.origin+'/#';
    // let appUrl = location.origin+'/icm-app';
    let linkUrl = appUrl  + url.path ;
    if(!linkUrl.includes('?')){
        linkUrl += '?';
    }
    if(url.query){
        linkUrl +=  $qs(url.query)
    }
    if (equipment('iphone')) {
        openNewPage(linkUrl);
    } else if (equipment('ipad')) {
        openNewPage(linkUrl);
    } else if(equipment('android')) {
        JsBridge.call('JSBridge', 'openNewPage', { url:linkUrl }, (res) => {});
    } else {
        console.log(linkUrl,'--访问地址--');
        router.push(url) 
        // window.location.href = url;
    }
}
//调用原生打开文档页面
function loadpage(url, title) {
    
    if (equipment('iphone') || equipment("ipad")) {
        watchFile({ 'url': url, 'title': title });
      } else {
        JsBridge.call('JSBridge', 'watchFile', { 'url': url ,'title': title}, function (res) {
        })
    }
    
}

function openSearch() {
    if (equipment('iphone')) {
        search();
    } else if (equipment('ipad')) {
        search();
    } else {
        JsBridge.call('JSBridge', 'search', {  }, (res) => {

        });
    }
}

export default {
    back, forward, loadpage, openSearch, backHome
}