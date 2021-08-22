# template-printing-eleui2

套打编辑器/打印，前端打印实现原理为：
- 解析模版通过 vue 生成 html 视图
- 通过 html2canvas 将 html 转换为 canvas
- 再通过 jspdf 将 canvas 生成的图片插入到 PDF 页面上
- 将 PDF 设置为自动打印
- 把 PDF 转换为 dataurl 传递给 隐藏的 <iframe> 实现自动打印

## 安装

```bash
npm install template-printing-eleui2 -S
```

在 vue.config.js 中配置显式转译依赖

```js
  transpileDependencies: ['template-printing-eleui2']
```

## 编辑器（Designer, Vue组件）

### 属性

#### template（v-model）

类型: Object

为编辑器指定初始模版，支持双向绑定


#### designContext

类型: { reference: {dataUrl, url, offsetX, offsetY, scale, alpha} }

其中 reference.dataUrl 为 dataurl(base64) 格式的参照图片地址，url 为普通 url 格式的参照图片

offsetX, offsetY 为参照图片的偏移量(百分比)，建议取值范围为 -100～100

scale 为参照图片缩放百分比

alpha 为参照图片的透明度

支持双向绑定，在参照图片设置对话框中选择的图片会自动转换为 dataurl 赋给 reference.dataUrl 并清空 reference.url 值（为了识别参照图有没有修改过，以便保存设计期上下文）

#### rightToolbar

类型: String[]

指定右侧工具栏的按钮及顺序，可选值: 'reference', 'export', 'test', 'save'

- 'reference': 设置套打页面设计的参照图片
- 'export': 导出打印模版
- 'test': 测试模版
- 'save': 保存（触发@save事件）

### 事件

#### change

每次编辑都会触发，事件参数为最新的模版对象

#### save

点击「保存」按钮的时候触发，事件参数为最新的模版对象


### 方法

#### refreshUI()

在隐藏状态下 UI 位置和大小计算会有问题，变成显示状态时需要手动调用此方法来刷新UI

## 打印器 （Printer，非Vue组件）

### 方法

#### print(template, data, options?)

- template: 模版对象
- data: 数据对象
- options: 选项 {noConform, quality}
  - noConform: 默认true，PDF自动打印的实现方式，设置为false的时候将采用在pdf中插入javascript的方式启动自动打印
  - quality: 默认3，PDF清晰度

### 使用
```js
import { Printer } from 'template-printing-eleui2'
Printer.print(template, data)
```
