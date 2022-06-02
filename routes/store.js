const express = require('express');
const authJWT = require('../middlewares/authJWT');
const router = express.Router();
const storeController = require('../controllers/StoreController');

/* 매장의 이름과 지점을 받아 매장 id를 반환 */
router.get('/', storeController.search);

/* admin 토큰 인증 후 매장 생성 */
router.post('/', authJWT, storeController.create);

/* admin 토큰 인증 후 매장 삭제 */
router.delete('/:store_id', authJWT, storeController.delete);

module.exports = router;
