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
        v-if='reference.dataUrl'
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
        :value='reference.scale',
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
        :value='reference.offsetX',
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
        :value='reference.offsetY',
        @input='changeOffsetY',
        show-input
      )
    el-form-item(label='透明度')
      el-slider(
        :format-tooltip='percentTooltip',
        :max='100',
        :min='0',
        :step='1',
        :value='reference.alpha',
        @input='changeAlpha',
        show-input
      )
</template>
<script>
import store from './store'

async function compressImage(imgUrl) {
  const MAX_WIDTH = 600
  const img = new Image()
  await new Promise((resolve) => {
    img.onload = (e) => resolve(e)
    img.src = imgUrl
  })
  const { width, height } = img
  const dWidth = Math.min(width, MAX_WIDTH)
  const dHeight = height * (dWidth / width)
  const canvas = document.createElement('canvas')
  canvas.width = dWidth
  canvas.height = dHeight
  canvas.getContext('2d').drawImage(img, 0, 0, dWidth, dHeight)
  return canvas.toDataURL('image/jpeg', 0.8)
}
export default {
  data() {
    return {
      visible: false,
    }
  },
  computed: {
    reference() {
      return store.getters['design/reference']
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
      store.commit('design/resetReference')
    },
    onChooseImageClick() {
      this.$refs.fileInput.value = null
      this.$refs.fileInput.click()
    },
    chooseImage() {
      const [file] = this.$refs.fileInput.files || []
      if (!file) return
      const reader = new FileReader()
      reader.onloadend = async (e) => {
        const { result } = e.target || e.srcElement || {}
        const dataUrl = await compressImage(result)
        store.commit('design/setReferenceUrl', null)
        store.commit('design/setReferenceDataUrl', dataUrl)
      }
      reader.readAsDataURL(file)
    },
    changeScale(value) {
      store.commit('design/setReferenceScale', value)
    },
    changeOffsetX(value) {
      store.commit('design/setReferenceOffsetX', value)
    },
    changeOffsetY(value) {
      store.commit('design/setReferenceOffsetY', value)
    },
    changeAlpha(value) {
      store.commit('design/setReferenceAlpha', value)
    },
  },
}
</script>
