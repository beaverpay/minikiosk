var express = require('express');
var router = express.Router();
var excuteStatement = require('../db/db');

/* GET users listing. */
router.get('/menuList', function(req, res, next) {
    /*
    모든 메뉴를 jsonList 형태로 반환
     */
    excuteStatement('select * from menu',function(menuList){res.send(menuList);});
});

router.get('/addMenu', function(req, res, next) {
    /*
    
     */
    let menu_name = req.params("menu_name");
    
    excuteStatement('insert into menu values()');
});

module.exports = router;
