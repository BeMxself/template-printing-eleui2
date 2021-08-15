<script>
export default {
  props: {
    renderContext: { type: Object, default: () => ({ displayScale: 1 }) },
    dataContext: { type: Object, default: () => ({}) },
    width: { type: Number, default: 0 },
    height: { type: Number, default: 0 },
  },
  computed: {
    displayWidth() {
      return this.width * (this.renderContext.displayScale || 1)
    },
    displayHeight() {
      return this.height * (this.renderContext.displayScale || 1)
    },
  },
  render() {
    const style = {
      position: 'relative',
      width: `${this.displayWidth}px`,
      height: `${this.displayHeight}px`,
    }
    return <div style={style}>{this.$slots.default}</div>
  },
}
</script>
