<script>
import DesignerCanvas from './DesignerCanvas'
import PropsPanel from './PropsPanel'
import store from './store'
import { DesignTimeDefines } from '../components'
import ExportJsonDialog from './ExportJsonDialog'
import ReferenceBackgroundDialog from './ReferenceBackgroundDialog'
import TestDialog from './TestDialog'

export default {
  props: {
    template: { type: Object, default: () => null },
    rightToolbar: {
      type: Array,
      default: () => ['reference', 'export', 'test', 'save'],
    },
  },
  data() {
    return {
      selectedNode: null,
    }
  },
  computed: {
    designerHeight() {
      return store.state.ui.designerHeight
    },
    propsPanelVisible() {
      return store.state.ui.propsPanelVisible
    },
    rootNode() {
      return store.state.core.rootNode
    },
  },
  watch: {
    template() {
      this.loadTemplate()
    },
    propsPanelVisible() {
      this.onWindowResize()
    },
    rootNode() {
      this.$emit('change', this.rootNode)
    },
  },
  mounted() {
    window.addEventListener('resize', this.onWindowResize)
    this.onWindowResize()
    this.loadTemplate()
  },
  destroyed() {
    window.removeEventListener('resize', this.onWindowResize)
  },
  methods: {
    renderToolbarLeft() {
      const pageButtons = DesignTimeDefines.filter(
        (d) => d.group === 'page'
      ).map((d) => {
        return (
          <el-tooltip content={d.displayName} placement="top">
            <el-button
              icon={d.icon}
              size="mini"
              onClick={() => {
                const promise = !store.state.core.rootNode
                  ? Promise.resolve()
                  : this.$confirm(
                      '此操作将清空当前页面上的内容，请确认是否继续？'
                    )
                promise
                  .then(() => store.dispatch('core/addNode', { nodeDefine: d }))
                  .catch(() => {})
              }}
            ></el-button>
          </el-tooltip>
        )
      })
      const nodeButtons = DesignTimeDefines.filter(
        (d) => d.group === 'node'
      ).map((d) => {
        return (
          <el-tooltip content={d.displayName} placement="top">
            <el-button
              disabled={!store.state.core.rootNode}
              icon={d.icon}
              size="mini"
              onClick={() => store.dispatch('core/addNode', { nodeDefine: d })}
            ></el-button>
          </el-tooltip>
        )
      })
      return (
        <div style="display:flex">
          <div class="tools-group">
            <div class="group-title">页面</div>
            <el-button-group>{pageButtons}</el-button-group>
          </div>
          <div class="tools-group">
            <div class="group-title">元素</div>
            <el-button-group>{nodeButtons}</el-button-group>
          </div>
        </div>
      )
    },
    renderToolbarRight() {
      const functions = {
        reference: (
          <el-tooltip content="设置套打页面设计的参照图片" placement="top">
            <el-button
              disabled={!this.rootNode}
              icon="el-icon-picture"
              size="mini"
              onClick={() => this.$refs.bgDialog.show()}
            >
              参照
            </el-button>
          </el-tooltip>
        ),
        export: (
          <el-tooltip content="导出打印模版" placement="top">
            <el-button
              disabled={!this.rootNode}
              icon="el-icon-share"
              size="mini"
              onClick={() => this.$refs.exportDialog.show()}
            >
              导出
            </el-button>
          </el-tooltip>
        ),
        test: (
          <el-tooltip content="测试模版" placement="top">
            <el-button
              disabled={!this.rootNode}
              icon="el-icon-printer"
              size="mini"
              onClick={() => this.$refs.testDialog.show()}
            >
              测试
            </el-button>
          </el-tooltip>
        ),
        save: (
          <el-tooltip content="保存" placement="top">
            <el-button
              disabled={!this.rootNode}
              icon="el-icon-circle-check"
              size="mini"
              onClick={() => this.$emit('save', this.rootNode)}
            >
              保存
            </el-button>
          </el-tooltip>
        ),
      }
      return (
        <div class="tools-group">
          <div class="group-title">功能</div>
          <el-button-group>
            {this.rightToolbar.map((f) => functions[f])}
          </el-button-group>
          <el-tooltip content="打开/关闭属性窗口" placement="top">
            <el-switch
              style="margin-left:10px"
              active-text="显示属性"
              size="mini"
              value={this.propsPanelVisible}
              onChange={(value) =>
                value
                  ? store.commit('ui/showPropsPanel')
                  : store.commit('ui/hidePropsPanel')
              }
            />
          </el-tooltip>
        </div>
      )
    },
    renderPropsPanel() {
      return this.propsPanelVisible ? (
        <div class="props-panel-container">
          <PropsPanel />
        </div>
      ) : null
    },

    onWindowResize() {
      const windowHeight = window.innerHeight
      const containerTop = this.$refs.container.getBoundingClientRect().y
      store.commit('ui/updateDesignerHeight', windowHeight - containerTop)
      this.$nextTick(() => {
        const { width, height } =
          this.$refs.canvasContainer.getBoundingClientRect()
        store.commit('ui/updateCanvasSize', { width, height })
      })
    },

    loadTemplate(tpl) {
      tpl = tpl || this.template
      if (!tpl) return
      store.commit('core/setRootNode', tpl)
      store.commit('core/resetReference')
    },
  },

  render() {
    return (
      <div
        ref="container"
        class="container"
        style={{ height: `${this.designerHeight}px` }}
      >
        <div class="toolbar">
          {this.renderToolbarLeft()}
          {this.renderToolbarRight()}
        </div>
        <div class="main">
          <div ref="canvasContainer" class="canvas-container">
            <DesignerCanvas />
          </div>
          {this.renderPropsPanel()}
        </div>
        <ExportJsonDialog ref="exportDialog" />
        <ReferenceBackgroundDialog ref="bgDialog" />
        <TestDialog ref="testDialog" />
      </div>
    )
  },
}
</script>
<style scoped>
.container {
  display: flex;
  flex-direction: column;
}
.toolbar {
  display: flex;
  flex-grow: 0;
  justify-content: space-between;
  background: #eee;
  padding: 10px;
}
.toolbar .tools-group {
  display: flex;
  align-items: center;
  margin: auto 10px;
}
.toolbar .tools-group > .group-title {
  color: #aaa;
  font-size: 12px;
  margin-right: 10px;
}
.main {
  display: flex;
  align-items: stretch;
  height: calc(100% - 68px);
}
.props-panel-container {
  flex-shrink: 0;
  flex-grow: 0;
  background: #ddd;
  width: 320px;
  overflow: hidden;
}
.canvas-container {
  flex-grow: 1;
  background: #ddd;
  overflow: hidden;
}
</style>
