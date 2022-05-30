const { verify } = require('../util/jwtUtil');

const authJWT = (req, res, next) => {
  if (req.headers.authorization) {
    const token = req.headers.authorization; // header에서 access token을 가져옵니다.
    const result = verify(token); // token을 검증합니다.
    if (result.ok) { // token이 검증되었으면 req에 값을 세팅하고, 다음 콜백함수로 갑니다.
      //매니저는 자신의 매장의 권한을 가지고 관리자는 모든 매장의 권한을 가진다.
      if((result.id === req.body.menu_store_id && result.role === 'manager')|| result.role === 'admin'){
        next();
      }
      else{
        res.status(401).send({
          ok: false,
          message: '권한이 없습니다.', 
        });
      }
    } else { // 검증에 실패하거나 토큰이 만료되었다면 클라이언트에게 메세지를 담아서 응답합니다.
      res.status(401).send({
        ok: false,
        message: result.message, // jwt가 만료되었다면 메세지는 'jwt expired'입니다.
      });
    }
  }
};

module.exports = authJWT;