const mysql = require('mysql')
const config = require('./config')
const { DEBUG } = require('../utils/constant')

function connect() {
  return mysql.createConnection({
    host: config.host,
    user: config.user,
    password: config.password,
    database: config.database,
    port: config.port,
    multipleStatements: true,
  })
}

function querySql(sql) {
  const conn = connect()
  DEBUG && console.log(sql)
  return new Promise((resolve, reject) => {
    try {
      conn.query(sql, (err, results) => {
        if (err) {
          DEBUG && console.log('查询失败，原因:' + JSON.stringify(err))
          reject(err)
        } else {
          DEBUG && console.log('查询成功', JSON.stringify(results))
          resolve(results)
        }
      })
    } catch (err) {
      reject(err)
    } finally {
      conn.end()
    }
  })
}

function queryOne(sql) {
  return new Promise((resolve, reject) => {
    querySql(sql)
      .then(results => {
        if (results && results.length > 0) {
          resolve(results[0])
        } else {
          resolve(null)
        }
      })
      .catch(err => {
        reject(err)
      })
  })
}

module.exports = { querySql, queryOne }
