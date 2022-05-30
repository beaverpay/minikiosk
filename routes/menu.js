let express = require('express');
let router = express.Router();
let JSONbig = require('json-bigint');
let excuteStatement = require('../db/db');
let keyUtil = require('../util/keyUtil');
let keyArrays = require('../util/keyArrays');

/*메뉴 리스트 조회*/
router.get('/menuList', function (_req, res, _next) {
    excuteStatement('select * from menu').then((result) => {
        res.send(result);
    });
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
    }

    /*
    insert query의 결과 중 insertId가 bigint type 으로 반환 되기 때문에 처리 하지 못하는 문제 발생
    json-bigint라이브러리 이용하여 처리
    */
    excuteStatement('insert into menu values(?,?,?,?,?,?)', values).then(
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
    if (keyUtil.keyCompare(keyArrays.changeStockKeys, inputKeyArray)) {
        values = [...Object.values(params)];
    }

    excuteStatement(
        'update menu set menu_stock=? where menu_id=?',
        values,
    ).then((result) => {
        res.send(JSON.parse(JSONbig.stringify(result)));
    }).catch((err)=>{console.err(err);});
});

module.exports = router;
