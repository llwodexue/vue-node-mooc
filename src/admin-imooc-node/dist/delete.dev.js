"use strict";

/* 
删除上传目录 book、img、unzip里的内容
*/
var _require = require('./utils/constant'),
    UPLOAD_PATH = _require.UPLOAD_PATH;

var path = require('path');

var fs = require('fs');

var bookPath = path.resolve(UPLOAD_PATH, 'book');
var imgPath = path.resolve(UPLOAD_PATH, 'img');
var unzipPath = path.resolve(UPLOAD_PATH, 'unzip'); // 当然也可以直接把文件夹删除，再创建文件夹

function removeFile(dirPath) {
  return new Promise(function (resolve, reject) {
    fs.readdir(dirPath, function (err, files) {
      if (err) return reject(err);
      if (!files.length) return reject("".concat(dirPath, "\u6587\u4EF6\u5939\u4E3A\u7A7A"));
      files.forEach(function (item) {
        var filePath = path.resolve(dirPath, item);

        if (fs.statSync(filePath).isFile()) {
          fs.unlinkSync(filePath);
        } else {
          fs.rmdirSync(filePath, {
            recursive: true
          });
        }
      });
    });
  });
}

Promise.allSettled([removeFile(bookPath), removeFile(imgPath), removeFile(unzipPath)]).then(function (res) {
  console.log(res);
})["catch"](function (err) {
  return console.log(err);
});