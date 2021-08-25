
<script>
export const meta = {
  type: 'string',
}
export default {
  meta,
  props: {
    value: { type: String, default: '' },
  },
  data() {
    return {
      inputValue: null,
    }
  },
  computed: {
    displayValue() {
      return this.inputValue === null ? this.value : this.inputValue
    },
    hasError() {
      return !!this.inputValue
    },
  },
  watch: {
    value(value) {
      this.inputValue = value
    },
  },
  render() {
    return (
      <el-input
        value={this.displayValue}
        onInput={(value) => (this.inputValue = value)}
        onChange={(value) => this.$emit('input', value)}
      ></el-input>
    )
  },
}
</script>
