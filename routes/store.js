var express = require('express');
var router = express.Router();
let authJWT = require('../middlewares/authJWT');
let excuteStatement = require('../db/db');
const bcrypt = require('bcrypt');
let JSONbig = require('json-bigint');

/* admin 토큰 인증 후 매니저 생성 */
router.post('/create', authJWT, async function(req, res, _next) {
    let store_id = req.store_id;
    let role = req.role;
    let result = null;

    let store_name = req.body.store_name;
    let store_branch = req.body.store_branch;
    let store_tel = req.body.store_tel;

    try{
        if(store_id === 1 && role === 'admin'){
        result = await excuteStatement('insert into store values(?,?,?,?)', [null, store_name, store_branch, store_tel])
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

/* admin 토큰 인증 후 매니저 삭제 */
router.delete('/delete/:store_id', authJWT, async function(req, res, _next){
  let store_id = req.store_id;
  let role = req.role;
  let result = null;

  try{
    if(store_id === 1 && role === 'admin'){
      result = await excuteStatement('delete from store where store_id = ?', [req.params.store_id])
      res.status(200).send({
        ok: true,
        data: JSON.parse(JSONbig.stringify(result))
    })}else{
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
