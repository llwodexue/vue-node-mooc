const { env } = require('../env')

let UPLOAD_PATH, UPLOAD_URL, OLD_UPLOAD_URL

console.log('env:', env)
if (env === 'dev') {
  UPLOAD_PATH = 'E:/upload/admin-upload-ebook'
  UPLOAD_URL = 'http://127.0.0.1:8089/admin-upload-ebook'
  OLD_UPLOAD_URL = 'http://127.0.0.1:8089/book/res/img'
} else {
  UPLOAD_PATH = '/root/nginx/upload/admin-upload-ebook'
  UPLOAD_URL = 'http://182.92.10.187:8089/admin-upload-ebook'
  OLD_UPLOAD_URL = 'http://182.92.10.187:8089/book/res/img'
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
  OLD_UPLOAD_URL
}
