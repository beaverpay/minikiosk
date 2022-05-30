let express = require('express');
let router = express.Router();
let JSONbig = require('json-bigint');
let excuteStatement = require('../db/db');

router.get('/orderList', function(_req, res, _next) {
  excuteStatement('SELECT orders.id, menu.menu_name, menu.menu_price, orders.order_amount, orders.order_amount * menu.menu_price AS order_total FROM education.orders LEFT JOIN education.menu ON orders.menu_id=menu.id',async function(orderList){
    await res.json(JSON.parse(JSONbig.stringify(orderList)));
  });
});

router.post('/registOrder', function(req, res, next) {
  let params = req.body;
  let paramArray = Object.values(params);
  let values = [null,...paramArray];

  excuteStatement('INSERT INTO orders values(?,?,?,?)', function(result){
      res.send(JSON.parse(JSONbig.stringify(result)))
  }, values);
});

module.exports = router;;