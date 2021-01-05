//实现千分位过滤器
const filter = {
    'num': function (val) {
        if (typeof (val) === 'number') {
            return (val).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,')
        }
    }
}

export default filter