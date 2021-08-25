<template>
  <div :style="style">
    <img :src="imgSrc" v-bind="imgSize" />
  </div>
</template>
<script>
const V_ALIGN_MAP = {
  top: 'flex-start',
  center: 'center',
  bottom: 'flex-end',
}
const H_ALIGN_MAP = {
  left: 'flex-start',
  center: 'center',
  right: 'flex-end',
}
export default {
  props: {
    name: { type: String, default: '' },
    x: { type: Number, default: 0 },
    y: { type: Number, default: 0 },
    width: { type: Number, default: 0 },
    height: { type: Number, default: 0 },
    url: { type: String, default: '' },
    bindField: { type: String, default: '' },
    horizontalAlign: { type: String, default: 'left' },
    verticalAlign: { type: String, default: 'center' },
    dataContext: { type: Object, default: () => ({}) },
    stretchMode: { type: String, default: 'full-width' },
    cropImage: { type: Boolean, default: true },
    renderContext: { type: Object, default: () => ({ displayScale: 1 }) },
  },
  computed: {
    displayScale() {
      return (this.renderContext && this.renderContext.displayScale) || 1
    },
    displayX() {
      return this.x * this.displayScale
    },
    displayY() {
      return this.y * this.displayScale
    },
    displayWidth() {
      return this.width * this.displayScale
    },
    displayHeight() {
      return this.height * this.displayScale
    },
    style() {
      const horizontalAlign = this.horizontalAlign || 'left'
      const verticalAlign = this.verticalAlign || 'center'
      const alignItems = V_ALIGN_MAP[verticalAlign] || 'center'
      const justifyContent = H_ALIGN_MAP[horizontalAlign] || 'flex-start'
      return {
        position: 'absolute',
        left: `${this.displayX}px`,
        top: `${this.displayY}px`,
        width: `${this.displayWidth}px`,
        height: `${this.displayHeight}px`,
        display: 'flex',
        flexDirection: 'row',
        alignItems,
        justifyContent,
        overflow: this.cropImage ? 'hidden' : 'visible',
      }
    },
    imgSrc() {
      if (this.bindField && this.dataContext) {
        return this.dataContext[this.bindField]
      }
      return this.url || ''
    },
    imgSize() {
      const size = {}
      switch (this.stretchMode) {
        case 'stretch':
          size.height = this.displayHeight
          size.width = this.displayWidth
          break
        case 'full-height':
          size.height = this.displayHeight
          break
        default:
          size.width = this.displayWidth
          break
      }
      return size
    },
  },
}
</script>
