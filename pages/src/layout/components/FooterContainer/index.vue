<template>
  <div v-if="footer" class="footer">Copyright © 多看读书管理系统</div>
</template>

<script>
export default {
  name: 'FooterContainer',
  data() {
    return {
      footer: true
    }
  }
}
</script>

<style lang="scss" scoped>
.footer {
  height: 20px;
  line-height: 20px;
  text-align: center;
  font-size: 14px;
  letter-spacing: 0.5px;
  color: #333;
  box-sizing: border-box;
  background-color: transparent;
}
</style>
