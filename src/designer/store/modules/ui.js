const ui = {
  namespaced: true,
  state: {
    propsPanelVisible: true,
    designerHeight: 1000,
    canvasSize: { width: 1000, height: 1000 },
  },
  mutations: {
    hidePropsPanel(state) {
      state.propsPanelVisible = false
    },
    showPropsPanel(state) {
      state.propsPanelVisible = true
    },
    updateDesignerHeight(state, height) {
      state.designerHeight = height
    },
    updateCanvasSize(state, size) {
      state.canvasSize = size
    },
  },
  actions: {},
}
export default ui
