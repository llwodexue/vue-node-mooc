<template>
	<div>Component A</div>
</template>

<script>
	export default {
		beforeCreate(){
			console.log('beforeCreate')
		},
		created(){
			console.log('created')
		},
		beforeMount(){
			console.log('beforeMount')
		},
		mounted(){
			console.log('mounted')
		},
		beforeDestroy(){
			console.log('beforeDestroy')
		},
		beforeRouteEnter (to, from, next) {
			// 不能获取组件实例 `this`
			console.log('beforeRouteEnter', to, from)
			next()
		},
		beforeRouteUpdate (to, from, next) {
			console.log('beforeRouteUpdate', to, from)
			next()
		},
		beforeRouteLeave (to, from, next) {
			console.log('beforeRouteLeave', to, from)
			next()
		}
	}
</script>

<style>
</style>
