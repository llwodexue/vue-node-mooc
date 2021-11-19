const express = require('express')
const multer = require('multer')
const Result = require('../models/Result')
const Book = require('../models/Book')
const { UPLOAD_PATH } = require('../utils/constant')
const boom = require('boom')

const router = express.Router()
const upload = multer({ dest: `${UPLOAD_PATH}/book` })

router.post('/upload', upload.single('file'), (req, res, next) => {
  if (!req.file || req.file.length === 0) {
    new Result('上传电子书失败').fail(res)
  } else {
    const book = new Book(req.file)
    book
      .parse()
      .then(book => {
        console.log('book', book)
        new Result(book, '上传电子书成功').success(res)
      })
      .catch(err => {
        console.log(err)
        next(boom.badImplementation(err))
      })
  }
})

module.exports = router
