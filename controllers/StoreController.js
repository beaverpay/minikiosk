const excuteStatement = require('../db/db');
const JSONbig = require('json-bigint');

module.exports = {
	async searchAll(){},
	async search(req, res, next) {
		const { store_name, store_branch } = req.query;
		const values = [store_name, store_branch];

		try {
			const result = await excuteStatement(
				'select store_id from store where store_name = ? and store_branch = ?',
				values,
			);
			res.status(200).send({
				ok: true,
				data: result,
			});
		} catch (err) {
			next(err);
		}
	},
	async create(req, res, next) {
		const params = req.body;
		const values = [null, params.store_name, params.store_branch, params.store_tel];

		try {
			const result = await excuteStatement('insert into store values(?,?,?,?)', values);
			res.status(201).send({
				ok: true,
				data: JSON.parse(JSONbig.stringify(result)),
			});
		} catch (err) {
			next(err);
		}
	},
	async delete(req, res, next) {
		const values = [req.params.store_id];

		try {
			const result = await excuteStatement('delete from store where store_id = ?', values);
			if (result.affectedRows > 0) {
				res.status(200).send({
					ok: true,
					data: JSON.parse(JSONbig.stringify(result)),
				});
			} else {
				const error = new Error('존재하지 않는 매장 id입니다.');
				error.status = 400;
				throw error;
			}
		} catch (err) {
			next(err);
		}
	},
};
