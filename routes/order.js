var express = require('express');
var queryExcute = require('../config/db-config.json');
var router = express.Router();

//주문 생성
router.get('/addOrder', function(req, res, next) {
    queryExcute('insert into order values(1,1,1,1000)');
    res.send('add order');
});

//전체 주문 조회
router.get('/findAll', function(req, res, next){
    res.send('order list');
});

module.exports = router;