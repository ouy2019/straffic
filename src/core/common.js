
//去审批封装接口
//id形参 页面id      query对象 传的参数
//
const goOption =  (that,id,query)=>{ //跳转意见页面
    that.$axios.post(apiAddress+`/workflow/runtime/tasks/${id}/outflows`,query).then(res=>{
        if(res.status != 200) return rej;
        var nextNodeId = res.data[0].id;
        localStorage.setItem("nextNodeFlag",JSON.stringify(res.data));
        if(!res.data[0].id) return;
        that.$axios.post(apiAddress+`/workflow/runtime/tasks/${id}/users`,{
        nextNodeId:nextNodeId,
        workflowInstanceEditInfo:{
            test:false,
            workflowKey: query.type,
            variables: query.variables
        }
        }).then(msg=>{
            if(msg.status != 200)return;
            localStorage.setItem("nextNodeUser",JSON.stringify(msg.data));
            
            that.$native.forward({path:'/option', query: {id:query.variables.id}}) 
        }).catch(err=>that.$toast("参数错误,请检查你的网络！"))
    })
}
// 链式调用 
// target当前需要判断的对象  
// str所要判断是否有值的属性
const useoptionChian = (target,str)=>{
    let  isTrue = true;
    function docubce(item,index) {
        // 当前属性是否为空 为空则不执行 防止报错
        if(!item || !index || !index.split('?.')[0]) return;
        // 当前需要判断是否有值
        let nowObj = item[index.split('?.')[0]];
        // isTrue 如果遇到没有的属性直接return 不往下执行
        nowObj ? '' : isTrue = false;
        // 获取下一个属性后的元素
        let str = index.slice(index.indexOf('?.')+2,index.length);
        // 递归判断下一个属性是否存在
        if(index.split('?.')[1]) docubce(nowObj,str);
    }
    docubce(target,str);
    return isTrue;
}







export {
    goOption,
    useoptionChian,
    
}
