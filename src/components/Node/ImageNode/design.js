import NodeProps from '../../common/NodeProps'
import ImageNode from './index'

const DesignTimeComponent = {
  props: {
    props: { type: Object, default: () => ({}) },
  },
  render() {
    const props = this.props
    const { displayScale = 1 } = props.renderContext || {}
    var url = props.url
    if (props.bindField || !url) {
      const text = (props.bindField && `[${props.bindField}]`) || '<空>'
      const canvas = document.createElement('canvas')
      const width = props.width * displayScale
      const height = props.height * displayScale
      canvas.width = width
      canvas.height = height
      const context = canvas.getContext('2d')
      context.fillStyle = '#eee'
      context.textBaseline = 'middle'
      context.textAlign = 'center'
      context.fillRect(0, 0, width, height)
      context.font = '13px 宋体'
      context.fillStyle = 'gray'
      context.fillText(text, width / 2, height / 2, width)
      url = canvas.toDataURL('image/jpeg')
    }
    return (
      <ImageNode
        width={props.width}
        height={props.height}
        verticalAlign={props.verticalAlign}
        horizontalAlign={props.horizontalAlign}
        renderContext={props.renderContext}
        stretchMode={props.stretchMode}
        cropImage={props.cropImage}
        url={url}
      />
    )
  },
}

export default {
  displayName: '图片',
  icon: 'el-icon-picture-outline',
  group: 'node',
  DesignTimeComponent,
  properties: [
    ...NodeProps,
    {
      name: 'width',
      displayName: '宽度',
      type: 'number',
      default: 25,
      precision: 1,
    },
    {
      name: 'height',
      displayName: '高度',
      type: 'number',
      default: 25,
      precision: 1,
    },
    {
      name: 'url',
      displayName: '图片地址',
      type: 'string',
      default: '',
    },
    { name: 'bindField', displayName: '绑定字段', type: 'string', default: '' },
    {
      name: 'horizontalAlign',
      displayName: '水平位置',
      type: 'string',
      default: 'left',
      enum: [
        { label: '左对齐', value: 'left' },
        { label: '居中', value: 'center' },
        { label: '右对齐', value: 'right' },
      ],
    },
    {
      name: 'verticalAlign',
      displayName: '垂直位置',
      type: 'string',
      default: 'center',
      enum: [
        { label: '顶部对齐', value: 'top' },
        { label: '垂直居中', value: 'center' },
        { label: '底部对齐', value: 'bottom' },
      ],
    },
    {
      name: 'stretchMode',
      displayName: '拉伸模式',
      type: 'string',
      default: 'full-width',
      enum: [
        { label: '适应宽度', value: 'full-width' },
        { label: '适应高度', value: 'full-height' },
        { label: '拉伸', value: 'stretch' },
      ],
    },
    {
      name: 'cropImage',
      displayName: '剪裁溢出',
      type: 'boolean',
      default: true,
    },
  ],
}
