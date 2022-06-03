const express = require('express');
const authJWT = require('../middlewares/authJWT');
const router = express.Router();
const userController = require('../controllers/UserController.js');
const isAdmin = require('../middlewares/isAdmin')

/* admin 토큰 인증 후 매니저 생성 */
router.post('/', authJWT, isAdmin, userController.create);

/* admin 토큰 인증 후 매니저 삭제 */
router.delete('/:user_store_id', authJWT, isAdmin, userController.delete);

module.exports = router;
