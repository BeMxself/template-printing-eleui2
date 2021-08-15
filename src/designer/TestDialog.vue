<template lang="pug">
el-dialog(:visible.sync='visible', title='测试套打模版')
  div 测试数据
    el-input(type='textarea', rows='10', v-model='dataJson')
  el-button(type='primary', @click='print', :disabled='!dataContext') 打印
</template>
<script>
import printer from '../printer'
import store from './store'
import { walkTree } from 'tree-like-object-utils'

export default {
  data() {
    return {
      visible: false,
      dataJson: '',
    }
  },
  computed: {
    template() {
      return store.state.core.rootNode
    },
    dataContext() {
      try {
        return JSON.parse(this.dataJson)
      } catch {
        return null
      }
    },
  },
  methods: {
    show() {
      this.visible = true
      const obj = {}
      walkTree(this.template, ({ value }) => {
        if (value.bindField) {
          obj[value.bindField] = ''
        }
      })
      this.dataJson = JSON.stringify(obj, null, '  ')
    },
    print() {
      printer.print(this.template, this.dataContext || {})
    },
  },
}
</script>
