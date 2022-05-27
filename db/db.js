const mariadb = require('mariadb');
const config = require('../config/db-config.json')
let JSONbig = require('json-bigint');

//파라미터 json이 아니라 객체인듯 참고하세요
const pool = mariadb.createPool({
  host: config.host, 
  port: config.port,
  user: config.user,
  password: config.password,
  database: config.database,
  connectionLimit: config.connectionLimit
});

//커넥션 풀로부터 connection을 하나 얻어 쿼리를 보내고 connection을 반환 한다.
async function excuteStatement(sql, callback, values) {
  let conn;
  let result;
  console.log(sql);
  console.log(values);
  try {
	  conn = await pool.getConnection();
    result = await conn.query(sql, values);
    console.log(result);
    callback(result);
  } catch (err) {
	  throw err;
  } finally {
	  if (conn) {
      return conn.end()
    };
  }
}

module.exports = excuteStatement;