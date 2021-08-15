import Designer from './designer'
import Printer from './printer'

const install = function (Vue) {
  if(install.installed){return}
  Vue.component('template-printing-designer', Designer)
}
if(typeof window !== 'undefined' && window.Vue){
  install(window.Vue)
}

export default {
  install,
  Designer,
  Printer
}