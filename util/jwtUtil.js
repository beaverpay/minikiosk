const jwt = require('jsonwebtoken');
const secret = require('../config/jwt-secret.json').secret;


module.exports = {
  sign: (user)=>{ // access token 발급
    const payload = { // access token에 들어갈 payload
      id: user.id,
      role: user.role,
    };

    return jwt.sign(payload, secret, { // secret으로 sign하여 발급하고 return
      algorithm: 'HS256', // 암호화 알고리즘
      expiresIn: '1h', 	  // 유효기간
    });
  },
  verify: (token)=>{ // access token 검증
    try {
      const decoded = jwt.verify(token, secret);
      return {
        ok: true,
        id: decoded.id,
        role: decoded.role,
      };
    } catch (err) {
      return {
        ok: false,
        message: err.message,
      };
    }
  }
};