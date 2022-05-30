let express = require('express');
let router = express.Router();
let excuteStatement = require('../db/db');
const jwt = require('../util/jwtUtil');
const bcrypt = require('bcrypt');

router.post('/', async function(req, res, next) {
    let store_id = req.body.user_store_id
    let password = req.body.user_password
    let dbGetData = await excuteStatement('select user_password,user_role from user where user_store_id = ?', [store_id])
    if (await bcrypt.compareSync(password,dbGetData[0].user_password)) { 
        let user = {id: store_id, role: dbGetData[0].user_role}
        const accessToken = jwt.sign(user);
        res.status(200).send({ // client에게 토큰을 반환합니다.
            ok: true,
            data: {
                accessToken
            }
        })
    }
    else {
        res.status(401).send({
            ok: false,
            message: 'password is incorrect',
        });
    }
});

module.exports = router;