const express = require('express');
const excuteStatement = require('../db/db');
const authJWT = require('../middlewares/authJWT');
const router = express.Router();
const menuController = require('../controllers/MenuController.js');

/*
insert query의 결과 중 insertId가 bigint type 으로 반환 되기 때문에 처리 하지 못하는 문제 발생
json-bigint라이브러리 이용하여 처리
*/

/*메뉴 리스트 조회*/
/*
전체 혹은 일부 매장의 메뉴 리스트 조회
*/
router.search('/:menu_store_id', menuController.search);

/*메뉴 등록*/
/*
매장의 매니저 혹은 전체 관리자로부터 매장 id(pathString)와
메뉴 정보(json)를 입력받아 등록
*/
router.post('/:menu_store_id', authJWT, menuController.regist);

/*메뉴 삭제 */
/*
매장의 매니저 혹은 전체 관리자 기능
메뉴 아이디를 입력받아 해당 메뉴를 제거
*/
router.delete('/:id', authJWT, menuController.delete);

/*메뉴 재고 수정 : abs 재고를 입력한 값으로 변경 / rel 원래 재고에 더하고 빼기*/
router.put('/stock/:method', menuController.update);



/*메뉴 검색: 메뉴명 */ 
router.post('/search/name', menuController.name);

/*메뉴 검색: 카테고리*/ 
router.post('/search/category', menuController.category);

module.exports = router;
