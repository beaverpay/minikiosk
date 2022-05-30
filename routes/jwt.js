let express = require('express');
let router = express.Router();
let JSONbig = require('json-bigint');
let excuteStatement = require('../db/db');
const jwt = require('../util/jwtUtil');

router.post('/', async function(req, res, next) {
    let store_id = req.body.user_store_id
    let password = req.body.user_password
    let db_password = await excuteStatement('select user_password from user where user_store_id = ?', [store_id])
    if(password === db_password[0].user_password){
        const accessToken = jwt.sign({id: store_id, role: 'manager'});
        console.log(accessToken);
        res.send(accessToken)
    }
});

module.exports = router;