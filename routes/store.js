const express = require('express');
const authJWT = require('../middlewares/authJWT');
const excuteStatement = require('../db/db');
const router = express.Router();
const JSONbig = require('json-bigint');

/* 매장의 이름과 지점을 받아 매장 id를 반환 */
router.get('/', async (req, res, _next) => {
    const store_name = req.query.store_name;
    const store_branch = req.query.store_branch;
    const values = [store_name, store_branch]
    try{
        const result = await excuteStatement('select store_id from store where store_name = ? and store_branch = ?', values);
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
router.post('/', authJWT, async (req, res, _next) => {
    const store_id = req.store_id;
    const role = req.role;
    const params = req.body;
    const values = [null, params.store_name, params.store_branch, params.store_tel]

    try{
        if(store_id === 1 && role === 'admin'){
        const result = await excuteStatement('insert into store values(?,?,?,?)', values)
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
router.delete('/:store_id', authJWT, async (req, res, _next) => {
    const store_id = req.store_id;
    const role = req.role;

    try{
        if(store_id === 1 && role === 'admin'){
            const result = await excuteStatement('delete from store where store_id = ?', [req.params.store_id])
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
