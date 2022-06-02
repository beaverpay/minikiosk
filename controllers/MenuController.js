const excuteStatement = require('../db/db');
const JSONbig = require('json-bigint');
const Menu = require('../models/Menu')

module.exports = {
	search: async (req, res, _next) => {
		const all = 'select * from menu';
		const sep = 'select * from menu where menu_store_id = ?';
		const sql = req.params.menu_store_id === 'all' ? all : sep;

		try {
			const result = await excuteStatement(sql, [req.params.menu_store_id]);
			res.status(200).send({
				ok: true,
				data: { result },
			});
		} catch (err) {
			res.status(401).send({
				ok: false,
				message: err.message,
			});
		}
	},
	regist: async (req, res, _next) => {
		const sql = 'insert into menu values(?,?,?,?,?,?)';
		const user = req.user;
		const { menu_name, menu_price, menu_desc, menu_stock } = req.body;
		const { menu_store_id } = req.params;
		const values = [null, menu_store_id, menu_name, menu_price, menu_desc, menu_stock ?? 0];

		try {
			if (user.id === parseInt(req.params.menu_store_id) || user.role === 'admin') {
				const result = await excuteStatement(sql, values);
				res.status(200).send({
					ok: true,
					data: JSON.parse(JSONbig.stringify(result)),
				});
			} else {
				throw new Error('권한이 없습니다.');
			}
		} catch (err) {
			res.status(401).send({
				ok: false,
				message: err.message,
			});
		}
	},
	delete: async (req, res, _next) => {
		const sql = 'delete from menu where id = ?';
		const user = req.user;
		const values = [req.params.id];
		try {
			//어떤 매장의 메뉴인지 확인
			const menu_store_id = await excuteStatement('select menu_store_id from menu where id = ?', values)
				.menu_store_id;
			//해당 매장의 매니저이거나 관리자이면
			if (user.id === parseInt(menu_store_id) || user.role === 'admin') {
				const result = await excuteStatement(sql, values);
				res.status(200).send({
					ok: true,
					data: JSON.parse(JSONbig.stringify(result)),
				});
			} else {
				throw new Error('권한이 없습니다.');
			}
		} catch (err) {
			res.status(401).send({
				ok: false,
				message: err.message,
			});
		}
	},
	update: async (req, res, _next) => {
		let sql = null;
		const { menu_stock, id } = req.body;
		const values = [menu_stock, id];
		const abs = 'update menu set menu_stock = ? where id = ?';
		const rel = 'update menu set menu_stock = menu_stock + ? where id = ?';

		try {
			if (req.params.method === 'abs') {
				sql = abs;
			} else if (req.params.method === 'rel') {
				sql = rel;
			} else {
				throw new Error('url에 마지막에 abs or rel 를 입력해 주세요');
			}

			const result = await excuteStatement(sql, values);
			res.status(200).send({
				ok: true,
				data: JSON.parse(JSONbig.stringify(result)),
			});
		} catch (err) {
			res.status(401).send({
				ok: false,
				message: err.message,
			});
		}
	},
	name: async (req, res, _next) => {
		const all = 'select * from menu where menu_name like ?';
		const sep = 'select * from menu where menu_store_id = ? and menu_name like ?';
		const values = [req.params.id, "%"+req.params.name+"%"];
		console.log(values)
		try{
			if (req.params.id === 'all') {
				result = await excuteStatement(
					all, "%" + req.params.name + "%")
					res.status(200).send({
						ok: true,
						data: {result}
					})
			}else{
				result = await excuteStatement(
					sep, values)      
					res.status(200).send({
						ok: true,
						data: {result}
					})
			}
		}
		catch (err) {
			res.status(401).send({
				ok: false,
				message: err.message,
			});
		}	
	},
	category: async (req, res, _next) => {
		const all = 'select * from menu where menu_category like ?';
		const sep = 'select * from menu where menu_store_id = ? and  menu_category like ?';
		const values = [req.params.id, "%"+req.params.category+"%"];
		console.log(values)
		try{
		if (req.params.id === 'all') {
			result = await excuteStatement(
				all, "%"+req.params.category+"%")
				res.status(200).send({
					ok: true,
					data: {result}
				})
		}else{
			result = await excuteStatement(
				sep, values)      
				res.status(200).send({
					ok: true,
					data: {result}
				})
		}}
		catch (err) {
			res.status(401).send({
				ok: false,
				message: err.message,
			});
		}	
	}
}
