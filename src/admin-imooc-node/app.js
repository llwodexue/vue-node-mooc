const express = require('express')
const router = require('./router')
const fs = require('fs')
const https = require('https')
const cors = require('cors')

const app = express()

app.use(cors())
app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use('/', router)

const privateKey = fs.readFileSync('./https/book.llmysnow.top.key', 'utf8')
const pem = fs.readFileSync('./https/book.llmysnow.top.pem', 'utf8')
const credentials = {
  key: privateKey,
  cert: pem,
}
const httpsServer = https.createServer(credentials, app)

const server = app.listen(3003, () => {
  const { port, address } = server.address()
  console.log('running on http://' + address + ':%s', port)
})
httpsServer.listen(18082, () => {
  console.log('running on https://127.0.0.1:%s', 18082)
})
