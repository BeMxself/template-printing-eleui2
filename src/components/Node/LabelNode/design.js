import NodeProps from '../../common/NodeProps'
import LabelNode from './index'

const DesignTimeComponent = {
  props: {
    props: { type: Object, default: () => ({}) },
  },
  render() {
    const props = this.props
    const displayText =
      (props.bindField && `[${props.bindField}]`) || props.text || props.name || '<空标签>'
    return (
      <LabelNode
        width={props.width}
        height={props.height}
        verticalAlign={props.verticalAlign}
        horizontalAlign={props.horizontalAlign}
        renderContext={props.renderContext}
        fontSize={props.fontSize}
        fontWeight={props.fontWeight}
        fontStyle={props.fontStyle}
        fontColor={props.fontColor}
        multipleLine={props.multipleLine}
        text={displayText}
      />
    )
  },
}
export default {
  displayName: '标签',
  icon: 'el-icon-plus',
  group: 'node',
  DesignTimeComponent,
  defaultProps: { width: 25, height: 8, x: 10, y: 10 },
  properties: [
    ...NodeProps,
    { name: 'width', displayName: '宽度', type: 'number', default: 25, precision: 1 },
    { name: 'height', displayName: '高度', type: 'number', default: 8, precision: 1 },
    { name: 'text', displayName: '文字', type: 'string', default: 'Label' },
    { name: 'bindField', displayName: '绑定字段', type: 'string', default: '' },
    {
      name: 'horizontalAlign',
      displayName: '文字对齐',
      type: 'string',
      default: 'left',
      enum: ['left', 'center', 'right'],
    },
    {
      name: 'verticalAlign',
      displayName: '纵向对齐',
      type: 'string',
      default: 'center',
      enum: ['top', 'center', 'bottom'],
    },
    { name: 'fontName', displayName: '字体', type: 'string', default: '' },
    { name: 'fontSize', displayName: '字体大小', type: 'string', default: '12pt' },
    { name: 'fontColor', displayName: '颜色', type: 'string', default: 'black' },
    {
      name: 'fontWeight',
      displayName: '字重',
      type: 'string',
      default: 'normal',
      enum: ['normal', 'bold'],
    },
    {
      name: 'fontStyle',
      displayName: '字体样式',
      type: 'string',
      default: 'normal',
      enum: ['normal', 'italic'],
    },
    { name: 'multipleLine', displayName: '自动换行', type: 'boolean', default: false },
  ],
}
