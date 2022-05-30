var express = require('express');
var router = express.Router();
let authJWT = require('../middlewares/authJWT');
let excuteStatement = require('../db/db');
const bcrypt = require('bcrypt');
let JSONbig = require('json-bigint');

/* GET users listing. */
router.post('/create', authJWT, async function(req, res, next) {
  let store_id = req.body.user_store_id
  let password = await bcrypt.hashSync(req.body.user_password, 10)
  let role = 'manager'
  let result = null;

  try{
    result = await excuteStatement('insert into user values(?,?,?,?)', [null, password, role, store_id])
    res.send(JSON.parse(JSONbig.stringify(result)));
  }catch(err){
    res.send(err.message)
  }
});

module.exports = router;
