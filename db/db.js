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
async function excuteStatement(sql, callback, values) {
  let conn;
  let result;
  try {
	  conn = await pool.getConnection();
    result = await conn.query(sql, values);
    callback(result);
    console.log('callback end');
  } catch (err) {
	  throw err;
  } finally {
	  if (conn) {
      console.log('finally start');
      return conn.end()
    };
  }
}

module.exports = excuteStatement;