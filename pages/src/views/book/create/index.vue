<template>
  <detail :is-edit="false"></detail>
</template>

<script>
import Detail from '../components/Detail.vue'
export default {
  name: 'Create',
  components: {
    Detail
  }
}
</script>
