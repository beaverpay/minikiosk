const express = require('express');
const router = express.Router();
const authController = require('../controllers/AuthController')

//매장 아이디와 비밀번호를 받아 토큰 반환
router.post('/', authController.login);

module.exports = router;