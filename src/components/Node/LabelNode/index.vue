<template lang="pug">
.label-node(:style='style')
  span(:style='spanStyle', style='width: 100%') {{ displayValue }}
</template>
<script>
const V_ALIGN_MAP = {
  top: 'flex-start',
  center: 'center',
  bottom: 'flex-end',
}

export default {
  props: {
    name: { type: String, default: '' },
    x: { type: Number, default: 0 },
    y: { type: Number, default: 0 },
    width: { type: Number, default: 0 },
    height: { type: Number, default: 0 },
    text: { type: String, default: '' },
    bindField: { type: String, default: '' },
    horizontalAlign: { type: String, default: 'left' },
    verticalAlign: { type: String, default: 'center' },
    fontFamily: { type: String, default: '' },
    fontWeight: { type: String, default: 'normal' },
    fontStyle: { type: String, default: 'normal' },
    fontSize: { type: String, default: '12pt' },
    fontColor: { type: String, default: 'black' },
    multipleLine: { type: Boolean, default: false },
    dataContext: { type: Object, default: () => ({}) },
    renderContext: { type: Object, default: () => ({ displayScale: 1 }) },
  },
  computed: {
    displayValue() {
      return (this.dataContext && this.bindField && this.dataContext[this.bindField]) || this.text
    },
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
    displayFontSize() {
      const fontSize = this.fontSize || '12pt'
      var size = Number.parseFloat(fontSize)
      const unit = (/[a-z]+$/.exec(fontSize) || [])[0] || 'mm' // 只能是mm或pt
      if (unit === 'pt') {
        // 单位是pt的话转换为mm
        size *= 25.4 / 72
      } else if (unit !== 'mm') {
        console.warn(`字体单位只能是mm或pt，当前单位为：${unit}`)
      }
      size *= this.displayScale
      return `${size}px`
    },
    style() {
      const verticalAlign = this.verticalAlign || 'center'
      const alignItems = V_ALIGN_MAP[verticalAlign] || 'center'
      return {
        left: `${this.displayX}px`,
        top: `${this.displayY}px`,
        width: `${this.displayWidth}px`,
        height: `${this.displayHeight}px`,
        display: 'flex',
        flexDirection: 'row',
        alignItems,
        fontFamily: this.fontFamily,
        fontSize: this.displayFontSize,
        fontWeight: this.fontWeight,
        fontStyle: this.fontStyle,
        color: this.fontColor,
        wordWrap: this.multipleLine ? 'break-word' : 'normal',
      }
    },
    spanStyle() {
      const horizontalAlign = this.horizontalAlign || 'left'
      return {
        textAlign: horizontalAlign,
      }
    },
  },
}
</script>
<style scoped>
.label-node {
  position: absolute;
}
</style>
