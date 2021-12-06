const { env } = require('./env')

let UPLOAD_PATH, UPLOAD_URL, OLD_UPLOAD_URL
let dbHost, dbUser, dbPwd

if (env === 'dev') {
  UPLOAD_PATH = 'E:/upload/admin-upload-ebook'
  UPLOAD_URL = 'http://127.0.0.1:8089/admin-upload-ebook'
  OLD_UPLOAD_URL = 'http://127.0.0.1:8089/book/res/img'
  dbHost = 'localhost'
  dbUser = 'root'
  dbPwd = 'root'
  dbPort = 3008
} else {
  UPLOAD_PATH = '/root/nginx/upload/admin-upload-ebook'
  UPLOAD_URL = 'http://47.95.217.159/admin-upload-ebook'
  OLD_UPLOAD_URL = 'http://47.95.217.159/book/res/img'
  dbHost = '47.95.217.159'
  dbUser = 'root'
  dbPwd = 'root'
  dbPort = 3006
}

module.exports = {
  CODE_ERROR: -1,
  CODE_SUCCESS: 0,
  CODE_TOKEN_EXPIRED: -2,
  DEBUG: false,
  PWD_SALT: 'admin_imooc_node',
  PRIVATE_KEY: 'admin_imooc_node_private_key',
  JWT_EXPIRED: 60 * 60, // token失效时间 1小时,
  UPLOAD_PATH,
  MIME_TYPE_EPUB: 'application/epub',
  UPLOAD_URL,
  UPDATE_TYPE_FROM_WEB: 1,
  OLD_UPLOAD_URL,
  dbHost,
  dbUser,
  dbPort,
  dbPwd,
}
