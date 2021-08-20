import { getFromTree, mergeTrees } from 'tree-like-object-utils'

const ui = {
  namespaced: true,
  state: {
    copyNode: null,
    selectedNode: null,
    referenceDataUrl: null,
    referenceUrl: null,
    referenceScale: 100,
    referenceOffsetX: 0,
    referenceOffsetY: 0,
    referenceAlpha: 0,
  },
  getters: {
    reference(state) {
      const {
        referenceDataUrl: dataUrl,
        referenceUrl: url,
        referenceScale: scale,
        referenceOffsetX: offsetX,
        referenceOffsetY: offsetY,
        referenceAlpha: alpha,
      } = state
      return {
        dataUrl,
        url,
        offsetX,
        offsetY,
        scale,
        alpha,
      }
    },
  },
  mutations: {
    setSelected(state, node) {
      state.selectedNode = node
    },
    setReferenceDataUrl(state, imgDataUrl) {
      state.referenceDataUrl = imgDataUrl
    },
    setReferenceUrl(state, imgUrl) {
      state.referenceUrl = imgUrl
    },
    setReferenceScale(state, scale) {
      state.referenceScale = scale
    },
    setReferenceOffsetX(state, offsetX) {
      state.referenceOffsetX = offsetX
    },
    setReferenceOffsetY(state, offsetY) {
      state.referenceOffsetY = offsetY
    },
    setReferenceAlpha(state, alpha) {
      state.referenceAlpha = alpha
    },
    resetReference(state) {
      state.referenceDataUrl = null
      state.referenceUrl = null
      state.referenceScale = 100
      state.referenceOffsetX = 0
      state.referenceOffsetY = 0
      state.referenceAlpha = 0
    },
    setCopyNode(state, node) {
      state.copyNode = node
    },
  },
  actions: {
    deleteSelectedNode({ state, dispatch, commit }) {
      const { __path: nodePath } = state.selectedNode || {}
      if (!nodePath) return
      commit('setSelected', null)
      dispatch('core/deleteNode', nodePath, { root: true })
    },
    copySelected({ state, commit }) {
      const selectedNode = state.selectedNode
      if (!selectedNode || !selectedNode.__path) return
      const nodeToCopy = mergeTrees({}, null, selectedNode)
      delete nodeToCopy.__path
      if (navigator.clipboard) {
        navigator.clipboard.writeText(JSON.stringify(nodeToCopy, null, '  '))
      } else {
        commit('setCopyNode', nodeToCopy)
      }
    },
    async pasteCopied({ state, dispatch }) {
      var copied = null
      if (navigator.clipboard) {
        try {
          const copiedText = await navigator.clipboard.readText()
          copied = JSON.parse(copiedText)
        } catch {
          return
        }
      } else {
        copied = state.copyNode
      }
      if (!copied || !copied.type) return

      const node = { ...copied }
      node.x += 1
      node.y += 1
      dispatch('core/addNode', node, { root: true })
    },
    updateSelected({ dispatch, state, commit, rootGetters }, updates) {
      const { __path: nodePath } = state.selectedNode || {}
      if (typeof nodePath !== 'string') return
      dispatch('core/updateNode', { nodePath, updates }, { root: true })
      commit('setSelected', getFromTree(rootGetters['core/rootNode'], nodePath))
    },
  },
}
export default ui
