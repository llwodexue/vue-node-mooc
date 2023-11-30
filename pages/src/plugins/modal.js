import { Message, MessageBox, Notification, Loading } from 'element-ui'

const offset = 60
let loadingInstance

export default {
  // 消息提示
  msg(content) {
    Message({ message: content, offset, showClose: true })
  },
  // 错误消息
  msgError(content, single = true) {
    const len = document.getElementsByClassName('el-message--error')
    if (single && !len.length) {
      Message({ message: content, offset, showClose: true, type: 'error' })
    }
  },
  // 成功消息
  msgSuccess(content) {
    Message({ message: content, offset, showClose: true, type: 'success' })
  },
  // 警告消息
  msgWarning(content, d) {
    Message({ message: content, offset, showClose: true, type: 'warning', duration: d || 3 * 1000 })
  },
  // 弹出提示
  alert(content) {
    MessageBox.alert(content, '系统提示')
  },
  // 错误提示
  alertError(content) {
    MessageBox.alert(content, '系统提示', { type: 'error' })
  },
  // 成功提示
  alertSuccess(content) {
    MessageBox.alert(content, '系统提示', { type: 'success' })
  },
  // 警告提示
  alertWarning(content) {
    MessageBox.alert(content, '系统提示', { type: 'warning' })
  },
  // 通知提示
  notify(content) {
    Notification({ message: content, title: '系统通知', offset })
  },
  // 错误通知
  notifyError(content, single = true) {
    const len = document.getElementsByClassName('el-notification__icon el-icon-error')
    if (single && !len.length) {
      Notification({ message: content, title: '系统通知', offset, type: 'error' })
    }
  },
  // 成功通知
  notifySuccess(content) {
    Notification({ message: content, title: '系统通知', offset, type: 'success' })
  },
  // 警告通知
  notifyWarning(content) {
    Notification({ message: content, title: '系统通知', offset, type: 'warning' })
  },
  // 确认窗体
  confirm(content) {
    return MessageBox.confirm(content, '系统提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })
  },
  // 提交内容
  prompt(content) {
    return MessageBox.prompt(content, '系统提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })
  },
  // 打开遮罩层
  loading(content) {
    loadingInstance = Loading.service({
      lock: true,
      text: content,
      spinner: 'el-icon-loading',
      background: 'rgba(0, 0, 0, 0.7)'
    })
  },
  // 关闭遮罩层
  closeLoading() {
    loadingInstance.close()
  }
}
