
<script>
export const meta = {
  type: 'string',
  extProps: ['enum'],
}
export default {
  props: ['enum', 'value', 'name'],
  render() {
    const enums = this.enum || []
    return (
      <el-select value={this.value} onInput={(value) => this.$emit('input', value)}>
        {enums.map((opt) => {
          var label = opt
          var value = opt
          if (typeof opt === 'object' && opt !== null) {
            label = opt.label
            value = opt.value
          }
          return <el-option label={label} value={value} />
        })}
      </el-select>
    )
  },
}
</script>
