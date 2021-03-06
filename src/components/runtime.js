const context = require.context('./', true, /index.vue/)

export default context.keys().map((key) => {
  const module = context(key)
  return {
    component: module.default || module,
    name: /\/(\w+)\/index\.vue$/.exec(key)[1],
  }
})
