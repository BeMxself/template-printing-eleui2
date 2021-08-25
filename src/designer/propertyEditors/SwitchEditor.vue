
<script>
export const meta = {
  type: 'boolean',
}
export default {
  meta,
  props: {
    value: { type: Boolean, default: false },
  },
  render() {
    return (
      <el-switch
        value={this.value}
        onInput={(value) => this.$emit('input', value)}
      ></el-switch>
    )
  },
}
</script>
