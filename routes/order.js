const express = require('express');
const OrderController = require('../controllers/OrderController');
const router = express.Router();

router.get('/orders', OrderController.search);

router.post('/regist', OrderController.post); 

module.exports = router;