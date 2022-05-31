var express = require('express');
var router = express.Router();
let authJWT = require('../middlewares/authJWT');
let excuteStatement = require('../db/db');
const bcrypt = require('bcrypt');
let JSONbig = require('json-bigint');

/* admin 토큰인증 후 매니저 생성 */
router.post('/create', authJWT, async function(req, res, _next) {
  let store_id = req.store_id;
  let role = req.role;
  let result = null;

  try{
    if(store_id === 1 && role === 'admin'){
      result = await excuteStatement('insert into user values(?,?,?,?)', [null, password, 'manager', req.body.user_store_id])
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

module.exports = router;
