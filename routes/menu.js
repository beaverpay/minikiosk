let express = require('express');
let router = express.Router();
let JSONbig = require('json-bigint');
let excuteStatement = require('../db/db');
let authJWT = require('../middlewares/authJWT');

/*
insert query의 결과 중 insertId가 bigint type 으로 반환 되기 때문에 처리 하지 못하는 문제 발생
json-bigint라이브러리 이용하여 처리
*/

/*메뉴 리스트 조회*/
router.get('/menuList/:menu_store_id', async function (req, res, _next) {
    let result = null;
    if (req.params.menu_store_id === 'all') {
        result = await excuteStatement('select * from menu')
        res.send(result)
    }else{
        await excuteStatement('select * from menu where menu_store_id = ?', [req.params.menu_store_id])
    }
});

/*메뉴 등록*/
router.post('/registMenu', authJWT, async function (req, res, _next) {
    let params = req.body;
    let result = null;
    let values = [null,
        params.menu_store_id,
        params.menu_name,
        params.menu_price,
        params.menu_desc,
        params.menu_stock];
    
    //menu_stock 값이 들어오지 않으면 default 값으로 처리
    if (values[values.length - 1] === undefined) { 
        values[values.length - 1] = 0;
    }

    try {
        result = await excuteStatement('insert into menu values(?,?,?,?,?,?)', values)
        res.send(JSON.parse(JSONbig.stringify(result)));
    } catch (err) { 
        res.send(err.message);
    }
});

/*메뉴 삭제 */
router.delete('deleteMenu/:menu_id', authJWT, function(req,res, _next){
    console.log(req.params.menu_id);
    let result = null
    try{
        //menu_id 가 같고 manager의 store_id와 menu의 menu_store_id 가 같은지 체크
        result = excuteStatement('delete * from menu where menu_id = ? and menu_store_id = ' , [req.params.menu_id])
        res.send(result)
    }catch(err){
        res.send(err)
    }
})

/*메뉴 재고 수정 : 재고를 입력한 값으로 변경*/ 
router.put('/changeStock/abs', async function (req, res, _next) {
    let params = req.body;
    let values = [params.menu_stock, params.id];
    let result = null;
    
    try {
        result = await excuteStatement(
            'update menu set menu_stock=? where id = ?',
            values
        )
        res.send(JSON.parse(JSONbig.stringify(result)))
    } catch (err) { 
        res.send(err.message)
    }    
});

/*메뉴 재고 수정 : 원래 재고에 더하고 빼기*/ 
router.put('/changeStock/rel', async function (req, res, _next) {
    let params = req.body;
    let values = [params.menu_stock, params.id];
    let result = null;
    
    try {
        result = await excuteStatement(
            'update menu set menu_stock = menu_stock + ? where id = ?',
            values
        )
        res.send(JSON.parse(JSONbig.stringify(result)))
    } catch (err) { 
        res.send(err.message)
    }    
});

module.exports = router;
