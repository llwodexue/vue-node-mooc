<template>
  <div>
    Component B
    <button @click="addRoute">AddRoute</button>
    <router-link to="/a">to Component A</router-link>
  </div>
</template>

<script>
import A from './A'
export default {
  methods: {
    addRoute() {
      this.$router.addRoutes([
        {
          path: '/a',
          component: A,
          meta: { title: 'Custom Title A' },
        },
      ])
    },
  },
}
</script>