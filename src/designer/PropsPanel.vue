<script>
import { decideEditor } from './propertyEditors'
import { getDesignTimeDefineByType } from '../components'
import store from './store'
export default {
  data() {
    return {
      errors: {},
    }
  },
  computed: {
    selectedNode() {
      return store.state.design.selectedNode
    },
    selectedNodeDefines() {
      const selectedNode = this.selectedNode
      if (!selectedNode) return null
      const define = getDesignTimeDefineByType(selectedNode.type)
      return define
    },
    propsWithRenderMeta() {
      const { properties } = this.selectedNodeDefines || {}
      const selectedNode = this.selectedNode
      if (!properties || !selectedNode) return []
      var props = []
      properties.forEach((prop) => {
        props.push({
          meta: prop,
          editor: decideEditor(prop),
          value: selectedNode[prop.name],
        })
      })
      return props
    },
  },
  methods: {
    renderProperties() {
      const propsWithRenderMeta = this.propsWithRenderMeta
      return propsWithRenderMeta.length ? (
        propsWithRenderMeta.map((prop) => {
          if (!prop.editor) {
            console.warn(`无法推断${prop.meta.name}属性的编辑器组件`, prop.meta)
            return null
          }
          const props = [
            ...prop.editor.meta.extProps,
            ...prop.editor.meta.optProps,
          ]
          const editorProps = props.reduce(
            (prev, curr) => ({ ...prev, [curr]: prop.meta[curr] }),
            {
              value: prop.value,
            }
          )
          const Component = prop.editor.component
          return (
            <el-form-item label={prop.meta.displayName || prop.meta.name}>
              <Component
                props={editorProps}
                onInput={(value) => {
                  store.dispatch('design/updateSelected', {
                    [prop.meta.name]: value,
                  })
                }}
              />
            </el-form-item>
          )
        })
      ) : (
        <div style="text-align:center;margin:0 0 10px;color:gray;">
          未选择节点
        </div>
      )
    },
  },
  render() {
    return (
      <div class="props-panel">
        <el-form label-width="90px">{this.renderProperties()}</el-form>
      </div>
    )
  },
}
</script>
<style scoped>
.props-panel {
  background: #eee;
  max-height: calc(100% - 35px);
  overflow: scroll;
  margin: 20px 20px 0 5px;
  padding: 20px 20px 10px 5px;
  border-radius: 16px;
  border: solid 1px #aaa;
  box-shadow: 0 0 5px #999;
}
</style>
