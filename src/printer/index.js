import runtimeComponents from '../components/runtime'
import Vue from 'vue'
import html2canvas from 'html2canvas'
import { jsPDF } from 'jspdf'
const printRenderDiv = 'div_printing'
const printIframe = 'iframe_printing'
function getComponent(nodeType) {
  return (runtimeComponents.find((c) => c.name === nodeType) || {}).component
}

/**
 * Print with template
 * @param {object} template template object
 * @param {object} data data context object
 * @param {object} [options]
 * @param {boolean} options.noConform default true
 * @param {Number} options.quality default 3
 */
function print(template, data, options) {
  var ele = document.getElementById(printRenderDiv)
  var pdfIframeEle = document.getElementById(printIframe)
  const { noConform = true, quality = 3 } = options || {}
  if (!ele) {
    ele = document.createElement('div')
    ele.id = printRenderDiv
    document.body.appendChild(ele)
  }
  if (!pdfIframeEle) {
    pdfIframeEle = document.createElement('iframe')
    pdfIframeEle.id = printIframe
    pdfIframeEle.style.display = 'none'
    document.body.appendChild(pdfIframeEle)
  }
  const { width = 210, height = 297 } = template
  new Vue({
    el: ele,
    methods: {
      renderNode(node, renderContext, dataContext) {
        var Comp = getComponent(node.type)
        if (!Comp) return null
        const props = { ...node }
        delete props.children
        return (
          <Comp
            props={props}
            renderContext={renderContext}
            dataContext={dataContext}
          >
            {(node.children || []).map((child) =>
              this.renderNode(child, renderContext, dataContext)
            )}
          </Comp>
        )
      },
      async print() {
        const canvas = await html2canvas(this.$refs.printing)
        const img = new Image()
        img.src = canvas.toDataURL('image/jpeg')
        const pdf = new jsPDF(width > height ? 'l' : 'p', 'mm', [width, height])
        pdf.addImage(canvas, 'jpg', 0, 0, width, height)
        pdf.autoPrint({ variant: noConform ? 'non-conform' : 'javascript' })
        pdfIframeEle.src = pdf.output('dataurlstring')
      },
    },
    render() {
      const renderContext = { displayScale: quality }
      const style = {
        position: 'absolute',
        left: `-${width * quality}px`,
      }
      return (
        <div id={printRenderDiv} style={style}>
          <div ref="printing" style="background:white">
            {this.renderNode(template, renderContext, data)}
          </div>
        </div>
      )
    },
    mounted() {
      this.print()
    },
  })
}

export default { print }
