const excuteStatement = require('../db/db');
const bcrypt = require('bcrypt');
const JSONbig = require('json-bigint');

module.exports = {
	async regist(req, res, next) {
		const params = req.body;
		const password = await bcrypt.hash(params.user_password, 10);
		const values = [null, password, 'manager', params.user_store_id];
		try {
			const result = await excuteStatement('insert into user values(?,?,?,?)', values);
			res.status(201).send({
				ok: true,
				data: JSON.parse(JSONbig.stringify(result)),
			});
		} catch (err) {
			next(err);
		}
	},
	async remove(req, res, next) {
		try {
			const result = await excuteStatement('delete from user where user_store_id = ?', [
				req.params.user_store_id,
			]);
			if (result.affectedRows > 0) {
				res.status(200).send({
					ok: true,
					data: JSON.parse(JSONbig.stringify(result)),
				});
			} else {
				const error = new Error('존재하지 않는 매장 id입니다.');
				error.status = 401;
				throw error;
			}
		} catch (err) {
			next(err);
		}
	},
	async serach(req, res, next){
		try{
			const result = await excuteStatement('select * from user')
			res.status(200).send({
				ok: true,
				data: JSON.parse(JSONbig.stringify(result)),
			});
		}catch(err){
			next(err);
		}
	}
};
