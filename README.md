# 图床项目

[TOC]

本项目旨在整个互联网的免费的图床，整合上传, 也借此项目使用webpack4从零搭建一个项目，看此文的朋友我希望你拥有基础的webpack相关知识，包括但不限于 如何初始化一个项目、npm是什么、yarn是什么、webpack基本配置、前端模块化，现在正文开始。

## webpack理论

### webpack是个啥

  + webpack是一个模块打包器(bundler)。
  + 在webpack看来, 前端的所有资源文件(js/json/css/img/less/...)都会作为模块处理
  + 它将根据模块的依赖关系进行静态分析，生成对应的静态资源

###  五个核心概念

  + Entry：入口起点(entry point)指示 webpack 从哪个文件开始。
  + Output：output 属性告诉 webpack 把输出文件放在哪里，输出的叫什么名字。
  + Loader：loader的概念其实非常简单，就是一个字符串处理函数，把**less、sass**之类的文件转成**css**。
  + Plugins：插件则可以用于执行范围更广的任务。插件的范围包括，从打包优化和压缩，一直到重新定义环境中的变量等。
  + Mode：模式，有生产模式production和开发模式development

#### 理解Loader

* webpack 本身只能加载**js**、**json**模块，如果要加载其他类型的文件(模块)，就需要使用对应的loader 进行转换/加载
* Loader 本身也是运行在 node.js 环境中的 JavaScript 模块
* 它本身是一个函数，接受源文件作为参数，返回转换的结果
* loader 一般以 xxx-loader 的方式命名，xxx 代表了这个 loader 要做的转换功能，比如 json-loader。

#### 理解Plugins

* 插件可以完成一些loader不能完成的功能。
* 插件的使用一般是在 webpack 的配置信息 plugins 选项中指定。

### 关于**webpack.config.js**

很多文章都在说这个文件是webpack的配置文件，其实不能这样说，因为这个文件其实可以随便命名，即使我把它命名**xxxx.js**也是可以的，现在假设项目里有个文件，路径在**src/test.js**里面的内容是webpack的配置，那么我们依然可以通过 `webpack --config src/test.js` 命令启动webpack

### webpack工作流程

其实它简化之后就是那么简单而已，一个文本处理器
![](https://ae01.alicdn.com/kf/H2b862d4fe8f24246b9010618d9d3d2d3B.png)

## 如何从零写一个webpack

### 环境与webpack编译

项目一定是分环境的，所以我们应该根据环境将文件分开

在**webpack**文件夹创建文件**webpack.config.dev.js**表示开发环境的配置
在**webpack**文件夹创建文件**webpack.config.prod.js**表示生产环境的配置

然而我们知道这两个环境的配置大多数是相同的，所以为了避免重复，我们创建一个文件**webpack.config.base.js**，表示公共配置

``` javaScript
// in webpack.config.base.js
module.exports = {
    module: {
        rules: [{
            test: /\.js$/,
            exclude: /node_modules/,
            use: {
                loader: "babel-loader"
            }
        }]

    }
}
```
