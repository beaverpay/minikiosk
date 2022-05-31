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
  let password = await bcrypt.hashSync(req.body.user_password, 10);
  try{
    if(store_id === 1 && role === 'admin'){
      let result = await excuteStatement('insert into user values(?,?,?,?)', [null, password, 'manager', req.body.user_store_id])
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
router.delete('/delete/:user_store_id', authJWT, async function(req, res, _next){
  let store_id = req.store_id;
  let role = req.role;

  try{
    if(store_id === 1 && role === 'admin'){
      let result = await excuteStatement('delete from user where user_store_id = ?', [req.params.user_store_id])
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
