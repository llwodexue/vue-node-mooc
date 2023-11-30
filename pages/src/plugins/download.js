export default {
  // 下载 Excel 方法
  excel(res, fileName) {
    this.download(res, fileName, 'application/vnd.ms-excel')
  },

  // 下载 Word 方法
  word(res, fileName) {
    this.download(res, fileName, 'application/msword')
  },

  // 下载 Zip 方法
  zip(res, fileName) {
    this.download(res, fileName, 'application/zip')
  },

  // 下载 Json 方法
  json(res, fileName) {
    this.download(res, fileName, 'application/json')
  },

  // 下载 Html 方法
  html(res, fileName) {
    this.download(res, fileName, 'text/html')
  },

  // 下载 Markdown 方法
  markdown(res, fileName) {
    this.download(res, fileName, 'text/markdown')
  },

  // 通用下载方法
  download(res, fileName, mineType) {
    let data = res
    if (Object.prototype.toString.call(res) === '[object Object]') {
      data = res.data
    }
    if (!fileName) {
      const pat = new RegExp('file[nN]ame=([^;]+\\.[^\\.;]+)')
      const result = pat.exec(decodeURI(res.headers?.['content-disposition']))
      fileName = fileName || (result && result[1])
    }
    const blob = new Blob([data], { type: mineType })
    window.URL = window.URL || window.webkitURL
    const link = document.createElement('a')
    const href = URL.createObjectURL(blob)
    link.href = href
    link.download = fileName
    link.click()
    window.URL.revokeObjectURL(href)
  }
}
