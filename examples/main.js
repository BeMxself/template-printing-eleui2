import Vue from 'vue'
import App from './App'
import TP from '../src'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'

Vue.use(ElementUI)
Vue.use(TP)

new Vue({
  el: '#app',
  render: (h) => h(App),
})
