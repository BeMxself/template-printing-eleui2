const context = require.context('./', false, /.vue/)

function normalizePropsArray(props) {
  props = props || []
  if (typeof props === 'string') props = [...props.split(',').map((p) => p.trim())]
  return props
}
export const Editors = context.keys().map((key) => {
  const { meta = {}, default: component } = context(key)
  return {
    meta: {
      name: /(\w+)\.vue/.exec(key)[1],
      ...meta,
      extProps: normalizePropsArray(meta.extProps),
      optProps: normalizePropsArray(meta.optProps),
    },
    component,
  }
})
export function decideEditor(prop) {
  if (!prop) return null
  // 先通过type筛选
  var middleResults = Editors.filter((editor) => editor.meta && editor.meta.type === prop.type)
  if (middleResults.length === 1) return middleResults[0]

  // 再通过扩展属性过滤
  middleResults = middleResults.filter((editor) => {
    const extProps = editor.meta.extProps
    const fieldsOfProp = Object.keys(prop)
    return extProps.every((p) => fieldsOfProp.includes(p))
  })
  if (middleResults.length >= 1) return middleResults[0]
  return null
}
