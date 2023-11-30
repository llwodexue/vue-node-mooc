import { decrypt, encrypt } from '@/utils/jsencrypt'
import { AUTHOR_KEY } from '@/global'

// ========== Token 相关 ==========

export function getToken() {
  return localStorage.getItem(AUTHOR_KEY)
}

export function setToken(accessToken) {
  localStorage.setItem(AUTHOR_KEY, accessToken)
}

export function removeToken() {
  localStorage.removeItem(AUTHOR_KEY)
}

// ========== 账号相关 ==========

const UsernameKey = 'USERNAME'
const PasswordKey = 'PASSWORD'
const RememberMeKey = 'REMEMBER_ME'

export function getUsername() {
  return localStorage.getItem(UsernameKey)
}

export function setUsername(username) {
  localStorage.setItem(UsernameKey, username)
}

export function removeUsername() {
  localStorage.removeItem(UsernameKey)
}

export function getPassword() {
  const password = localStorage.getItem(PasswordKey)
  return password ? decrypt(password) : undefined
}

export function setPassword(password) {
  localStorage.setItem(PasswordKey, encrypt(password))
}

export function removePassword() {
  localStorage.removeItem(PasswordKey)
}

export function getRememberMe() {
  return localStorage.getItem(RememberMeKey) === 'true'
}

export function setRememberMe(rememberMe) {
  localStorage.setItem(RememberMeKey, rememberMe)
}

export function removeRememberMe() {
  localStorage.removeItem(RememberMeKey)
}
