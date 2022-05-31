const express = require('express');
const authJWT = require('../middlewares/authJWT');
const excuteStatement = require('../db/db');
const router = express.Router();
const bcrypt = require('bcrypt');
const JSONbig = require('json-bigint');

/* admin 토큰 인증 후 매니저 생성 */
router.post('/', authJWT, async (req, res, _next) => {
  const store_id = req.store_id;
  const role = req.role;
  const params = req.body
  const password = await bcrypt.hashSync(params.user_password, 10);
  const values = [null, password, 'manager', params.user_store_id]
  try{
    if(store_id === 1 && role === 'admin'){
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
});

/* admin 토큰 인증 후 매니저 삭제 */
router.delete('/:user_store_id', authJWT, async (req, res, _next) => {
  const store_id = req.store_id;
  const role = req.role;

  try{
    if(store_id === 1 && role === 'admin'){
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
});

module.exports = router;
