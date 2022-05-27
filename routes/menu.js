let express = require('express');
let router = express.Router();
let JSONbig = require('json-bigint');
let excuteStatement = require('../db/db');



router.get('/menuList', function(req, res, next) {
    excuteStatement('select * from menu',function(menuList){
        res.send(menuList);
    });
});

router.post('/registMenu', function(req, res, next) {
    let params = req.body;
    let values = [null,params.menu_name,params.menu_price,params.menu_des];
    /*
    insert query의 결과 중 insertId가 bigint type 으로 반환 되기 때문에 처리 하지 못하는 문제 발생
    json-bigint라이브러리 이용하여 처리
    */
    excuteStatement('insert into menu values(?,?,?,?)', function(result){
        res.send(JSON.parse(JSONbig.stringify(result)))
    }, values);
});

module.exports = router;
