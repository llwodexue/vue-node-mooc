const {
  MIME_TYPE_EPUB,
  UPLOAD_URL,
  UPLOAD_PATH,
  UPDATE_TYPE_FROM_WEB,
  OLD_UPLOAD_URL,
} = require('../utils/constant')
const fs = require('fs')
const path = require('path')
const Epub = require('../utils/epub')
const xml2js = require('xml2js').parseString

class Book {
  constructor(file, data) {
    if (file) {
      this.createBookFromFile(file)
    } else {
      this.createBookFromData(data)
    }
  }

  createBookFromFile(file) {
    const {
      destination: des, // 文件本地存储目录
      filename, //文件名称
      path, // 文件路径
      mimetype = MIME_TYPE_EPUB, // 文件资源类型
      originalname, // 文件原始名称
    } = file
    // 电子书的文件后缀名
    const suffix = mimetype.startsWith(MIME_TYPE_EPUB) ? '.epub' : ''
    // 电子书原有路径
    const oldBookPath = path
    // 电子书的新路径
    const bookPath = `${des}/${filename}${suffix}`
    // 电子书下载URL链接
    const url = `${UPLOAD_URL}/book/${filename}${suffix}`
    // 电子书解压后的文件夹路径
    const unzipPath = `${UPLOAD_PATH}/unzip/${filename}`
    // 电子书解压后的文件夹URL
    const unzipUrl = `${UPLOAD_URL}/unzip/${filename}`

    if (!fs.existsSync(unzipPath)) {
      fs.mkdirSync(unzipPath, { recursive: true }) // 迭代创建解压文件夹
    }
    if (fs.existsSync(oldBookPath) && !fs.existsSync(bookPath)) {
      fs.renameSync(oldBookPath, bookPath) // 重命名文件
    }

    this.fileName = filename // 文件名
    this.path = `/book/${filename}${suffix}` // epub文件夹相对路径
    this.filePath = this.path // epub文件夹相对路径
    this.unzipPath = `/unzip/${filename}` // epub解压后相对路径
    this.url = url // epub文件下载链接
    this.title = '' // 书名
    this.author = '' // 作者
    this.publisher = '' // 出版社
    this.contents = [] // 目录
    this.cover = '' // 封面图片URL
    this.coverPath = '' // 封面图片路径
    this.category = -1 // 分类ID
    this.categoryText = '' // 分类名称
    this.language = '' // 语种
    this.unzipUrl = unzipUrl // 解压后文件夹链接
    this.originalName = originalname // 电子书原名
  }

  createBookFromData(data) {
    this.fileName = data.fileName
    this.cover = data.coverPath
    this.title = data.title
    this.author = data.author
    this.publisher = data.publisher
    this.bookId = data.fileName
    this.language = data.language
    this.rootFile = data.rootFile
    this.originalName = data.originalName
    this.path = data.path || data.filePath
    this.filePath = data.path || data.filePath
    this.unzipPath = data.unzipPath
    this.coverPath = data.coverPath
    this.createUser = data.username
    this.createDt = new Date().getTime()
    this.updateDt = new Date().getTime()
    this.updateType = data.updateType === 0 ? data.updateType : UPDATE_TYPE_FROM_WEB
    this.contents = data.contents
    this.category = data.category || 99
    this.categoryText = data.categoryText || '自定义'
  }

  parse() {
    return new Promise((resolve, reject) => {
      const bookPath = `${UPLOAD_PATH}${this.path}`
      if (!fs.existsSync(bookPath)) reject(new Error('电子书不存在'))
      const epub = new Epub(bookPath)
      epub.on('error', err => reject(err))
      epub.on('end', err => {
        if (err) return reject(err)
        const { title, creator, creatorFileAs, language, publisher, cover } = epub.metadata
        if (!title) reject(new Error('图书标题为空'))
        this.title = title
        this.language = language || 'en'
        this.author = creator || creatorFileAs || 'unknown'
        this.publisher = publisher || 'unknown'
        this.rootFile = epub.rootFile
        const handleGetImage = (err, file, mimeType) => {
          if (err) return reject(err)
          const suffix = mimeType && mimeType.split('/')[1]
          const coverPath = `${UPLOAD_PATH}/img/${this.fileName}.${suffix}`
          const coverUrl = `${UPLOAD_URL}/img/${this.fileName}.${suffix}`
          fs.writeFileSync(coverPath, file, 'binary')
          this.coverPath = `/img/${this.fileName}.${suffix}`
          this.cover = coverUrl
          resolve(this)
        }
        try {
          this.unzip() // 解压电子书
          this.parseContents(epub)
            .then(({ chapters, chapterTree }) => {
              this.contents = chapters
              this.contentsTree = chapterTree
              epub.getImage(cover, handleGetImage) // 获取封面图片
            })
            .catch(err => reject(err))
        } catch (e) {
          reject(e)
        }
      })
      epub.parse()
    })
  }

  unzip() {
    const AdmZip = require('adm-zip')
    const zip = new AdmZip(Book.genPath(this.path)) // 解析文件路径
    zip.extractAllTo(Book.genPath(this.unzipPath), true)
  }

  parseContents(epub) {
    function getNcxFilePath() {
      const spine = epub && epub.spine
      const manifest = epub && epub.manifest
      const ncx = spine.toc && spine.toc.href
      const id = spine.toc && spine.toc.id
      if (ncx) return ncx
      return manifest[id].href
    }

    function findParent(array, level = 0, pid = '') {
      return array.map(item => {
        item.level = level
        item.pid = pid
        if (item.navPoint && item.navPoint.length > 0) {
          item.navPoint = findParent(item.navPoint, level + 1, item['$'].id)
        } else if (item.navPoint) {
          item.navPoint.level = level + 1
          item.navPoint.pid = item['$'].id
        }
        return item
      })
    }

    function flatten(array) {
      return [].concat(
        ...array.map(item => {
          if (item.navPoint && item.navPoint.length > 0) {
            return [].concat(item, ...flatten(item.navPoint))
          } else if (item.navPoint) {
            return [].concat(item, item.navPoint)
          }
          return item
        })
      )
    }

    const ncxFilePath = Book.genPath(`${this.unzipPath}/${getNcxFilePath()}`) // 获取ncx文件路径
    if (fs.existsSync(ncxFilePath)) {
      return new Promise((resolve, reject) => {
        const xml = fs.readFileSync(ncxFilePath, 'utf-8') // 读取ncx文件
        const dir = path.dirname(ncxFilePath).replace(UPLOAD_PATH, '')
        const filename = this.fileName
        // 将ncx文件从xml转为json
        xml2js(
          xml,
          {
            explicitArray: false, // 设置为false时，解析结果不会包裹array
            ignoreAttrs: false, // 解析属性
          },
          (err, json) => {
            if (err) return reject(err)
            const navMap = json.ncx.navMap
            if (navMap.navPoint && navMap.navPoint.length > 0) {
              navMap.navPoint = findParent(navMap.navPoint)
              const newNavMap = flatten(navMap.navPoint) // 将目录拆分为扁平结构
              const chapters = []
              newNavMap.forEach((chapter, index) => {
                const src = chapter.content['$'].src
                chapter.id = `${src}`
                chapter.href = `${dir}/${src}`.replace(this.unzipPath, '')
                chapter.text = `${UPLOAD_URL}${dir}/${src}`
                chapter.label = chapter.navLabel.text || ''
                chapter.navId = chapter['$'].id
                chapter.fileName = filename
                chapter.order = index + 1
                chapters.push(chapter)
              })
              const chapterTree = Book.genContentsTree(chapters)
              resolve({ chapters, chapterTree })
            } else {
              reject(new Error('目录解析失败，目录数为0'))
            }
          }
        )
      })
    } else {
      throw new Error('目录文件不存在')
    }
  }

  toDb() {
    return {
      fileName: this.fileName,
      cover: this.cover,
      title: this.title,
      author: this.author,
      publisher: this.publisher,
      bookId: this.fileName,
      language: this.language,
      rootFile: this.rootFile,
      originalName: this.originalName,
      filePath: this.filePath,
      unzipPath: this.unzipPath,
      coverPath: this.coverPath,
      createUser: this.createUser,
      createDt: this.createDt,
      updateDt: this.updateDt,
      updateType: this.updateType,
      category: this.category,
      categoryText: this.categoryText,
    }
  }

  getContents() {
    return this.contents
  }

  reset() {
    if (Book.pathExists(this.filePath)) {
      fs.unlinkSync(Book.genPath(this.filePath))
    }
    if (Book.pathExists(this.coverPath)) {
      fs.unlinkSync(Book.genPath(this.coverPath))
    }
    if (Book.pathExists(this.unzipPath)) {
      fs.rmdirSync(Book.genPath(this.unzipPath), { recursive: true })
    }
  }

  static genPath(path) {
    if (!path.startsWith('/')) path = `/${path}`
    return `${UPLOAD_PATH}${path}`
  }

  static pathExists(path) {
    if (path.startsWith(UPLOAD_PATH)) return fs.existsSync(path)
    return fs.existsSync(Book.genPath(path))
  }

  static genCoverUrl(book) {
    const { cover } = book
    if (+book.updateType === 0) {
      if (cover) {
        if (cover.startsWith('/')) {
          return `${OLD_UPLOAD_URL}${cover}`
        } else {
          return `${OLD_UPLOAD_URL}/${cover}`
        }
      } else {
        return null
      }
    } else {
      if (cover) {
        if (cover.startsWith('/')) {
          return `${UPLOAD_URL}${cover}`
        } else {
          return `${UPLOAD_URL}/${cover}`
        }
      } else {
        return null
      }
    }
  }

  static genContentsTree(contents) {
    if (contents) {
      const contentsTree = []
      contents.forEach(c => {
        c.children = []
        if (c.pid === '') {
          contentsTree.push(c)
        } else {
          const parent = contents.find(_ => _.navId === c.pid)
          parent.children.push(c)
        }
      })
      return contentsTree
    }
  }
}

module.exports = Book
