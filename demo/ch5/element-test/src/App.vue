<template>
  <div id="app">
    <el-button @click="show">点我</el-button>
  </div>
</template>

<script>
export default {
  name: 'App',
  methods: {
    show() {
      this.$message.success('这是 element-ui')
    }
  }
}
</script>

<style>
</style>
