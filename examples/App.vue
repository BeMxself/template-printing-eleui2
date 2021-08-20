<template>
  <template-printing-designer
    :designContext.sync="designContext"
    @change="onChange"
    @save="onSave"
    v-model="page"
  ></template-printing-designer>
</template>
<script>
const PAGE_PROPS_DEFAULT = {
  name: 'simplePage1',
  type: 'SimplePage',
  width: 210,
  height: 150,
  unit: 'mm',
  children: [
    { type: 'LabelNode', name: 'labelNode1', x: 10, y: 50, text: 'Label1' },
  ],
}
const DESIGN_CONTEXT_DEFAULT = {
  reference: {
    url: 'https://iknow-pic.cdn.bcebos.com/4034970a304e251fae75ad03a786c9177e3e534e',
    alpha: 50,
  },
}
export default {
  data() {
    return {
      page: { ...PAGE_PROPS_DEFAULT },
      designContext: { ...DESIGN_CONTEXT_DEFAULT },
    }
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
