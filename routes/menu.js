let express = require('express');
let router = express.Router();
let JSONbig = require('json-bigint');
let excuteStatement = require('../db/db');


/*메뉴 리스트 조회*/
router.get('/menuList', function(req, res, next) {
    excuteStatement('select * from menu',function(menuList){
        res.send(menuList);
    });
});

/*메뉴 등록*/
router.post('/registMenu', function(req, res, next) {
    let params = req.body;
    let paramArray = Object.values(params); //params의 value 배열
    let values = [null,...paramArray,0]; //paramArray length에 따라 다르게 동작해야 함 리팩토링 필요
    /*
    insert query의 결과 중 insertId가 bigint type 으로 반환 되기 때문에 처리 하지 못하는 문제 발생
    json-bigint라이브러리 이용하여 처리
    */
    excuteStatement('insert into menu values(?,?,?,?,?)', function(result){
        res.send(JSON.parse(JSONbig.stringify(result)))
    }, values);
});

/*메뉴 재고 수정*/
//현재 테이블 구조상 menu_name이 중복으로 들어가기 때문에 조정 필요
router.put('/changeStock', function(req, res, next){
    let params = req.body;
    let paramArray = Object.values(params);
    let values = [...paramArray]
    excuteStatement('update menu set menu_stock=? where menu_name=?',function(result){
        res.send(JSON.parse(JSONbig.stringify(result)))
    }, values);
})

module.exports = router;
