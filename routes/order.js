const express = require('express');
const excuteStatement = require('../db/db');
const JSONbig = require('json-bigint');
const router = express.Router();

router.get('/orders', async (req, res, next) => {
  try {
    result = await excuteStatement(
      'select orders.id, menu.menu_name, menu.menu_price, orders.order_amount, order_total from education.orders left join education.menu on orders.menu_id=menu.id')
    res.status(200).send({
        ok: true,
        data: JSON.parse(JSONbig.stringify(result))
    })
  } catch (err) { 
    res.status(401).send({
      ok:false,
      message: err.message
    });
    }  
});

router.post('/regist', async (req, res, next) => {
  const params = req.body;
  const paramArray = Object.values(params);
  //order insert
  const values = [null, ...paramArray]; 
  //menu update
  const values1 = [];
try{
  const idExists = await excuteStatement(
    'SELECT EXISTS ( select id from menu where id = ? ) AS A ', [params.menu_id]);
  const stockCnt = await excuteStatement(
    'select menu_stock from menu where id = ?', [params.menu_id]);

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
} catch (err) { 
  console.log(err.message);
  res.status(401).send({
      ok:false,
      message: err.message
  });
}
});


module.exports = router;