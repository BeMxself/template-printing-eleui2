import Vuex from 'vuex'
import Vue from 'vue'
import core from './modules/core'
import ui from './modules/ui'

Vue.use(Vuex)

const store = new Vuex.Store({
  modules: {
    core,
    ui,
  },
})

export default store
