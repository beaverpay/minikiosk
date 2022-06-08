const express = require('express');
const OrderController = require('../controllers/OrderController');
const router = express.Router();

router.get('/', OrderController.search);
router.get('/storeId/:menu_store_id', OrderController.searchByStoreId);

router.post('/', OrderController.post);

module.exports = router;
