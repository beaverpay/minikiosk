var express = require('express');
var router = express.Router();
var urlencode = require('urlencode')
var excuteStatement = require('../db/db');

/* GET users listing. */
router.get('/menuList', function(req, res, next) {
    excuteStatement('select * from menu',function(menuList){
        res.send(menuList);
    });
});

router.get('/menuAddition', function(req, res, next) {
    let menu_name = urlencode.decode(req.param('menu_name'));
    let menu_price = urlencode.decode(req.param('menu_name'));
    let menu_des = urlencode.decode(req.param('menu_name'));
    excuteStatement('insert into menu values(?,?,?,?)',[menu_name,menu_price,menu_des],function(result){
        res.send(result);
    })
    res.send('respond with a resource');
});

module.exports = router;
