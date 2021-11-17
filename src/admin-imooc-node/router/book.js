const express = require('express')
const multer = require('multer')
const Result = require('../models/Result')
const { UPLOAD_PATH } = require('../utils/constant')

const router = express.Router()
const upload = multer({ dest: `${UPLOAD_PATH}/book` })

router.post('/upload', upload.single('file'), (req, res, next) => {
  if (!req.file || req.file.length === 0) {
    new Result('上传电子书失败').fail(res)
  } else {
    new Result('上传电子书成功').success(res)
  }
})

module.exports = router
