# 图床项目

[TOC]

本项目旨在整个互联网的免费的图床，整合上传, 也借此项目使用 webpack4 从零搭建一个项目，看此文的朋友我希望你拥有基础的 webpack 相关知识，包括但不限于 如何初始化一个项目、npm 是什么、yarn 是什么、webpack 基本配置、前端模块化，现在正文开始。

## webpack 理论

### webpack 是个啥

-   webpack 是一个模块打包器(bundler)。
-   在 webpack 看来, 前端的所有资源文件(js/json/css/img/less/...)都会作为模块处理
-   它将根据模块的依赖关系进行静态分析，生成对应的静态资源

### 五个核心概念

-   Entry：入口起点(entry point)指示 webpack 从哪个文件开始。
-   Output：output 属性告诉 webpack 把输出文件放在哪里，输出的叫什么名字。
-   Loader：loader 的概念其实非常简单，就是一个字符串处理函数，把**less、sass**之类的文件转成**css**。
-   Plugins：插件则可以用于执行范围更广的任务。插件的范围包括，从打包优化和压缩，一直到重新定义环境中的变量等。
-   Mode：模式，有生产模式 production 和开发模式 development

#### 理解 Loader

简单来说，就是处理代码、资源文件的

-   webpack 本身只能加载**js**、**json**模块，如果要加载其他类型的文件(模块)，就需要使用对应的 loader 进行转换/加载
-   Loader 本身也是运行在 node.js 环境中的 JavaScript 模块
-   它本身是一个函数，接受源文件作为参数，返回转换的结果
-   loader 一般以 xxx-loader 的方式命名，xxx 代表了这个 loader 要做的转换功能，比如 json-loader。

#### 理解 Plugins

用来扩展 webpack 功能的

-   插件可以完成一些 loader 不能完成的功能。
-   插件的使用一般是在 webpack 的配置信息 plugins 选项中指定。

### 关于**webpack.config.js**

很多文章都在说这个文件是 webpack 的配置文件，其实不能这样说，因为这个文件其实可以随便命名，即使我把它命名**xxxx.js**也是可以的，现在假设项目里有个文件，路径在**src/test.js**里面的内容是 webpack 的配置，那么我们依然可以通过 `webpack --config src/test.js` 命令启动 webpack

### webpack 工作流程

其实它简化之后就是那么简单而已，一个文本处理器
![](https://ae01.alicdn.com/kf/H2b862d4fe8f24246b9010618d9d3d2d3B.png)

## 如何从零写一个 webpack

其他配置其实是大同小异的，本文拿**scss**、**原生 js**来举例

### 环境与 webpack 编译

项目一定是分环境的，所以我们应该根据环境将文件分开

-   在**webpack**文件夹创建文件**webpack.config.dev.js**表示开发环境的配置
-   在**webpack**文件夹创建文件**webpack.config.prod.js**表示生产环境的配置

然而我们知道这两个环境的配置大多数是相同的，所以为了避免重复，我们创建一个文件**webpack.config.base.js**，表示公共配置

现在我们把注意点收缩，只关注开发环境先，等开发环境配置完成，我们再抽象一个生产环境的配置，然后再抽象公共配置 **webpack.config.dev.js**

```javaScript
// in webpack.config.dev.js
const path = require('path')
const { resolve } = path

module.exports = {
  entry: resolve(__dirname, '../src/index.js'),
  output: {
    filename: 'bundle.js',
    path: resolve(__dirname, '../dist')
  },
  mode: 'development',
}
```

#### 上述代码解释

-   **entry** 入口代码，这里只需要一个文件
-   **output** 输入目录的文件
-   `__dirname` 执行文件的路径，它是 node 执行的时候注入的变量，例如 webpack --config xx/xx/xx.js 那么 dirname 就是 xx/xx

到这里，最简单的**webpack**配置已经完成，我们在**package.json**添加**script**命令**dev**，具体如下

![](https://ae01.alicdn.com/kf/H2d04fbacdb494da0972bfe5cb7062ca7D.png)

```shell
webpack --config webpack/webpack.config.dev.js
```

然后执行 `npm run dev`，但是光这样不行，因为当 dist 的文件越来越多，很容易残留，所以我们需要将其缓存清空

清空一个文件夹的**shell**命令是`rm -rf dist`，但是注意这个命令在 linux 是无法正确执行的，因为在 linux 上要 sudo 提权，所以我们需要一个包来磨平这种差异，这里推荐用**rimraf**,所以我们在 scirpt 新增一条命令 clean，代码如下

```shell
rimraf dist/*
```

![](https://ae01.alicdn.com/kf/He78722721e4e4a4185e5e213ae577a74R.png)

这样当我们每次执行 `npm run dev`时，代码就会生成，但是这样很麻烦，我希望文件更新便自动刷新 所以我们需要在 webpack 配置中配置 watch 和 watchOptions

```javaScript
// in webpack.config.dev.js
module.exports = {
  ...其他,
  watch: true,
  watchOptions: {
    // 只有开启监听模式watchOptions才有意义
    ignored: /node_modules/, // 不监听的文件或者文件夹，默认为空，支持正则匹配。
    aggregateTimeout: 300, // 监听到变化发生后，会等300ms再去执行更新，默认是300ms
    poll: 1000, // 判断文件是否发生变化，是通过不停的询问系统指定文件有没有发生变化实现的，默认每秒问1000次。
  },
}
```

![](https://ae01.alicdn.com/kf/H62d201aa5c9b492b940a4419221511895.png)

如此我们就可以代码一修改编译就自动运行了。但是还是需要手动刷新页面，有没有办法自动刷新页面呢，那当然是有的
我们分解一下需求

-   自动打开浏览器
-   代码修改页面热更新

一个一个来，**自动打开浏览器**，使用 *open-browser-webpack-plugin*插件即可完成

```javaScript
// in webpack.config.dev.js
module.exports = {
  ...其他,
  watch: true,
  watchOptions: {
    // 只有开启监听模式watchOptions才有意义
    ignored: /node_modules/, // 不监听的文件或者文件夹，默认为空，支持正则匹配。
    aggregateTimeout: 300, // 监听到变化发生后，会等300ms再去执行更新，默认是300ms
    poll: 1000, // 判断文件是否发生变化，是通过不停的询问系统指定文件有没有发生变化实现的，默认每秒问1000次。
  },
}
```
