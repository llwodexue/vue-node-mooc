const express = require('express')
const router = require('./router')

const app = express()

app.use('/', router)

const server = app.listen(3003, () => {
  const { port } = server.address()
  console.log('running on http://127.0.0.1:%s', port)
})
