const express = require('express');
const excuteStatement = require('../db/db');
const authJWT = require('../middlewares/authJWT');
const router = express.Router();
const JSONbig = require('json-bigint');

/*
insert query의 결과 중 insertId가 bigint type 으로 반환 되기 때문에 처리 하지 못하는 문제 발생
json-bigint라이브러리 이용하여 처리
*/

/*메뉴 리스트 조회*/
/*
전체 혹은 일부 매장의 메뉴 리스트 조회
*/
router.get('/:menu_store_id', async (req, res, _next) => {
    let sql = null;

    if (req.params.menu_store_id === 'all') {
        sql = 'select * from menu';
    }else{
        sql = 'select * from menu where menu_store_id = ?';
    }

    try{
        const result = await excuteStatement(sql, [req.params.menu_store_id])
        res.status(200).send({
            ok: true,
            data: {result}
        })
    }catch(err){
        res.status(401).send({
            ok:false,
            message: err.message
        });
    }
});

/*메뉴 등록*/
/*
매장의 매니저 혹은 전체 관리자로부터 매장 id(pathString)와
메뉴 정보(json)를 입력받아 등록
*/
router.post('/regist/:menu_store_id', authJWT, async (req, res, _next) => {
    const sql = 'insert into menu values(?,?,?,?,?,?)'
    const store_id = req.store_id;
    const role = req.role;
    const params = req.body;
    const values = [
        null,
        req.params.menu_store_id,
        params.menu_name,
        params.menu_price,
        params.menu_desc,
        params.menu_stock
    ];

    try {
        if (store_id === parseInt(req.params.menu_store_id) || role === 'admin') {
            //menu_stock 값이 들어오지 않으면 0으로 처리
            if (values[values.length - 1] === undefined) { 
                values[values.length - 1] = 0;
            }

            const result = await excuteStatement(sql , values)
            res.status(200).send({
                ok: true,
                data: JSON.parse(JSONbig.stringify(result))
            })
        } else { 
            throw new Error('권한이 없습니다.');
        }
    } catch (err) { 
        res.status(401).send({
            ok:false,
            message: err.message
        });
    }
});

/*메뉴 삭제 */
/*
매장의 매니저 혹은 전체 관리자 기능
메뉴 아이디를 입력받아 해당 메뉴를 제거
*/
router.delete('/delete/:id', authJWT, async (req,res, _next) => {
    const sql = 'delete from menu where id = ?';
    const store_id = req.store_id;
    const role = req.role;

    try{
        //어떤 매장의 메뉴인지 확인
        const menu_store_id = await excuteStatement('select menu_store_id from menu where id = ?' , [req.params.id])
        menu_store_id = menu_store_id[0].menu_store_id;
        //해당 매장의 매니저이거나 관리자이면
        if (store_id === menu_store_id || role === 'admin') {
            const result = await excuteStatement(sql , [req.params.id])
            res.status(200).send({
                ok: true,
                data: JSON.parse(JSONbig.stringify(result))
            })
        }else {
            throw new Error('권한이 없습니다.');
        }
    }catch(err){
        res.status(401).send({
            ok:false,
            message: err.message
        });
    }
})

/*메뉴 재고 수정 : 재고를 입력한 값으로 변경*/ 
router.put('/stock/abs', async (req, res, _next) => {
    const sql = 'update menu set menu_stock = ? where id = ?';
    const params = req.body;
    const values = [params.menu_stock, params.id];
    
    try {
        const result = await excuteStatement(sql, values)
        res.status(200).send({
            ok: true,
            data: JSON.parse(JSONbig.stringify(result))
        })
    } catch (err) { 
        res.status(401).send({
            ok:false,
            message: err.message
        });
    }    
});

/*메뉴 재고 수정 : 원래 재고에 더하고 빼기*/ 
router.put('/stock/rel', async (req, res, _next) => {
    const sql = 'update menu set menu_stock = menu_stock + ? where id = ?';
    const params = req.body;
    const values = [params.menu_stock, params.id];
    
    try {
        const result = await excuteStatement(sql, values)
        res.status(200).send({
            ok: true,
            data: JSON.parse(JSONbig.stringify(result))
        })
    } catch (err) { 
        res.status(401).send({
            ok:false,
            message: err.message
        });
    }    
});

module.exports = router;