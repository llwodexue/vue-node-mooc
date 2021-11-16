const expressJwt = require('express-jwt')
const { PRIVATE_KEY } = require('../utils/constant')

const jwtAuth = expressJwt({
  secret: PRIVATE_KEY,
  algorithms: ['HS256'],
  // 设置为false就不进行校验了，游客可以访问
  credentialsRequired: true,
}).unless({
  // 设置jwt认证白名单
  path: ['/', '/user/login'],
})

module.exports = jwtAuth
