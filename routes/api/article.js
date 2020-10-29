const DB = require('../../utils/DB')

let article = function(router){
    router.get('/article/test',function(req,res){
        // console.log(res,'0000000000')
        // console.log(req,'11111111111')
        // res.json({
        //     code:200,
        //     data:[
        //         '123',
        //         '456'
        //     ],
        //     msg:'测试返回'
        // })
        DB.query('SELECT * from article',(err,result)=>{
            if(err){
                console.log(err)
                res.json({code:500,msg:'查询列表异常'})
            }else{
                console.log(result)
                res.json({code:200,msg:'查询成功',data:result})
            }
        })
    })
}

module.exports = article