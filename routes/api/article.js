const DB = require('../../utils/DB')
// import {_success,_error} from '../../utils/Result'
const RES = require('../../utils/Result') 

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
    router.post('/article/modify',function(req,res){
        // console.log(req)
        let {
            id=null,
            title,
            content,
            md,
            html
        } = req.body
        // console.log(req)
        let msg = id ? '修改成功' : '添加成功'
        let sql = id ? 
        '' : 
        'insert into article(title,content,markdown,html) values(?,?,?,?)'
        
        if(!id){
            // console.log('进来了')
            DB.excute(sql,[title,content,md,html],function(err,result){
                if(err){
                    console.log(err)
                    RES._error(err)
                }else {
                    RES._success(msg)
                }
            })
        }
    })
}

module.exports = article