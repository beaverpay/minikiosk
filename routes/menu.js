let express = require('express');
let router = express.Router();
let JSONbig = require('json-bigint');
let excuteStatement = require('../db/db');
let keyUtil = require('../util/keyUtil');
let keyArrays = require('../util/keyArrays');

/*메뉴 리스트 조회*/
router.get('/menuList/:menu_store_id', function (req, res, _next) {
    if(req.params.menu_store_id ){
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
router.post('/registMenu', function (req, res, _next) {
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

    /*
    insert query의 결과 중 insertId가 bigint type 으로 반환 되기 때문에 처리 하지 못하는 문제 발생
    json-bigint라이브러리 이용하여 처리
    */
    excuteStatement('insert into menu values(?,?,?,?,?,?)', values).catch(err=>{
        res.send(`${err}`)
    }).then(
        (result) => {
            res.send(JSON.parse(JSONbig.stringify(result)));
        },
    );
});

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
