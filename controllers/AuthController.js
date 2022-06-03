const excuteStatement = require('../db/db');
const jwt = require('../util/jwtUtil');
const bcrypt = require('bcrypt');

module.exports = {
    async login(req, res, next){
        const {user_store_id, user_password} = req.body
    
        try {
            const managerInfo = await excuteStatement('select user_password,user_role,user_store_id from user where user_store_id = ?', [
                user_store_id,
            ]);
            if (!managerInfo[0]) {
                const err = new Error('없는 매장입니다.');
                err.status = 400;
                throw err;
            }
            if (await bcrypt.compare(user_password, managerInfo[0].user_password)) {
                let user = { id: managerInfo[0].user_store_id, role: managerInfo[0].user_role };
                const accessToken = jwt.sign(user);
                res.status(200).send({
                    // client에게 토큰을 반환합니다.
                    ok: true,
                    data: {
                        accessToken,
                    },
                });
            } else {
                const err = new Error('틀린 비밀번호 입니다.');
                err.status = 401;
                throw err;
            }
        } catch (err) {
            next(err);
        }
    }
}