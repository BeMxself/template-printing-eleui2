import Vuex from 'vuex'
import Vue from 'vue'
import core from './modules/core'
import ui from './modules/ui'
import design from './modules/design'

Vue.use(Vuex)

const store = new Vuex.Store({
  modules: {
    core,
    ui,
    design,
  },
})

export default store
