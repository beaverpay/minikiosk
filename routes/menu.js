let express = require('express');
let router = express.Router();
let JSONbig = require('json-bigint');
let excuteStatement = require('../db/db');
let keyUtil = require('../util/keyUtil');
let keyArrays = require('../util/keyArrays');
let authJWT = require('../middlewares/authJWT');

/*
insert query의 결과 중 insertId가 bigint type 으로 반환 되기 때문에 처리 하지 못하는 문제 발생
json-bigint라이브러리 이용하여 처리
*/

/*메뉴 리스트 조회*/
router.get('/menuList/:menu_store_id', function (req, res, _next) {
    if(req.params.menu_store_id === 'all'){
        excuteStatement('select * from menu').then((result) => {
            res.send(JSON.parse(JSONbig.stringify(result)));
        });
    }else{
        excuteStatement('select * from menu where menu_store_id = ?', [req.params.menu_store_id]).catch(err=>{
            res.send(`${err}`)
        }).then((result) => {
            res.send(JSON.parse(JSONbig.stringify(result)));
        });
    }
});

/*메뉴 등록*/
router.post('/registMenu', authJWT, function (req, res, _next) {
    let params = req.body;
    let inputKeyArray = Object.keys(params);
    let values = null;
    if (
        keyUtil.keyCompare(
            inputKeyArray.length === 4
                ? keyArrays.registMenuKeys.slice(0, 4)
                : keyArrays.registMenuKeys,
            inputKeyArray,
        )
    ) {
        values = [null, ...Object.values(params), 0]; //재고 값이 들어오지 않았을 경우 기본값 0으로 설정
    } else{
        throw new Error("키값이 잘못 입력 되었습니다.")
    }

    excuteStatement('insert into menu values(?,?,?,?,?,?)', values).catch(err=>{
        res.send(`${err}`)
    }).then(
        (result) => {
            res.send(JSON.parse(JSONbig.stringify(result)));
        },
    );
});

/*메뉴 삭제 */
router.delete('deleteMenu/:menu_id', authJWT, function(req,res, _next){
    console.log(req.params.menu_id);
    let result =null
    try{
        //menu_id 가 같고 manager의 store_id와 menu의 menu_store_id 가 같은지 체크
        result = excuteStatement('delete * from menu where menu_id = ? and menu_store_id = ' , [req.params.menu_id])
        res.send(result)
    }catch(err){
        res.send(err)
    }
})

/*메뉴 재고 수정*/
router.put('/changeStock', function (req, res, _next) {
    let params = req.body;
    let inputKeyArray = Object.keys(params);
    let values = null;
    //재고를 입력한 값으로 변경
    if (keyUtil.keyCompare(keyArrays.changeStockAbsoluteValueKeys, inputKeyArray)) {
        values = [...Object.values(params)];
        excuteStatement(
            'update menu set menu_stock=? where id = ?',
            values
        ).catch(err=>{
            res.send(`${err}`)
        }).then((result) => {
            res.send(JSON.parse(JSONbig.stringify(result)));
        })
    } //재고에 입력한 값을 더해서 저장
    else if(keyUtil.keyCompare(keyArrays.changeStockRelativeValueKeys, inputKeyArray)){
        values = [...Object.values(params)];
        excuteStatement(
            `update menu set menu_stock = menu_stock + ? where id = ?`,
            values
        ).catch(err=>{
            res.send(`${err}`)
        }).then((result) => {
            res.send(JSON.parse(JSONbig.stringify(result)));
        })
    }else{
        throw new Error("키값이 잘못 입력 되었습니다.")
    }
});

/*join 테스트*/
router.get('/joinTest', async function(_req, res, _next){
    let result = await excuteStatement('select * from menu join store on menu.menu_store_id = store.store_id')
    res.send(result)
})

module.exports = router;
