/* 
删除上传目录 book、img、unzip里的内容
*/
const { UPLOAD_PATH } = require('./utils/constant')
const path = require('path')
const fs = require('fs')

const bookPath = path.resolve(UPLOAD_PATH, 'book')
const imgPath = path.resolve(UPLOAD_PATH, 'img')
const unzipPath = path.resolve(UPLOAD_PATH, 'unzip')

// 当然也可以直接把文件夹删除，再创建文件夹
function removeFile(dirPath) {
  return new Promise((resolve, reject) => {
    fs.readdir(dirPath, (err, files) => {
      if (err) return reject(err)
      if (!files.length) return reject(`${dirPath}文件夹为空`)
      files.forEach(item => {
        const filePath = path.resolve(dirPath, item)
        if (fs.statSync(filePath).isFile()) {
          fs.unlinkSync(filePath)
        } else {
          fs.rmdirSync(filePath, { recursive: true })
        }
      })
      resolve(`${dirPath} 删除成功`)
    })
  })
}

Promise.allSettled([removeFile(bookPath), removeFile(imgPath), removeFile(unzipPath)])
  .then(res => {
    res.forEach(item => {
      if (item.value) console.log(item.value)
      if (item.reason) console.log(item.reason)
    })
  })
  .catch(err => console.log(err))
