const mariadb = require('mariadb');
const config = require('../config/db-config.json')

const pool = mariadb.createPool({
     host: config.host, 
     user: config.user, 
     password: config.password,
     database: config.database,
     connectionLimit: config.connectionLimit
});

//미완성
async function asyncFunction(sql) {
  let conn;
  try {
	conn = await pool.getConnection();
    console.log('hi');
  } catch (err) {
	throw err;
  } finally {
	if (conn) return conn.end();
  }
}

module.exports = asyncFunction;
