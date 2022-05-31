var express = require('express');
var router = express.Router();
let authJWT = require('../middlewares/authJWT');
let excuteStatement = require('../db/db');
let JSONbig = require('json-bigint');

/* 매장의 이름과 지점을 받아 매장 id를 반환 */
router.get('/read', async function(req, res, _next){
    let store_name = req.query.store_name;
    let store_branch = req.query.store_branch;
    let values = [store_name, store_branch]
    try{
        let result = await excuteStatement('select store_id from store where store_name = ? and store_branch = ?', values);
        res.status(200).send({
            ok:true,
            data: result[0]
        })
    }catch(err){
        res.status(401).send({
            ok:false,
            message: err.message
        });
    }
})

/* admin 토큰 인증 후 매장 생성 */
router.post('/create', authJWT, async function(req, res, _next) {
    let store_id = req.store_id;
    let role = req.role;

    let store_name = req.body.store_name;
    let store_branch = req.body.store_branch;
    let store_tel = req.body.store_tel;

    try{
        if(store_id === 1 && role === 'admin'){
        let result = await excuteStatement('insert into store values(?,?,?,?)', [null, store_name, store_branch, store_tel])
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
});

/* admin 토큰 인증 후 매장 삭제 */
router.delete('/delete/:store_id', authJWT, async function(req, res, _next){
    let store_id = req.store_id;
    let role = req.role;

    try{
        if(store_id === 1 && role === 'admin'){
            let result = await excuteStatement('delete from store where store_id = ?', [req.params.store_id])
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
});

module.exports = router;
