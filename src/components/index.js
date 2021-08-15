const context = require.context('./', true, /design.js/)

export const DesignTimeDefines = context.keys().map((key) => {
  const module = context(key)
  return { ...module.default, name: /\/(\w+)\/design\.js$/.exec(key)[1] }
})
export function getDesignTimeDefineByType(name) {
  return DesignTimeDefines.find((c) => c.name === name) || null
}
