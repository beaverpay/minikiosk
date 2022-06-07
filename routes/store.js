const express = require('express');
const authJWT = require('../middlewares/authJWT');
const router = express.Router();
const storeController = require('../controllers/StoreController');
const isAdmin = require('../middlewares/isAdmin')
const isPositiveNum = require('../middlewares/isPositiveNum')

/* 매장의 이름과 지점을 받아 매장 id를 반환 */
router.get('/:store_name/:store_branch', storeController.search);

/* admin 토큰 인증 후 매장 생성 */
router.post('/', authJWT, isAdmin, storeController.create);

/* admin 토큰 인증 후 매장 삭제 */
router.delete('/:store_id', isPositiveNum('store_id'), authJWT, isAdmin, storeController.delete);

module.exports = router;
