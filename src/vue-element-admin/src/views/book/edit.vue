<template>
  <detail :is-edit="true"></detail>
</template>

<script>
import Detail from './components/Detail.vue'
export default {
  name: 'Edit',
  components: {
    Detail
  }
}
</script>
