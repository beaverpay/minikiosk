let express = require('express');
let router = express.Router();
let JSONbig = require('json-bigint');
let excuteStatement = require('../db/db');

router.get('/orderList', async function(req, res, next) {
  let result = await excuteStatement('select orders.id, menu.menu_name, menu.menu_price, orders.order_amount, order_total from education.orders left join education.menu on orders.menu_id=menu.id')
  res.send(JSON.parse(JSONbig.stringify(result)))
});

router.post('/registOrder', function(req, res, next) {
  let params = req.body;
  let paramArray = Object.values(params);
  //order insert
  let values = [null, ...paramArray]; //dot dot dot javascript = 
  //menu update
  let values2 = [];


  values.push(values[2]); //get order_amount value
  values.push(values[1]); //get menu_id value

  excuteStatement('insert into orders(id, menu_id, order_amount, order_total) values (?,?,?,( select menu_price * ? from menu where menu_store_id = ? ) )', values).catch(err=>{
    res.send(`${err}`)
  }).then(
    (result) => {

      values2.push(values[2]);
      values2.push(values[1]);

      excuteStatement('update menu set menu_stock = menu_stock - ? where id = ?', values2).catch(err=>{
        res.send(`${err}`)
      }).then(
        (result) => {
          res.send(JSON.parse(JSONbig.stringify(result)));
        },
      );

    },
  );




});


module.exports = router;;