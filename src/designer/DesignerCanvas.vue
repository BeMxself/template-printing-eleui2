<script>
import { getDesignTimeDefineByType } from '../components'
import store from './store'

export default {
  computed: {
    designContext() {
      const canvasSize = store.state.ui.canvasSize
      const reference = store.getters['design/reference']
      return {
        reference,
        canvasSize,
        horizontalMargin: 20,
        scaleType: 'FullWidth',
      }
    },
    rootNode() {
      return store.getters['core/rootNode']
    },
  },
  methods: {
    renderRoot() {
      const rootNode = this.rootNode
      if (!rootNode || !rootNode.type) return null
      const compDefine = getDesignTimeDefineByType(rootNode.type)
      const DesignTimeComponent = compDefine.DesignTimeComponent
      const props = { ...compDefine.defaultProps, ...rootNode }
      return (
        <DesignTimeComponent
          props={{ props }}
          designContext={this.designContext}
          onNodeSelected={(node) => {
            store.commit('design/setSelected', node)
          }}
          onSelectedUpdated={(updates) =>
            store.dispatch('design/updateSelected', updates)
          }
        ></DesignTimeComponent>
      )
    },
    onKeyDown(e) {
      const { keyCode } = e
      if (keyCode === 8 || keyCode === 46) {
        store.dispatch('design/deleteSelectedNode')
      }
      if (e.ctrlKey || e.metaKey) {
        switch (e.keyCode) {
          case 67:
            store.dispatch('design/copySelected')
            break
          case 86:
            store.dispatch('design/pasteCopied')
            break
        }
      }
    },
  },
  render() {
    const { canvasSize } = this.designContext
    const style = {
      width: `${canvasSize.width}px`,
      height: `${canvasSize.height}px`,
    }
    return (
      <div class="canvas" style={style} tabindex="0" onKeydown={this.onKeyDown}>
        {this.renderRoot()}
      </div>
    )
  },
}
</script>
<style scoped>
.canvas {
  overflow: scroll;
}
</style>
