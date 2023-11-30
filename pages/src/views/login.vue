<template>
  <div class="container">
    <div class="content">
      <div class="pic"></div>
      <div class="field">
        <div class="form-cont">
          <h2 class="title">多看读书管理系统</h2>
          <div>
            <el-form ref="loginForm" :model="loginForm" :rules="LoginRules" class="login-form">
              <el-form-item prop="username">
                <el-input v-model="loginForm.username" type="text" auto-complete="off" placeholder="账号">
                  <svg-icon slot="prefix" icon-class="user" class="el-input__icon input-icon" />
                </el-input>
              </el-form-item>
              <el-form-item prop="password">
                <el-input
                  v-model="loginForm.password"
                  type="password"
                  auto-complete="off"
                  placeholder="密码"
                  @keyup.enter.native="getCode"
                >
                  <svg-icon slot="prefix" icon-class="password" class="el-input__icon input-icon" />
                </el-input>
              </el-form-item>
              <el-checkbox v-model="loginForm.rememberMe" style="margin: 0 0 25px 0">记住密码</el-checkbox>

              <!-- 下方的登录按钮 -->
              <el-form-item style="width: 100%">
                <el-button
                  :loading="loading"
                  size="medium"
                  type="primary"
                  style="width: 100%"
                  @click.native.prevent="getCode"
                >
                  <span v-if="!loading">登 录</span>
                  <span v-else>登 录 中...</span>
                </el-button>
              </el-form-item>
            </el-form>
          </div>
        </div>
      </div>
    </div>

    <div class="footer">Copyright © 多看读书管理系统</div>
  </div>
</template>

<script>
import {
  getPassword,
  getRememberMe,
  getUsername,
  removePassword,
  removeRememberMe,
  removeUsername,
  setPassword,
  setRememberMe,
  setUsername
} from '@/utils/auth'

export default {
  name: 'Login',
  data() {
    const validateUsername = (rule, value, callback) => {
      if (!value || value.length === 0) {
        callback(new Error('请输入正确的用户名'))
      } else {
        callback()
      }
    }
    const validatePassword = (rule, value, callback) => {
      if (value.length < 4) {
        callback(new Error('密码不能少于4位'))
      } else {
        callback()
      }
    }
    return {
      loginForm: {
        username: 'admin',
        password: 'admin',
        rememberMe: false
      },
      LoginRules: {
        username: [{ required: true, trigger: 'blur', validator: validateUsername }],
        password: [{ required: true, trigger: 'blur', validator: validatePassword }]
      },
      loading: false,
      redirect: undefined
    }
  },
  created() {
    this.redirect = this.$route.query.redirect ? decodeURIComponent(this.$route.query.redirect) : undefined
    this.getCookie()
  },
  methods: {
    getCode() {
      this.handleLogin({})
    },
    getCookie() {
      const username = getUsername()
      const password = getPassword()
      const rememberMe = getRememberMe()
      this.loginForm = {
        ...this.loginForm,
        username: username || this.loginForm.username,
        password: password || this.loginForm.password,
        rememberMe: rememberMe ? getRememberMe() : false
      }
    },
    handleLogin() {
      this.$refs.loginForm.validate(valid => {
        if (valid) {
          this.loading = true
          if (this.loginForm.rememberMe) {
            setUsername(this.loginForm.username)
            setPassword(this.loginForm.password)
            setRememberMe(this.loginForm.rememberMe)
          } else {
            removeUsername()
            removePassword()
            removeRememberMe()
          }
          this.$store
            .dispatch('Login', {
              username: this.loginForm.username,
              password: this.loginForm.password
            })
            .then(() => {
              this.$router.push({ path: this.redirect || '/' }).catch(() => {})
            })
            .catch(() => {
              this.loading = false
            })
        }
      })
    }
  }
}
</script>
<style lang="scss" scoped>
@import '~@/assets/styles/login.scss';
.title {
  font-size: 30px;
  font-weight: 500;
  color: #0633ff;
  margin-bottom: 40px;
}

.oauth-login {
  display: flex;
  align-items: center;
  cursor: pointer;
}
.oauth-login-item {
  display: flex;
  align-items: center;
  margin-right: 10px;
}
.oauth-login-item img {
  height: 25px;
  width: 25px;
}
.oauth-login-item span:hover {
  text-decoration: underline #ff4949;
  color: #ff4949;
}
.sms-login-mobile-code-prefix {
  :deep(.el-input__prefix) {
    top: 22%;
  }
}
</style>
