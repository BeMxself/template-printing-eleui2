
<script>
export const meta = {
  type: 'number',
  optProps: ['precision'],
}
export default {
  meta,
  props: {
    value: { type: Number, default: null },
    precision: { type: Number, default: 0 },
  },
  data() {
    return {
      inputValue: null,
    }
  },
  computed: {
    displayValue() {
      return this.inputValue === null
        ? Number.parseFloat(this.value).toFixed(this.precision || 0)
        : this.inputValue
    },
  },
  watch: {
    value(value) {
      this.inputValue = Number.parseFloat(value).toFixed(this.precision || 0)
    },
  },
  render() {
    return (
      <el-input
        type="number"
        value={this.displayValue}
        onInput={(value) => (this.inputValue = Number.parseFloat(value))}
        onChange={(value) => this.$emit('input', Number.parseFloat(value))}
      ></el-input>
    )
  },
}
</script>
