const excuteStatement = require('../db/db');
const JSONbig = require('json-bigint');

module.exports = {
    search : async (req, res, _next) => {
        const {store_name, store_branch} = req.query;
        const values = [store_name, store_branch];

        try {
            const result = await excuteStatement(
                'select store_id from store where store_name = ? and store_branch = ?',
                values,
            );
            res.status(200).send({
                ok: true,
                data: result[0],
            });
        } catch (err) {
            res.status(401).send({
                ok: false,
                message: err.message,
            });
        }
    },
    create : async (req, res, _next) => {
        const user = req.user;
        const params = req.body;
        const values = [null, params.store_name, params.store_branch, params.store_tel];
    
        try {
            if (user.id === 1 && user.role === 'admin') {
                const result = await excuteStatement('insert into store values(?,?,?,?)', values);
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
    delete : async (req, res, _next) => {
        const user = req.user;
        const values = [req.params.store_id];

        try {
            if (user.id === 1 && user.role === 'admin') {
                const result = await excuteStatement('delete from store where store_id = ?', values);
                if (result.affectedRows > 0) {
                    res.status(200).send({
                        ok: true,
                        data: JSON.parse(JSONbig.stringify(result)),
                    });
                } else {
                    throw new Error('존재하지 않는 매장 id입니다.');
                }
            } else {
                throw new Error('권한이 없습니다.');
            }
        } catch (err) {
            res.status(401).send({
                ok: false,
                message: err.message,
            });
        }
    }
};