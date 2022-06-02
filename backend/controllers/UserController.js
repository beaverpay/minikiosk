const excuteStatement = require('../db/db');
const bcrypt = require('bcrypt');
const JSONbig = require('json-bigint');

module.exports = {
    create : async (req, res, _next) => {
        const user = req.user
        const params = req.body
        const password = await bcrypt.hashSync(params.user_password, 10);
        const values = [null, password, 'manager', params.user_store_id]
        try{
            //토큰의 권한이 관리자일 경우
            if(user.id === 1 && user.role === 'admin'){
            const result = await excuteStatement('insert into user values(?,?,?,?)', values)
            res.status(200).send({
                ok: true,
                data: JSON.parse(JSONbig.stringify(result))
            })
            }else{
            throw new Error('권한이 없습니다.')
            }
        }catch(err){
            res.status(401).send({
            ok:false,
            message: err.message
            });
        }
    },
    delete : async (req, res, _next) => {
        const user = req.user;
        
        try{
            if(user.id === 1 && user.role === 'admin'){
            const result = await excuteStatement('delete from user where user_store_id = ?', [req.params.user_store_id])
            if(result.affectedRows > 0){
                res.status(200).send({
                ok: true,
                data: JSON.parse(JSONbig.stringify(result))
                })
            }else{
                throw new Error('존재하지 않는 매장 id입니다.')
            }
            }else{
            throw new Error('권한이 없습니다.')
            }
        }catch(err){
            res.status(401).send({
            ok:false,
            message: err.message
            });
        }
    }
};