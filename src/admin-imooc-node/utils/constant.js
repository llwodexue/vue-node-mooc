const { env } = require('./env')
const UPLOAD_PATH =
  env === 'dev' ? 'E:/upload/admin-upload-ebook' : '/root/upload/admin-upload-ebook'

const UPLOAD_URL = env === 'dev' ? 'http://127.0.0.1:8089/admin-upload-ebook' : 'http://www.book.llmysnow.top/admin-upload-ebook'

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
  UPLOAD_URL
}
