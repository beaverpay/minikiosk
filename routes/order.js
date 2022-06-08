const express = require('express');
const OrderController = require('../controllers/OrderController');
const router = express.Router();

<<<<<<< Updated upstream
router.get('/', OrderController.search);
router.get('/storeId/:menu_store_id', OrderController.searchByStoreId);
=======
router.get('/:id', OrderController.search);
>>>>>>> Stashed changes

router.post('/', OrderController.post);

module.exports = router;
