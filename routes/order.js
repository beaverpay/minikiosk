const express = require('express');
const excuteStatement = require('../db/db');
const JSONbig = require('json-bigint');
const OrderController = require('../controllers/OrderController');
const router = express.Router();

router.get('/orders', OrderController.search);

router.post('/regist', OrderController.post); 

module.exports = router;