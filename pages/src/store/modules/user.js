import { login, getInfo } from '@/api/login'
import { dynamicRoutes, userRoutes } from '@/router'
import { setToken, removeToken } from '@/utils/auth'

const user = {
  state: {
    id: 0, // 用户编号
    name: '',
    avatar: '',
    roles: [],
    permissions: []
  },

  mutations: {
    SET_ID: (state, id) => {
      state.id = id
    },
    SET_NAME: (state, name) => {
      state.name = name
    },
    SET_AVATAR: (state, avatar) => {
      state.avatar = avatar
    },
    SET_ROLES: (state, roles) => {
      state.roles = roles
    },
    SET_PERMISSIONS: (state, permissions) => {
      state.permissions = permissions
    }
  },

  actions: {
    // 登录
    Login({ commit }, userInfo) {
      return new Promise((resolve, reject) => {
        login(userInfo)
          .then(res => {
            const { data, code, msg } = res
            if (code === 0) {
              setToken(data.token)
              resolve(data)
            } else {
              reject(msg)
            }
          })
          .catch(error => {
            reject(error)
          })
      })
    },

    // 获取用户信息
    GetInfo({ commit, state }) {
      return new Promise((resolve, reject) => {
        getInfo()
          .then(res => {
            const { data } = res
            if (!data) {
              reject('Verification failed, please Login again.')
            }

            let { roles, username: name, avatar } = data
            avatar = avatar == null ? require('@/assets/images/profile.jpg') : avatar

            let routes = dynamicRoutes
            if (roles.includes('admin')) {
            } else {
              routes = userRoutes
            }
            commit('SET_ROLES', routes)
            commit('SET_NAME', name)
            commit('SET_AVATAR', avatar)
            resolve({
              roles: roles,
              routes: routes,
              name: name
            })
          })
          .catch(error => {
            reject(error)
          })
      })
    },
    clearInfo({ commit, dispatch }) {
      commit('SET_ROLES', [])
      commit('SET_PERMISSIONS', [])
      commit('SET_NAME', '')
      commit('SET_AVATAR', '')
      dispatch('tagsView/delAllViews')
      removeToken()
    },

    // 退出系统
    LogOut({ commit, state, dispatch }) {
      return new Promise((resolve, reject) => {
        try {
          dispatch('clearInfo')
          resolve()
        } catch (e) {
          reject(e)
        }
      })
    },
    resetToken({ commit, dispatch }) {
      return new Promise(resolve => {
        dispatch('clearInfo')
        resolve()
      })
    }
  }
}

export default user
