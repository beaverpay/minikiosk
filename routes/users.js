const express = require('express');
const authJWT = require('../middlewares/authJWT');
const router = express.Router();
const userController = require('../controllers/UserController.js');
const isAdmin = require('../middlewares/isAdmin')
const isPositiveNum = require('../middlewares/isPositiveNum')

router.get('/', authJWT, isAdmin, userControlelr.serach)
/* admin 토큰 인증 후 매니저 생성 */
router.post('/', authJWT, isAdmin, userController.regist);

/* admin 토큰 인증 후 매니저 삭제 */
router.delete('/:user_store_id', isPositiveNum('user_store_id'), authJWT, isAdmin, userController.remove);

module.exports = router;
