import Vue from 'vue'
import Router from 'vue-router'

// const TRAVEL = () => import('../components/page/expense/TRAVEL.vue')




Vue.use(Router)
export default new Router({  //hash
  mode: 'hash',
  routes: [
    {
      path: '/',
      name: 'index',  
      component: ()=> import("../components/page/index.vue"),  //首页
      meta:{
        navBarTxt: '', showBack: false,rightIcon: false
      } 
    },
    {
      path: '/expense',
      name: 'expense',
      component: ()=>import("../components/page/expense.vue"),//报销待审
      meta:{
        navBarTxt: '报销待审', showBack: true,rightIcon: true,class: 'bluestyle',
      }
    },
    {
      path: '/apply',
      name: 'apply',
      component: ()=>import("../components/page/apply.vue"),//事前申请待审
      meta:{
        navBarTxt: '事前申请待审', showBack: true,rightIcon: true,class: 'bluestyle',
      }
    },
    {
      path: '/matter',
      name: 'matter',
      component: ()=>import("../components/page/matter.vue"),//待办事项
      meta:{
        navBarTxt: '待办事项', showBack: true,rightIcon: true,class: 'bluestyle',
      }
    },
    {
      path: '/charge', //报销待审 --> XX 费报销
      name: 'charge',
      component: ()=>import("../components/page/charge.vue"),
      meta:{
        navBarTxt: '', showBack: true,rightIcon: true, class: 'whitestyle'
      }
    },
    {
      path: '/cost', //事前申请待审 --> XX 费报销
      name: 'cost',
      component: ()=>import("../components/page/cost.vue"),
      meta:{
        navBarTxt: '', showBack: true,rightIcon: true, class: 'whitestyle'
      }
    },
    {
      path: '/option', //意见提交
      name: 'option',
      component: ()=>import("../components/page/option.vue"),
      meta:{
        navBarTxt: '发起审批', showBack: true,rightIcon: true, class: 'whitestyle'
      }
    },
    {
      path: '/pdf', //pdf
      name: 'pdf',
      component: ()=>import("../components/page/pdf.vue"),
      meta:{
        navBarTxt: '', showBack: true,rightIcon: true, class: 'whitestyle'
      }
    },
   
    
   
   
   
   
  ]
})

