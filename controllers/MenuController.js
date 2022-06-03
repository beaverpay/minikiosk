const excuteStatement = require('../db/db');
const JSONbig = require('json-bigint');

module.exports = {
	async search(req, res, next){
		const all = 'select * from menu';
		const sep = 'select * from menu where menu_store_id = ?';
		const menu_store_id = parseInt(req.params.menu_store_id ?? 0);
		const sql = menu_store_id ? sep : all;
		console.log(sql);
		try {
			const result = await excuteStatement(sql, [menu_store_id]);
			res.status(200).send({
				ok: true,
				data: { result },
			});
		} catch (err) {
			next(err);
		}
	},
	async regist(req, res, next){
		const sql = 'insert into menu values(?,?,?,?,?,?,?)';
		const { menu_name, menu_price, menu_desc, menu_category, menu_stock } = req.body;
		const { menu_store_id } = req.params;
		const values = [null, menu_store_id, menu_name, menu_price, menu_desc, menu_category, menu_stock ?? 0];
		try {
			const result = await excuteStatement(sql, values);
			res.status(201).send({
				ok: true,
				data: JSON.parse(JSONbig.stringify(result)),
			});
		} catch (err) {
			next(err);
		}
	},
	async delete(req, res, next){
		const sql = 'delete from menu where id = ?';
		const user = req.user;
		const values = [req.params.id];
		try {
			//어떤 매장의 메뉴인지 확인
			const menu_store_id = await excuteStatement('select menu_store_id from menu where id = ?', values)
				.menu_store_id;
			//해당 매장의 매니저이거나 관리자이면
			const result = await excuteStatement(sql, values);
			res.status(200).send({
				ok: true,
				data: JSON.parse(JSONbig.stringify(result)),
			});
		} catch (err) {
			next(err);
		}
	},
	async update(req, res, next){
		let sql = null;
		const { menu_stock, id } = req.body;
		const values = [menu_stock, id];
		const method = {
			abs : 'update menu set menu_stock = ? where id = ?',
			rel : 'update menu set menu_stock = menu_stock + ? where id = ?'
		}
		try {
			if (req.params.method === 'abs' || req.params.method === 'rel') {
				sql = method[req.params.method];
			} else {
				const error = new Error('Bad Request : url에 마지막에 abs or rel 를 입력해 주세요');
				error.status(400)
				throw error;
			}

			const result = await excuteStatement(sql, values);
			res.status(200).send({
				ok: true,
				data: JSON.parse(JSONbig.stringify(result)),
			});
		} catch (err) {
			next(err);
		}
	},
	async name(req, res, next){
		const all = 'select * from menu where menu_name like ?';
		const sep = 'select * from menu where menu_store_id = ? and menu_name like ?';
		const sql = req.params.id === 'all' ? all : sep;
		const values = req.params.id === 'all' ? ['%' + req.params.name + '%'] : [req.params.id, '%' + req.params.name + '%'];

		try {
			result = await excuteStatement(sql, values);
			res.status(200).send({
				ok: true,
				data: JSON.parse(JSONbig.stringify(result)),
			});
		} catch (err) {
			next(err);
		}
	},
	async category(req, res, next){
		const all = 'select * from menu where menu_category like ?';
		const sep = 'select * from menu where menu_store_id = ? and  menu_category like ?';
		const sql = req.params.id === 'all' ? all : sep;
		const values = req.params.id === 'all' ? ['%' + req.params.category + '%'] : [req.params.id, '%' + req.params.category + '%'];
		console.log(values);
		try {
			result = await excuteStatement(sql, values);
			res.status(200).send({
				ok: true,
				data: JSON.parse(JSONbig.stringify(result)),
			});
		} catch (err) {
			next(err);
		}
	},
};
