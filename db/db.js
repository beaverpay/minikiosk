const mariadb = require('mariadb');
const config = require('../config/db-config.json')

const pool = mariadb.createPool(config);

//미완성
async function asyncFunction(sql) {
  let conn;
  try {
	  conn = await pool.getConnection();
    conn.query(sql);
  } catch (err) {
	  throw err;
  } finally {
	  if (conn) {
      return conn.end()
    };
  }
}

module.exports = asyncFunction;