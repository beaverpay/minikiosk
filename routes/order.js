let express = require('express');
let router = express.Router();
let JSONbig = require('json-bigint');
let excuteStatement = require('../db/db');

router.get('/orderList', async function(req, res, next) {
  try {
    result = await excuteStatement(
      'select orders.id, menu.menu_name, menu.menu_price, orders.order_amount, order_total from education.orders left join education.menu on orders.menu_id=menu.id')
      res.send(JSON.parse(JSONbig.stringify(result)))
  } catch (err) { 
        res.send(err.message)
    }  
});

router.post('/registOrder', async function(req, res, next) {
  let params = req.body;
  let paramArray = Object.values(params);
  //order insert
  let values = [null, ...paramArray]; 
  //menu update
  let values1 = [];

  let idExists = await excuteStatement('SELECT EXISTS ( select id from menu where id = ? ) AS A ', [params.menu_id]);
  let stockCnt = await excuteStatement('select menu_stock from menu where id = ?', [params.menu_id]);

  values.push(values[2]); //get order_amount value
  values.push(values[1]); //get menu_id value

if(idExists[0].A > 0 && stockCnt[0].menu_stock !== 0){
  excuteStatement('insert into orders(id, menu_id, order_amount, order_total) values (?,?,?,( select menu_price * ? from menu where id = ? ) )', values).catch(err=>{
    res.send(`${err}`)
  }).then(
    (result) => {

      values1.push(values[2]);
      values1.push(values[1]);

      excuteStatement('update menu set menu_stock = menu_stock - ? where id = ?', values1).catch(err=>{
        res.send(`${err}`)
      }).then(
        (result) => {
          res.send(JSON.parse(JSONbig.stringify(result)));
        },
      );
    },
  );
}
else if(idExists[0].A === 0){
  res.send("메뉴가 존재하지 않습니다.")
}
else if(stockCnt[0].menu_stock === 0){
  res.send("재고가 부족합니다.")
}
else{
  res.send("주문 실패")
}

});


module.exports = router;