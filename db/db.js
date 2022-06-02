const mariadb = require('mariadb');
const config = require('../config/db-config');
const dbConfig = JSON.parse((JSON.stringify(config)))

const pool = mariadb.createPool(
    dbConfig
);

//커넥션 풀로부터 connection을 하나 얻어 쿼리를 보내고 connection을 반환 한다.
const excuteStatement = async (sql, values) => {
    let conn = null;
    try {
        conn = await pool.getConnection();
        const result = await conn.query(sql, values)
        return result;
    } catch (err) {
        const error = new Error();
        error.status = 400;
        error.message = '잘못된 입력입니다.';
        throw error;
    } finally {
        if (conn) {
            conn.end();
        }
    }
}

module.exports = excuteStatement;
