<template>
  <template-printing-designer @change="onChange" @save="onSave" v-model="page"></template-printing-designer>
</template>
<script>
const PAGE_DEFAULT_PROPS = {
  name: 'simplePage1',
  type: 'SimplePage',
  width: 210,
  height: 297,
  unit: 'mm',
  children: [
    { type: 'LabelNode', name: 'labelNode1', x: 10, y: 50, bindField: 'test' },
  ],
}
export default {
  data() {
    return { page: { ...PAGE_DEFAULT_PROPS } }
  },
  methods: {
    onSave(template) {
      console.log('@save', template)
    },
    onChange(template) {
      console.log('@change', template)
    },
  },
}
</script>
