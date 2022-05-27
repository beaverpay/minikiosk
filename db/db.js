const mariadb = require('mariadb');
const config = require('../config/db-config.json')

const pool = mariadb.createPool({
  host: config.host, 
  port: config.port,
  user: config.user,
  password: config.password,
  database: config.database,
  connectionLimit: config.connectionLimit
});

//미완성
async function asyncFunction(sql) {
  let conn;
  console.log('test1')
  try {
	  conn = await pool.getConnection();
    console.log('test2')
    return await conn.query(sql);
  } catch (err) {
    console.log('test6')
	  throw err;
  } finally {
	  if (conn) {
      console.log('test5')
      return conn.end()
    };
  }
}

module.exports = asyncFunction;