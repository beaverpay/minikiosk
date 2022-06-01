const express = require('express');
const router = express.Router();
const excuteStatement = require('../db/db');
const jwt = require('../util/jwtUtil');
const bcrypt = require('bcrypt');

//매장 아이디와 비밀번호를 받아 토큰 반환
router.post('/', async (req, res, _next) => {
	const store_id = req.body.user_store_id;
	const password = req.body.user_password;

	try {
		const managerInfo = await excuteStatement('select user_password,user_role from user where user_store_id = ?', [
			store_id,
		]);
		if (!managerInfo[0]) {
			throw new Error('없는 매장 입니다.');
		}
		if (await bcrypt.compareSync(password, managerInfo[0].user_password)) {
			let user = { id: store_id, role: managerInfo[0].user_role };
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
});

module.exports = router;
