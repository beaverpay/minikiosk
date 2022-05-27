var express = require('express');
var router = express.Router();
var pool = require('../db/db');

/* GET users listing. */
router.get('/menuList', function(req, res, next) {
    pool('select * from menu',function(menuList){res.send(menuList);});
});

router.get('/addMenu', function(req, res, next) {
    res.send('respond with a resource');
});

module.exports = router;
