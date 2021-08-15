# template-printing-eleui

套打编辑器/打印，前端打印实现原理为：
- 解析模版通过 vue 生成 html 视图
- 通过 html2canvas 将 html 转换为 canvas
- 再通过 jspdf 将 canvas 生成的图片插入到 PDF 页面上
- 将 PDF 设置为自动打印
- 把 PDF 转换为 dataurl 传递给 隐藏的 <iframe> 实现自动打印

## 安装

```bash
npm install template-printing-eleui
```

## 编辑器（Vue组件：Designer）

### 属性

#### template

类型: Object
为编辑器指定初始模版，不支持双向绑定

#### rightToolbar

类型: String[]
指定右侧工具栏的按钮及顺序，可选值: 'reference', 'export', 'test', 'save'

'reference': 设置套打页面设计的参照图片
'export': 导出打印模版
'test': 测试模版
'save': 保存（触发@save事件）

### 事件

#### change

每次编辑都会触发，事件参数为最新的模版对象

#### save

点击「保存」按钮的时候触发，事件参数为最新的模版对象

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
import { Printer } from 'template-printing-eleui'
Printer.print(template, data)
```
