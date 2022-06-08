const express = require('express');
const OrderController = require('../controllers/OrderController');
const router = express.Router();

router.get('/:id', OrderController.search);
router.post('/', OrderController.post);

module.exports = router;
