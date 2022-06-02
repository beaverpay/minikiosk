const excuteStatement = require('../db/db');
const jwt = require('../util/jwtUtil');
const bcrypt = require('bcrypt');

module.exports = {
    login : async (req, res, _next) => {
        const {user_store_id, user_password} = req.body
    
        try {
            const managerInfo = await excuteStatement('select user_password,user_role from user where user_store_id = ?', [
                user_store_id,
            ]);
            if (!managerInfo[0]) {
                throw new Error('없는 매장 입니다.');
            }
            if (await bcrypt.compareSync(user_password, managerInfo[0].user_password)) {
                let user = { id: user_store_id, role: managerInfo[0].user_role };
                const accessToken = jwt.sign(user);
                res.status(200).send({
                    // client에게 토큰을 반환합니다.
                    ok: true,
                    data: {
                        accessToken,
                    },
                });
            } else {
                res.status(401).send({
                    ok: false,
                    message: '틀린 비밀번호 입니다.',
                });
            }
        } catch (err) {
            res.status(500).send({
                ok: false,
                message: err.message,
            });
        }
    }
}