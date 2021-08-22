import Vdr from 'vue-draggable-resizable-gorkys'
import 'vue-draggable-resizable-gorkys/dist/VueDraggableResizable.css'
import { getDesignTimeDefineByType } from '../..'

const DesignTimeComponent = {
  props: {
    props: { type: Object, default: () => ({}) },
    designContext: {
      type: Object,
      default: () => ({
        reference: {},
        canvasSize: { width: 1000, height: 1000 },
        horizontalMargin: 20,
        scaleType: 'FullWidth',
      }),
    },
  },
  data() {
    return {
      selectedNodeName: '',
    }
  },
  computed: {
    pageAspectRatio() {
      const { width, height } = this.props
      return width / height
    },
    pageSize() {
      const {
        canvasSize: { width: canvasWidth },
        horizontalMargin = 20,
      } = this.designContext
      // 防止页宽变成负数
      const width = Math.max(canvasWidth - horizontalMargin * 2, 200)
      const height = width / this.pageAspectRatio
      return { width, height }
    },
    renderContext() {
      // TODO: 需要重构到DesignCanvas中
      const { width } = this.props
      return {
        displayScale: this.pageSize.width / width,
      }
    },
  },
  methods: {
    renderPage(page) {
      const { width, height } = this.pageSize
      const {
        dataUrl,
        url,
        scale,
        offsetX,
        offsetY,
        alpha = 0,
      } = this.designContext.reference
      const style = {
        width: width + 'px',
        height: height + 'px',
        background: 'white',
        margin: '20px auto',
        boxShadow: '0 0 6px #999',
        position: 'relative',
        backgroundRepeat: 'no-repeat',
        backgroundImage: `url(${url || dataUrl})`,
        backgroundSize: `${scale}%`,
        backgroundPosition: `${(offsetX * width) / 100}px ${(offsetY * height) /
          100}px`,
      }
      const converStyle = {
        height: '100%',
        width: '100%',
        backgroundColor: `rgba(255,255,255,${alpha / 100})`,
      }
      return (
        <div style={style}>
          <div
            ref="conver"
            style={converStyle}
            onClick={(e) => {
              const src = e.srcElement || e.target
              const conver = this.$refs.conver
              if (src === conver) {
                this.setSelected(this.props)
              }
            }}
          >
            {(page.children || []).map(this.renderNode)}
          </div>
        </div>
      )
    },
    // TODO: 需要重构到DesignCanvas中
    renderNode(node) {
      const compDefine = getDesignTimeDefineByType(node.type)
      const DesignTimeComponent = compDefine.DesignTimeComponent
      const props = { ...compDefine.defaultProps, ...node }
      const vdrRect = this.calcVdrRect(props)
      return (
        <Vdr
          parent={true}
          props={vdrRect}
          snap={true}
          // prevent-deactivation={true}
          onDragstop={(x, y) => {
            this.onNodeMoved(node, { x, y })
          }}
          onResizestop={(x, y, w, h) => {
            this.onNodeResized(node, { x, y, w, h })
          }}
          onActivated={() => this.setSelected(node)}
        >
          <DesignTimeComponent
            props={{
              props: { renderContext: this.renderContext, ...props },
            }}
          />
        </Vdr>
      )
    },
    calcVdrRect(rect) {
      const { x = 0, y = 0, width = 10, height = 10 } = rect || {}
      const { displayScale } = this.renderContext
      return {
        x: x * displayScale,
        y: y * displayScale,
        w: (width || 10) * displayScale,
        h: (height || 10) * displayScale,
      }
    },
    onNodeMoved(node, position) {
      const { x, y } = position
      const { displayScale } = this.renderContext
      this.updateNodeValue(node, {
        x: Number.parseFloat((x / displayScale).toFixed(1)),
        y: Number.parseFloat((y / displayScale).toFixed(1)),
      })
    },
    onNodeResized(node, rect) {
      const { x, y, w, h } = rect
      const { displayScale } = this.renderContext
      this.updateNodeValue(node, {
        x: Number.parseFloat((x / displayScale).toFixed(1)),
        y: Number.parseFloat((y / displayScale).toFixed(1)),
        width: Number.parseFloat((w / displayScale).toFixed(1)),
        height: Number.parseFloat((h / displayScale).toFixed(1)),
      })
    },
    updateNodeValue(node, valueMap) {
      this.$emit('selectedUpdated', valueMap)
    },
    setSelected(node) {
      this.$emit('nodeSelected', node)
    },
  },
  render() {
    const pageProps = this.props
    return this.renderPage(pageProps)
  },
}
export default {
  displayName: '页面',
  group: 'page',
  icon: 'el-icon-document-add',
  DesignTimeComponent,
  isContainer: true,
  properties: [
    // { name: 'name', displayName: '名字', type: 'string' },
    {
      name: 'width',
      displayName: '页面宽度',
      type: 'number',
      default: 210,
      precision: 1,
    },
    {
      name: 'height',
      displayName: '页面高度',
      type: 'number',
      default: 297,
      precision: 1,
    },
    {
      name: 'unit',
      displayName: '尺寸单位',
      type: 'string',
      default: 'mm',
      enum: ['mm'],
    },
  ],
}
