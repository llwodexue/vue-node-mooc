const Book = require('../models/Book')
const db = require('../db')
const _ = require('lodash')

function exists(book) {
  const { title, author, publisher } = book
  const sql = `select * from book
              where title='${title}'
              and author='${author}'
              and publisher='${publisher}'`
  return db.queryOne(sql)
}

async function removeBook(book) {
  if (book) {
    book.reset()
    if (book.fileName) {
      const removeBookSql = `delete from book where fileName='${book.fileName}'`
      const removeContentSql = `delete from contents where fileName='${book.fileName}'`
      await db.querySql(removeBookSql)
      await db.querySql(removeContentSql)
    }
  }
}

async function insertContents(book) {
  const contents = book.getContents()
  if (contents && contents.length > 0) {
    for (let i = 0; i < contents.length; i++) {
      const content = contents[i]
      const _content = _.pick(content, [
        'fileName',
        'id',
        'href',
        'text',
        'order',
        'level',
        'label',
        'pid',
        'navId',
      ])
      await db.insert(_content, 'contents')
    }
  }
}

function insertBook(book) {
  return new Promise(async (resolve, reject) => {
    try {
      if (book instanceof Book) {
        const result = await exists(book)
        if (result) {
          await removeBook(book)
          reject(new Error('电子书已存在'))
        } else {
          await db.insert(book.toDb(), 'book')
          await insertContents(book)
          resolve()
        }
      } else {
        reject(new Error('添加的图书对象不合法'))
      }
    } catch (e) {
      reject(new Error(e))
    }
  })
}

function getBook(fileName) {
  return new Promise(async (resolve, reject) => {
    const bookSql = `select * from book where fileName='${fileName}'`
    const contentSql = `select * from contents where fileName='${fileName}' order by \`order\``
    const book = await db.queryOne(bookSql)
    const contents = await db.querySql(contentSql)
    if (book) {
      book.cover = Book.genCoverUrl(book)
      book.contentsTree = Book.genContentsTree(contents)
    } else {
      reject(new Error('电子书不存在'))
    }
    return resolve(book)
  })
}

function updateBook(book) {
  return new Promise(async (resolve, reject) => {
    try {
      if (book instanceof Book) {
        const result = await getBook(book.fileName)
        if (result) {
          const model = book.toDb()
          if (+result.updateType === 0) {
            reject(new Error('内置图书不能编辑'))
          } else {
            await db.update(model, 'book', `where fileName='${book.fileName}'`)
            resolve()
          }
        }
      } else {
        reject(new Error('添加的图书对象不合法'))
      }
    } catch (e) {
      reject(new Error(e))
    }
  })
}

module.exports = { insertBook, getBook, updateBook }
