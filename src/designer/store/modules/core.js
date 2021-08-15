import { getFromTree, mergeTrees, walkTree } from 'tree-like-object-utils'

const core = {
  namespaced: true,
  state: {
    rootNode: null,
    selectedNode: null,
    copied: null,
    referenceBg: null,
    referenceScale: 100,
    referenceOffsetX: 0,
    referenceOffsetY: 0,
    referenceAlpha: 0,
  },
  getters: {
    rootNode(state) {
      const rootNode = state.rootNode
      if (!rootNode) return null
      const root = mergeTrees({}, null, rootNode)
      walkTree(
        root,
        (node, pathArray) => {
          node.value.__path = [...pathArray.map((p) => p.key), node.key].join(
            '.'
          )
        },
        { childNameKey: '_' }
      )
      return root
    },
    nodeNames(state) {
      const rootNode = state.rootNode || {}
      const names = []
      walkTree(rootNode, ({ value }) => {
        names.push(value.name)
      })
      return names
    },
  },
  mutations: {
    setRootNode(state, node) {
      state.referenceBg = null
      state.referenceScale = 100
      state.referenceOffsetX = 0
      state.referenceOffsetY = 0
      state.referenceAlpha = 0
      state.selectedNode = null
      state.rootNode = node
    },
    updateRootNode(state, node) {
      state.rootNode = node
    },
    setSelected(state, node) {
      state.selectedNode = node
    },
    setReferenceBg(state, imgDataUrl) {
      state.referenceBg = imgDataUrl
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
      state.referenceBg = null
      state.referenceScale = 100
      state.referenceOffsetX = 0
      state.referenceOffsetY = 0
      state.referenceAlpha = 0
    },
    setCopied(state, copied) {
      state.copied = copied
    },
  },
  actions: {
    addNode({ state, getters, commit }, { nodeDefine, node }) {
      const nodeNames = getters.nodeNames
      node = node || {}
      if (!node.name) {
        var prefix = nodeDefine
          ? nodeDefine.namePrefix || nodeDefine.name
          : node.type
        prefix = prefix.replace(/^(\w)/, ($0, $1) => $1.toLowerCase())
        const regex = new RegExp(`^${prefix}(\\d+)$`)
        const [max = 0] = nodeNames
          .map((n) => regex.exec(n))
          .filter((n) => !!n)
          .map((n) => Number.parseInt(n[1]))
          .sort((a, b) => b - a)
        node.name = `${prefix}${max + 1}`
      }
      const newNode = [...((nodeDefine && nodeDefine.properties) || [])].reduce(
        (props, curr) => ({ [curr.name]: curr.default, ...props }),
        {
          type: nodeDefine && nodeDefine.name,
          ...node,
        }
      )
      if (nodeDefine && nodeDefine.group === 'page') {
        commit('setRootNode', newNode)
        return
      }
      const rootNode = mergeTrees({}, null, state.rootNode)
      rootNode.children = [...(rootNode.children || []), newNode]
      commit('updateRootNode', rootNode)
    },
    deleteSelectedNode({ state, getters, commit }) {
      const node = state.selectedNode
      if (!node || node.type.includes('Page')) return
      const rootNode = mergeTrees({}, null, getters.rootNode)
      rootNode.children = (rootNode.children || []).filter(
        (c) => c.__path !== node.__path
      )
      walkTree(rootNode, ({ value }) => {
        delete value.__path
      })
      console.warn(rootNode)
      commit('updateRootNode', rootNode)
    },
    updateNode({ state, getters, commit }, { node, updates }) {
      const root = {}
      mergeTrees(root, null, state.rootNode)
      const foundNode = getFromTree(root, node.__path)
      Object.assign(foundNode, updates)
      commit('updateRootNode', root)
      if (state.selectedNode) {
        commit(
          'setSelected',
          getFromTree(getters.rootNode, state.selectedNode.__path)
        )
      }
    },
    copySelected({ state, commit }) {
      const selectedNode = state.selectedNode
      if (!selectedNode || selectedNode.type.toLowerCase().includes('page'))
        return
      commit('setCopied', { ...selectedNode })
    },
    pasteCopied({ state, dispatch }) {
      const copied = state.copied
      if (!copied) return
      const node = { ...copied }
      delete node.name
      node.x += 1
      node.y += 1
      dispatch('addNode', { node })
    },
  },
}

export default core
