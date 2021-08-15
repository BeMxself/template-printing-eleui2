<template lang="pug">
el-dialog(:visible.sync='visible', title='导出套打模版')
  div
    el-input(:value='json', rows='10', type='textarea')
  div(style='margin-top: 10px; display: flex; justify-content: flex-end')
    el-switch(active-text='格式化字符串', v-model='pretty')
</template>
<script>
import store from './store'
export default {
  data() {
    return {
      visible: false,
      pretty: false,
    }
  },
  computed: {
    json() {
      const rootNode = store.state.core.rootNode
      return this.pretty
        ? JSON.stringify(rootNode, null, '  ')
        : JSON.stringify(rootNode)
    },
  },
  methods: {
    show() {
      this.visible = true
    },
  },
}
</script>
