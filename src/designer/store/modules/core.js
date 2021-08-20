import { getFromTree, mergeTrees, walkTree } from 'tree-like-object-utils'
import { getDesignTimeDefineByType } from '../../../components'

function generateNode(nodeDefault, nodeNames = []) {
  nodeDefault = nodeDefault || {}
  nodeNames = nodeNames || []
  const nodeDefine = getDesignTimeDefineByType(nodeDefault.type || '')
  if (!nodeDefine) return

  if (!nodeDefault.name || nodeNames.includes(nodeDefault.name)) {
    var prefix = nodeDefine.namePrefix || nodeDefine.name
    prefix = prefix.replace(/^(\w)/, ($0, $1) => $1.toLowerCase())
    const regex = new RegExp(`^${prefix}(\\d+)$`)
    const [max = 0] = nodeNames
      .map((n) => regex.exec(n))
      .filter((n) => !!n)
      .map((n) => Number.parseInt(n[1]))
      .sort((a, b) => b - a)
    nodeDefault.name = `${prefix}${max + 1}`
  }
  return (nodeDefine.properties || []).reduce(
    (props, curr) => ({ [curr.name]: curr.default, ...props }),
    {
      type: nodeDefine.name,
      ...nodeDefault,
    }
  )
}

const core = {
  namespaced: true,
  state: {
    rootNode: null,
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
      state.rootNode = node
    },
  },
  actions: {
    initRoot({ commit }, rootNodeDefault) {
      const newRoot = generateNode(rootNodeDefault)
      commit('setRootNode', newRoot)
    },
    addNode({ state, getters, commit }, nodeDefault) {
      const nodeNames = getters.nodeNames
      const newNode = generateNode(nodeDefault, nodeNames)
      const rootNode = mergeTrees({}, null, state.rootNode)
      rootNode.children = [...(rootNode.children || []), newNode]
      commit('setRootNode', rootNode)
    },
    deleteNode({ getters, commit }, nodePath) {
      if (!nodePath) return
      const rootNode = mergeTrees({}, null, getters.rootNode)
      rootNode.children = (rootNode.children || []).filter(
        (c) => c.__path !== nodePath
      )
      walkTree(rootNode, ({ value }) => {
        delete value.__path
      })
      commit('setRootNode', rootNode)
    },
    updateNode({ state, commit }, { nodePath, updates }) {
      const rootNode = mergeTrees({}, null, state.rootNode)
      const foundNode = getFromTree(rootNode, nodePath)
      Object.assign(foundNode, updates)
      commit('setRootNode', rootNode)
    },
  },
}

export default core
