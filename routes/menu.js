var express = require('express');
var router = express.Router();
var pool = require('../db/db');

/* GET users listing. */
router.get('/menuList', function(req, res, next) {
    console.log('test3')
    console.log(pool('select * from menu'));
    console.log('test4')
});

router.get('/addMenu', function(req, res, next) {
    res.send('respond with a resource');
});

module.exports = router;
