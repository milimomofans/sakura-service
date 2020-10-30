const _success = function (msg = '操作成功',data = null){
    return {
        code:0,
        data,
        msg
    }
}
const _error = function (msg = '操作失败',data = null){
    return {
        code:300,
        data,
        msg
    }
}
module.exports = {
    _success,
    _error
}