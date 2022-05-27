const mariadb = require('mariadb');
const config = require('../config/db-config.json')

//파라미터 json이 아니라 객체인듯 참고하세요
const pool = mariadb.createPool({
  host: config.host, 
  port: config.port,
  user: config.user,
  password: config.password,
  database: config.database,
  connectionLimit: config.connectionLimit
});

//미완성
async function asyncFunction(sql, callback) {
  let conn;
  let result;
  console.log('test1')
  try {
	  conn = await pool.getConnection();
    console.log('test2');
    result = await conn.query(sql);
    console.log(result);
    return result;
  } catch (err) {
	  throw err;
  } finally {
	  if (conn) {
      console.log('test5')
      console.log(result);
      return conn.end()
    };
  }
}

module.exports = asyncFunction;