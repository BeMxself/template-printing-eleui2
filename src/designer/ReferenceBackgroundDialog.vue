<template lang="pug">
el-dialog(:visible.sync='visible', title='参照图片设置')
  el-form(label-width='90px')
    el-form-item
      input(
        @change='chooseImage',
        accept='.jpg, .jpeg, .png, .gif',
        ref='fileInput',
        style='display: none',
        type='file'
      )
      el-button(
        @click='reset',
        size='small',
        type='danger',
        v-if='referenceBg'
      ) 重置
      el-button(
        @click='onChooseImageClick',
        size='small',
        type='primary',
        v-else
      ) 选择图片
    el-form-item(label='缩放')
      el-slider(
        :format-tooltip='percentTooltip',
        :marks='{ 100: "100%" }',
        :max='300',
        :min='0.1',
        :step='0.1',
        :value='scale',
        @input='changeScale',
        show-input
      )
    el-form-item(label='横向偏移')
      el-slider(
        :format-tooltip='percentTooltip',
        :marks='{ 0: "0%" }',
        :max='100',
        :min='-100',
        :step='0.1',
        :value='offsetX',
        @input='changeOffsetX',
        show-input
      )
    el-form-item(label='纵向偏移')
      el-slider(
        :format-tooltip='percentTooltip',
        :marks='{ 0: "0%" }',
        :max='100',
        :min='-100',
        :step='0.1',
        :value='offsetY',
        @input='changeOffsetY',
        show-input
      )
    el-form-item(label='透明度')
      el-slider(
        :format-tooltip='percentTooltip',
        :max='100',
        :min='0',
        :step='1',
        :value='alpha',
        @input='changeAlpha',
        show-input
      )
</template>
<script>
import store from './store'
export default {
  data() {
    return {
      visible: false,
    }
  },
  computed: {
    referenceBg() {
      return store.state.core.referenceBg
    },
    scale() {
      return store.state.core.referenceScale
    },
    offsetX() {
      return store.state.core.referenceOffsetX
    },
    offsetY() {
      return store.state.core.referenceOffsetY
    },
    alpha() {
      return store.state.core.referenceAlpha
    },
  },
  methods: {
    show() {
      this.visible = true
    },
    percentTooltip(value) {
      return `${value}%`
    },
    reset() {
      store.commit('core/resetReference')
    },
    onChooseImageClick() {
      this.$refs.fileInput.value = null
      this.$refs.fileInput.click()
    },
    chooseImage() {
      const [file] = this.$refs.fileInput.files || []
      if (!file) return
      const reader = new FileReader()
      reader.onloadend = (e) => {
        const { result } = e.target || e.srcElement || {}
        store.commit('core/setReferenceBg', result)
      }
      reader.readAsDataURL(file)
    },
    changeScale(value) {
      store.commit('core/setReferenceScale', value)
    },
    changeOffsetX(value) {
      store.commit('core/setReferenceOffsetX', value)
    },
    changeOffsetY(value) {
      store.commit('core/setReferenceOffsetY', value)
    },
    changeAlpha(value) {
      store.commit('core/setReferenceAlpha', value)
    },
  },
}
</script>
