# 图床项目

[TOC]

本项目旨在整个互联网的免费的图床，整合上传, 也借此项目使用 webpack4 从零搭建一个项目，看此文的朋友我希望你拥有基础的 webpack 相关知识，包括但不限于 如何初始化一个项目、npm 是什么、yarn 是什么、webpack 基本配置、前端模块化，现在正文开始。

## 一、webpack 理论

### 1、webpack 是个啥

-   webpack 是一个模块打包器(bundler)。
-   在 webpack 看来, 前端的所有资源文件(js/json/css/img/less/...)都会作为模块处理
-   它将根据模块的依赖关系进行静态分析，生成对应的静态资源

### 2. 五个核心概念

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

### 3、webpack 工作流程

其实它简化之后就是那么简单而已，一个文本处理器
![](https://ae01.alicdn.com/kf/H2b862d4fe8f24246b9010618d9d3d2d3B.png)

## 二、如何从零写一个 webpack

其他配置其实是大同小异的，本文拿**scss**、**原生 js**来举例

### 1、环境与 webpack 编译

项目一定是分环境的，所以我们应该根据环境将文件分开

-   在**webpack**文件夹创建文件**webpack.config.dev.js**表示开发环境的配置
-   在**webpack**文件夹创建文件**webpack.config.prod.js**表示生产环境的配置

然而我们知道这两个环境的配置大多数是相同的，所以为了避免重复，我们创建一个文件**webpack.config.base.js**，表示公共配置

现在我们把注意点收缩，只关注开发环境先，等开发环境配置完成，我们再抽象一个生产环境的配置，然后再抽象公共配置 **webpack.config.dev.js**

```javaScript
// in webpack.config.dev.js
const path = require('path')
const {
    resolve
} = path

module.exports = {
    entry: resolve(__dirname, '../src/index.js'),
    output: {
        filename: 'bundle.js',
        path: resolve(__dirname, '../dist')
    },
    mode: 'development',
}
```

关于 上述代码解释 如下

-   **entry** 入口代码，这里只需要一个文件
-   **output** 输入目录的文件
-   `__dirname` 执行文件的路径，它是 node 执行的时候注入的变量，例如 webpack --config xx/xx/xx.js 那么 dirname 就是 xx/xx

### 2、配置 webpack 过程

#### 最简单的 webpack 配置

到这里，最简单的**webpack**配置已经完成，我们在**package.json**添加**script**命令**dev**，具体如下

![](https://ae01.alicdn.com/kf/H2d04fbacdb494da0972bfe5cb7062ca7D.png)

```shell
webpack --config webpack/webpack.config.dev.js
```

然后执行 `npm run dev` ，但是光这样不行，因为当 dist 的文件越来越多，很容易残留，所以我们需要将其缓存清空

清空一个文件夹的**shell**命令是 `rm -rf dist` ，但是注意这个命令在 linux 是无法正确执行的，因为在 linux 上要 sudo 提权，所以我们需要一个包来磨平这种差异，这里推荐用**rimraf**, 所以我们在 scirpt 新增一条命令 clean，代码如下

```shell
rimraf dist/*
```

![](https://ae01.alicdn.com/kf/He78722721e4e4a4185e5e213ae577a74R.png)

这样当我们每次执行 `npm run dev` 时，代码就会生成，

#### 自动监听文件变化

接下来遇到一个问题，每次修改文件都需要重新执行一次命令，这样很麻烦，我希望文件更新便自动刷新 所以我们需要在 webpack 配置中配置 watch 和 watchOptions

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

##### 如何自动打开浏览器并且热更新

如此我们就可以代码一修改编译就自动运行了。但是还是需要手动刷新页面，有没有办法自动刷新页面呢，那当然是有的
我们分解一下需求

-   自动打开浏览器
-   代码修改页面热更新

一个一个来，**自动打开浏览器**

```javaScript
// in webpack.config.dev.js
module.exports = {
    devServer: {
        hot: true,
        hotOnly: true,
        port: config.port,
        contentBase: path.resolve(__dirname, '../dist/'),
    },
}
```

其中需要注意的是，这样打开浏览器是看不到任何东西的，因为平时我们开发项目的时候打开浏览器能看得见东西是因为有一个 webpack 服务器，所以还需要做两件事

-   配置 html 模版
-   配置 webpack 服务器

###### 配置 html 模版

是什么意思呢，就是配置一个 html 文件，做为母版，在母版里面配置加载的 js 文件、样式文件等等，也是作为浏览器访问的 html 文件，我们得借助一个插件完成这件事（不是说不用插件就做不了，当然也是可以做的，后面会讲手动实现的思路） **html-webpack-plugin**

```javaScript
// in webpack.config.dev.js
const htmlWebpackPlugin = require('html-webpack-plugin')
module.exports = {
    ...其他,
    plugins: [
        ...其他,
        new htmlWebpackPlugin({
            filename: 'index.html',
            title: '图床',
            showErrors: true,
            publicPath: config.publicPath, // 这个可以作为变量塞到母版里
            template: path.join(__dirname, '../src/index.html')
        })
    ]
}
```

这样编译后使得 dist 里多一个文件 **index.html**，到此我们的模版就做好了

###### 搭建 webpack 本地服务器

这个东东其实是浏览器打开 localhost:xx 的时候访问资源所需要的承载，这个不需要太在意，就记住要一个服务器就好了。
我们一开始都是使用 webpack --config xx 来执行 webpack 构建过程的，到这里我们需要换一个库，就是让 webpack 带服务器运行的插件，**webpack-dev-serve**，至此我们的**package.json**的 script 代码修改为

```json
"scripts": {
  "test": "echo \"Error: no test specified\" && exit 1",
  "dev": "npm run clean && webpack-dev-server --config  webpack/webpack.config.dev.js --open",
  "clean": "rimraf dist/*"
}
```

这样浏览器打开之后就可以看到**index.html**的内容了

我们到现在完成了以下的功能

-   可以自动打开浏览器，运行在 webpack 服务器 （**webpack-dev-serve**+**html-webpack-plugin**）
-   自动监听文件变化，自动编译 （配置 watch）

整个项目的配置到现在如下

```javaScript
// in webpack.config.dev.js
const path = require('path')
const webpack = require('webpack')
const htmlWebpackPlugin = require('html-webpack-plugin')

const templateHtmlPlugin = function() {
    return new htmlWebpackPlugin({
        filename: 'index.html',
        title: '图床',
        showErrors: true,
        publicPath: './',
        template: path.join(__dirname, '../src/index.html')
    })
}

module.exports = {
    entry: path.resolve(__dirname, '../src/index.js'),
    watch: true,
    watchOptions: {
        // 只有开启监听模式watchOptions才有意义
        ignored: /node_modules/, // 不监听的文件或者文件夹，默认为空，支持正则匹配。
        // 监听到变化发生后，会等300ms再去执行更新，默认是300ms
        aggregateTimeout: 300,
        poll: 1000, // 判断文件是否发生变化，是通过不停的询问系统指定文件有没有发生变化实现的，默认每秒问1000次。
    },
    plugins: [
        new webpack.HotModuleReplacementPlugin(),
        templateHtmlPlugin(),
    ],
    devServer: {
        hot: true,
        port: 3108,
        contentBase: path.resolve(__dirname, '../dist/'),
    },
    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, '../dist'),
    },
    mode: 'development,
}
```

```json
// in package.json
{
	"name": "imagebed",
	"version": "1.0.0",
	"main": "index.js",
	"scripts": {
		"test": "echo \"Error: no test specified\" && exit 1",
		"dev": "npm run clean && cross-env-shell ENV=loc webpack-dev-server --config  webpack/webpack.config.dev.js --open",
		"clean": "rimraf dist/*"
	},
	"repository": {
		"type": "git",
		"url": "none"
	},
	"author": "",
	"license": "ISC",
	"devDependencies": {
		"cross-env": "^7.0.2",
		"html-webpack-plugin": "^4.2.1",
		"open-browser-webpack-plugin": "^0.0.5",
		"rimraf": "^3.0.2",
		"webpack": "^4.43.0",
		"webpack-cli": "^3.3.11",
		"webpack-dev-server": "^3.10.3"
	},
	"dependencies": {
		"axios": "^0.19.2",
		"jquery": "^3.5.0",
		"lodash": "^4.17.15"
	}
}
```

### 3、处理非 js 文件的 loader

一个前端项目里不可能只有 js 文件，我们还会有**css**文件，**字体**文件，**图片**文件等资源文件，接下来我们就一步步处理这些资源。

#### 处理 css 与预编译样式问题

如果项目不需要预处理器，这个部分可以跳过

预处理有好几个，像**less**、**sass**等等，配置方法大同小异，这里只讲**sass**的配置
在把 sass 纳入项目我们需要两个东西

-   sass 引擎 - 因为 sass 以及自成一套体系，几乎可以作为一个新的语言
-   sass-loader - webpack 如何解析 sass、scss 文件就靠这个 loader

#### sass 引擎

这个简单，直接安装就是，但是在安装时会遇到安装问题, 如下安装方法即可

```shell
npm install --save-dev node-sass --registry=https://registry.npm.taobao.org
```

#### 关于 sass 的 loader

市面上普遍是使用 **sass-loader** 但是它很慢，所以我们为了更好的性能可以使用 **fast-sass-loader**, sass 处理完就得处理 css，同样的为了性能使用 **fast-css-loader**，**style-loader**

```shell
npm install fast-sass-loader fast-css-loader style-loader --save-dev
```

然后就可以配置 webpack 了, 因为以后项目还会有很多的 loader，所以不希望太多代码聚集在同一个文件里，创建文件 **webpack\module.js**

```javaScript
// in module.js
module.exports = function() {
    return {
        rules: [{
            test: /\.scss$/,
            exclude: /node_modules/,
            loader: [
                'style-loader',
                'fast-css-loader',
                'fast-sass-loader',
            ]
        }, ]
    }
}
```

```javaScript
// in webpack.config.dev.js
const moduleConfig = require('./module')

module.exports = {
    module: moduleConfig(),
}
```

这样我们的 sass 文件就可以被 webpack 识别，并且在页面生效了，那么能不即用**sass**又用**less**呢，当然是可以的，只要两个 loader 就可以了，（项目里最好不要用两个，为了技术栈统一，现在是为了展示 loader 是如何使用的）

##### 如何让项目即支持 sass 也支持 less

less 没有自成一个体系，所以不需要引擎，只需要 loader 就可以了

```shell
npm install less less-loader --save-dev
```

然后配置 module.js

```javaScript
rules: [{
    test: /\.(less|css)$/,
    loader: [
        'style-loader',
        'fast-css-loader',
        'less-loader'
    ]
}],
```

然后我们的项目就两种都支持了

### 3、如何做热更新

现在项目的代码修改是会引起浏览器刷新的，如果希望不刷新也能更新代码，则需要继续配置

```javaScript
// in webpack.config.dev.js
module.exports = {
    plugins: [
        new webpack.HotModuleReplacementPlugin(),
        new webpack.NamedModulesPlugin(), // +
        new OpenBrowserPlugin({
            url: `http://localhost:${config.port}`
        }),
        templateHtmlPlugin(),
    ],
    devServer: {
        hot: true,
        hotOnly: true, // +
        port: config.port,
        contentBase: path.resolve(__dirname, '../dist/'),
    },
}
```

### 4、查看各个包在项目所占的大小

```shell
npm install webpack-bundle-analyzer --save-dev
```

```javaScript
// in webpack.config.dev.js
const {
    BundleAnalyzerPlugin
} = require('webpack-bundle-analyzer'); //打包内容分析
module.exports = {
    plugins: [
        // 其他
        new BundleAnalyzerPlugin({
            analyzerPort: 8919
        }),
    ],
}
```

### 5、希望编译的时候带进度

```shell
npm install progress-bar-webpack-plugin --save-dev
```

```javaScript
// in webpack.config.dev.js
const ProgressBarPlugin = require('progress-bar-webpack-plugin')
module.exports = {
    plugins: [
        // 其他
        new ProgressBarPlugin(),
    ],
}
```

### 6、分离 css 文件

现在我们的样式文件都是挤在 js 里面，我们希望样式文件可以分离出去，我们使用 **mini-css-extract-plugin**插件

```shell
npm install mini-css-extract-plugin --save-dev
```

```javaScript
// in webpack.config.dev.js
const miniCssExtractPlugin = require('mini-css-extract-plugin')
module.exports = {
    plugins: [
        // 其他
        new miniCssExtractPlugin({
            filename: '[name].[hash].css',
            chunkFilename: '[id].[hash].css',
        }),
    ],
    module: {
        rules: [{
                test: /\.scss|scss|css$/,
                exclude: /node_modules/,
                use: [
                    MiniCssExtractPlugin.loader,
                    'fast-css-loader',
                    'fast-sass-loader'
                ]
            },
            {
                test: /\.(less|css)$/,
                use: [
                    MiniCssExtractPlugin.loader,
                    'fast-css-loader',
                    'less-loader'
                ]
            },
        ]
    }
}
```

#### 友好的错误提示

插件**friendly-errors-webpack-plugin**

#### 静态资源拷贝

**copy-webpack-plugin**

```javaScript
new CopyWebpackPlugin([
  {
    from: resolve('static'),
    to: '地址'
  },
]),
```

#### 抽离文件大的包

例如 jquery 体积很大，可以单独取出来,在 webpack4 里很容易配置就可以满足

```javaScript
// in webpack.config.dev.js
module.exports = {
    optimization:{
        concatenateModules: true,
        splitChunks: {
          chunks: 'all',
        },
        usedExports: true
      }
}
```

希望上述几个例子可以理解 **plugins**和**loader**的作用

### 6、执行环境

我们知道每个项目都区分环境，我们希望不同环境下 webpack 的配置有些不同，比如开发环境就没必要压缩了，这个时候我们需要一个变量可以区分环境，这里就要引入**cross-env**，安装之后在 _package.json_ 的 script 中 dev 命令中改成

```shell
npm install cross-env --save-dev
```

```json
"scripts": {
  "dev": "cross-env-shell ENV=loc webpack --config  webpack/webpack.config.dev.js", // 相对于给  process.env 注入一个变量ENV为loc
  "clean": "rimraf dist/*"
}
```

现在仅仅是拥有了可以区分环境的能力，生产环境跟开发环境有几个点的区别

#### 压缩 css

压缩 css 也是要用到额外的插件**optimize-css-assets-webpack-plugin**、**cssnano**

```shell
npm install OptimizeCssAssetsPlugin --save-dev
```

```javaScript
// in webpack.config.dev.js
const cssnano = require('cssnano')
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin')
module.exports = {
    plugins: [
        // 其他
        new OptimizeCSSAssetsPlugin({
          assetNameRegExp: /\.css\.*(?!.*map)/g,  //注意不要写成 /\.css$/g
          cssProcessor: cssnano,
          cssProcessorOptions: {
            discardComments: { removeAll: true },
            safe: true,
            autoprefixer: false
          },
          canPrint: true
        }),
    ],
}
```

#### 将用不到的 css 删除

很多时候我们的样式是有大量用不上的，这样我们就可以使用两个插件将这些样式去掉

```javaScript
const purifycssWebpack = require('purifycss-webpack');
const glob = require('glob')
// ...其他代码
new purifycssWebpack({
  paths: glob.sync(模板html的地址)
})
```

#### 压缩 js

简单配置即可

```javaScript
// in webpack.config.dev.js
const cssnano = require('cssnano')
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin')
module.exports = {
    optimization: {
        concatenateModules: true,
        splitChunks: {
          chunks: 'all',
        },
        usedExports: true
      }
    },
}
```

### 8、babel 是个什么东西

首先要说明的是，现在前端流行用的 WebPack 或其他同类工程化工具会将源文件组合起来，这部分并不是 Babel 完成的，是这些打包工具自己实现的，Babel 的功能非常纯粹，以字符串的形式将源代码传给它，它就会返回一段新的代码字符串（以及 sourcemap）。他既不会运行你的代码，也不会将多个代码打包到一起，它就是个编译器，输入语言是 ES6+，编译目标语言是 ES5。

#### babel 简介

babel 实际上类似一般的的语言编译器，作用就是输入输入代码，实际上跟很多人理解的不太一样，babel 并不是只能用于 ES6 编译成 ES5，只要你愿意，你完全可以把 ES5 编译成 ES6，或者使用自己创造的某种语法（例如 JSX，以及本文结合的 babel 插件就属于这类），你需要做的只是编写对应的插件。

#### bable 原理解析

Babel 的编译过程跟绝大多数其他语言的编译器大致同理，分为三个阶段：

1. **解析**：将代码字符串解析成抽象语法树
2. **变换**：对抽象语法树进行变换操作
3. **再建**：根据变换后的抽象语法树再生成代码字符串

一句话来说就是，字符串转成另一种字符串而实现的技术是用抽象语法树 **AST**（下面会稍微讲一下）

#### 迷惑的 AST

我们都知道 javascript 代码是由一系列字符组成的，我们看一眼字符就知道它是干什么的，例如变量声明、赋值、括号、函数调用等等。但是计算机并没有眼睛可以看到，它需要某种机制去理解代码字符串，基于此考虑为了让人和计算机都能够理解代码，就有了 AST 这么个东西，它是源代码的一种映射，在某种规则中二者可以相互转化，语言引擎根据 AST 就能知道代码的作用是什么。

简单来说就是有一个东西将代码映射成内存里一个对象，如图

![](https://ae01.alicdn.com/kf/H437855c22fd749b7ad3fb5deb1dd0ce8p.png)

这里简单举个例子 ，有兴趣深究的同学可以看[The ESTree Spec](https://github.com/estree/estree)。

## 三、最后

### 代码拆分

在项目中，webpack 的配置很多，为了后期的维护，作者提出一个拆分方案

-   在跟目录创建文件夹 **webpack** 将 webpack 的配置相关的代码移到此文件夹中
-   将 **loader** 与 **plugins** 单独抽离出来
-   将具有环境相关的并且通用的配置放在**config.js**里

所以现在代码就可以拆分成以下结构

```javaScript
// in config.js
const path = require('path')

module.exports = {
  port: 6629,
  publicPath: './',
  devtool (env) {
    return env === 'loc' ? 'cheap-module-source-map' : false
  },
  watch (env) {
    return env === 'loc'
  },
  watchOptions () {
    return {
      // 只有开启监听模式watchOptions才有意义
      ignored: /node_modules/, // 不监听的文件或者文件夹，默认为空，支持正则匹配。
      // 监听到变化发生后，会等300ms再去执行更新，默认是300ms
      aggregateTimeout: 300,
      poll: 1000, // 判断文件是否发生变化，是通过不停的询问系统指定文件有没有发生变化实现的，默认每秒问1000次。
    }
  },
  mode (env) {
    return env === 'loc' ? 'development' : 'production'
  },
  optimization (env) {
    if (env === 'prod') {
      return {
        concatenateModules: true,
        splitChunks: {
          chunks: 'all',
        },
        usedExports: true
      }
    }
    return undefined
  }
}
```

```javaScript
// in module.js
const MiniCssExtractPlugin = require('mini-css-extract-plugin')

const cssLoader = function (env) {
  if (env === 'prod') {
    return ['style-loader']
  }
  return [MiniCssExtractPlugin.loader]
}

const styleLoader = function (env) {
  return [
    {
      test: /\.scss|scss|css$/,
      exclude: /node_modules/,
      use: [
        ...cssLoader(env),
        'style-loader',
        'fast-css-loader',
        'fast-sass-loader',
      ]
    },
    {
      test: /\.(less|css)$/,
      exclude: /node_modules/,
      use: [
        ...cssLoader(env),
        'fast-css-loader',
        'less-loader'
      ]
    },
  ]
}

module.exports = function (env) {
  return {
    rules: [
      ...styleLoader(env),
    ],
    noParse: /jquery/
  }
}
```

```javaScript
// in webpack.config.dev
const path = require('path')
const config = require('./config')
const plugins = require('./plugins')
const moduleConfig = require('./module')

const ENV = process.env.ENV
const distPath = path.resolve(__dirname, '../dist')

module.exports = {
  plugins: plugins(ENV, config, distPath),
  watchOptions: config.watchOptions(),
  watch: config.watch(ENV),
  module: moduleConfig(ENV),
  devtool: config.devtool(ENV),
  entry: path.resolve(__dirname, '../src/index.js'),
  devServer: {
    hot: true,
    hotOnly: true,
    port: config.port,
    contentBase: distPath,
  },
  output: {
    filename: '[name].[hash].bundle.js',
    path: distPath,
  },
  optimization: config.optimization(ENV),
  mode: config.mode(ENV),
}
```

```javaScript
// in plugins.js
const path = require('path')
const glob = require('glob')
const webpack = require('webpack')
const cssnano = require('cssnano')
const purifycssWebpack = require('purifycss-webpack')
const htmlWebpackPlugin = require('html-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const miniCssExtractPlugin = require('mini-css-extract-plugin')
const ProgressBarPlugin = require('progress-bar-webpack-plugin')
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer')//打包内容分析
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin')
const friendlyErrorsWebpackPlugin = require('friendly-errors-webpack-plugin')

const templateHtmlPlugin = function (config) {
  return new htmlWebpackPlugin({
    filename: 'index.html',
    title: '图床',
    showErrors: true,
    publicPath: config.publicPath,
    template: path.join(__dirname, '../src/index.html')
  })
}

const cssOptPlugin = function (env, config) {
  const result = []
  if (env === 'prod') {
    result.push(new OptimizeCSSAssetsPlugin({
      assetNameRegExp: /\.css\.*(?!.*map)/g,  //注意不要写成 /\.css$/g
      cssProcessor: cssnano,
      cssProcessorOptions: {
        discardComments: { removeAll: true },
        safe: true,
        autoprefixer: false
      },
      canPrint: true
    }))
    result.push(new miniCssExtractPlugin({
      filename: '[name].[hash].css',
      chunkFilename: '[id].[hash].css',
    }))
  }
  return result
}

/**
 * 处理没有用到的css
 *
 * @param {*} env
 */
const purifycss = function (env, distPath) {
  if (env === 'prod') {
    return [new purifycssWebpack({
      paths: glob.sync(distPath)
    })]
  }
  return []
}

const copyAction = function (env) {
  let result = []
  if (env === 'prod') {
    result = [new CopyWebpackPlugin([
      {
        from: path.resolve(__dirname, '../src/static'),
        to: distPath + '/static'
      },
    ])]
  }
  return result
}

module.exports = function (env, config, distPath) {
  const result = [
    ...cssOptPlugin(env),
    new ProgressBarPlugin(),
    templateHtmlPlugin(config),
    new webpack.NamedModulesPlugin(),
    new webpack.HotModuleReplacementPlugin(),
    new BundleAnalyzerPlugin({
      analyzerMode: 'disabled', // 不启动展示打包报告的http服务器
      generateStatsFile: true, // 是否生成stats.json文件 }),
    }),
    new friendlyErrorsWebpackPlugin(),
    ...purifycss(env, distPath),
    ...copyAction(env)
  ]
  return result
}
```

至今为止，代码结构如下

![](https://ae01.alicdn.com/kf/H3ca7ac71b1b74af98576884da6ca4dd81.png)

### package.json 配置

```json
{
	"name": "imagebed",
	"version": "1.0.0",
	"description": "本项目旨在整个互联网的免费的图床，整合上传,也借此项目使用webpack4从零搭建一个项目，看此文的朋友我希望你拥有基础的webpack相关知识，包括但不限于 如何初始化一个项目、npm是什么、yarn是什么、webpack基本配置、前端模块化，现在正文开始。",
	"main": "index.js",
	"scripts": {
		"test": "echo \"Error: no test specified\" && exit 1",
		"analyz": "webpack-bundle-analyzer --port 6919 ./dist/stats.json",
		"dev": "npm run clean && cross-env-shell ENV=loc webpack-dev-server --config  webpack/webpack.config.dev.js --open",
		"build": "npm run clean && cross-env-shell ENV=prod webpack --config  webpack/webpack.config.dev.js && npm run analyz",
		"prod": "npm run clean && cross-env-shell ENV=prod webpack --config  webpack/webpack.config.dev.js",
		"clean": "rimraf dist/*"
	},
	"repository": {
		"type": "git",
		"url": "none"
	},
	"author": "",
	"license": "ISC",
	"devDependencies": {
		"@babel/core": "^7.9.6",
		"@babel/polyfill": "^7.8.7",
		"@babel/preset-env": "^7.9.6",
		"@babel/runtime": "^7.9.6",
		"babel-loader": "^8.1.0",
		"copy-webpack-plugin": "^5.1.1",
		"cross-env": "^7.0.2",
		"cssnano": "^4.1.10",
		"fast-css-loader": "^1.0.2",
		"fast-sass-loader": "^1.5.0",
		"friendly-errors-webpack-plugin": "^1.7.0",
		"glob": "^7.1.6",
		"html-webpack-plugin": "^4.2.1",
		"less": "^3.11.1",
		"less-loader": "^6.0.0",
		"mini-css-extract-plugin": "^0.9.0",
		"node-sass": "^4.14.0",
		"open-browser-webpack-plugin": "^0.0.5",
		"optimize-css-assets-webpack-plugin": "^5.0.3",
		"progress-bar-webpack-plugin": "^2.1.0",
		"purify-css": "^1.2.5",
		"purifycss-webpack": "^0.7.0",
		"rimraf": "^3.0.2",
		"style-loader": "^1.2.1",
		"webpack": "^4.43.0",
		"webpack-bundle-analyzer": "^3.7.0",
		"webpack-cli": "^3.3.11",
		"webpack-dev-server": "^3.10.3",
		"webpack-parallel-uglify-plugin": "^1.1.2"
	},
	"dependencies": {
		"axios": "^0.19.2",
		"jquery": "^3.5.0",
		"lodash": "^4.17.15"
	}
}
```

### 写在最后

写了那么多，大家应该对 webpack 有一定的认识，其实这些东西都很简单只是需要大家动手尝试，最好是将每个部分的东西分离出来，这样才不会混在一起，无法阅读。本文档是项目初期写的，后期项目有更新将不会同步文档，只要掌握原理就大同小异了。有兴趣的同学可以去给我的图床项目点个**start** [⭐⭐⭐⭐⭐](https://github.com/chendss/imageBed.git)
