import Nedb from 'nedb'
import { isArray, pick, map, mergeWith, get as lodashGet, isEqual, isObject, set, sum } from 'lodash'

const href = window.location.href

export const log = function () {
  console.log(...arguments)
}


export const toArray = function (source) {
  let result = []
  if (source instanceof Array) {
    result = source
  } else {
    result = [source]
  }
  return result.filter(f => !['', null, undefined].includes(f))
}

/**
* 创建数据库对象
*
* @param {*} dbPath
* @returns
*/
export const dataset = function (dbPath) {
  return new Nedb({
    filename: dbPath,
    autoload: true
  })
}

/**
* 找到一个值
*
* @param {*} dict_
* @returns
*/
export const datasetFind = function (db, dict_) {
  return new Promise((resolve) => {
    db.findOne(dict_, (err, docs) => {
      resolve(docs)
    })
  })
}

/**
 * 生成随机数
 *
 * @param {number} [n=32]
 * @returns
 */
export const random = function (n = 32) {
  let chars = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678'
  let letter = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz'
  let maxPos = chars.length
  let result = ''
  for (let i = 0; i < n; i++) {
    result += chars.charAt(Math.floor(Math.random() * maxPos))
  }
  result = letter.charAt(Math.floor(Math.random() * letter.length)) + result
  return result.substring(0, result.length - 1)
}

export const queryToObj = function (url_) {
  const url = url_ || window.location.href
  let result = {}
  const urlSplit = url.split('?')
  const len = urlSplit.length - 1
  let queryParam = urlSplit[len] || ''
  queryParam
    .split('&')
    .filter(str => str !== '')
    .forEach(str => {
      const [key, value] = str.split('=')
      result[key] = value
    })
  return result
}

export const objToQuery = function (obj) {
  let strList = []
  Object.entries(obj).forEach(entries => {
    const [key, value] = entries
    strList.push(`${key}=${value}`)
  })
  return encodeURIComponent(strList.join('&'))
}

/**
 * lodash的 get函数超集，当取得值为null、 null、undefined,''将返回默认值
 * path支持数组，会依次选取优先级高的放前面
 * @static
 * @param {object} obj 源数据
 * @param {string|array} path 参数路径
 * @param {*} defaultValue 默认值
 * @returns
 *
 */
export const get = function (obj, path, defaultValue) {
  let value = null
  const rules = [null, 'null', '', undefined]
  const pathList = toArray(path)
  for (let p of pathList) {
    value = lodashGet(obj, p + '', null)
    if (!rules.includes(value)) {
      return value
    }
  }
  return defaultValue
}

export const dpi = function (dom) {
  let dx = window.innerWidth / 1920
  dx = Math.max(dx * 0.9, 1)
  const fontSize = Number(getComputedStyle(dom).fontSize.replace('px', ''))
  const size = Math.ceil(fontSize * dx)
  const style = dom.getAttribute('style') || ''
  dom.setAttribute('style', style + `font-size:${size}px;`)
}

export const isInViewPort = function (el) {
  // viewPortHeight 兼容所有浏览器写法
  const viewPortHeight = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight
  const offsetTop = el.offsetTop
  const scrollTop = document.documentElement.scrollTop
  const top = offsetTop - scrollTop
  return top <= viewPortHeight + 100
}


/**
* 动态加载js
*
* @param {Object} srcDict src的字典
*/
export const createScriptFormRemote = function (srcDict) {
  for (let key of Object.keys(srcDict)) {
    if (document.querySelector(`#${key}`) == null) {
      const src = srcDict[key]
      const script = document.createElement("script")
      script.type = "text/javascript"
      script.src = src
      script.id = key
      document.head.appendChild(script)
    }
  }
}

/**
 * 字符串模板转换 ，将数据源对应{键}的值填入str
 *
 * @param {*} str 字符串
 * @param {*} source 数据源
 * @param {*} handle 处理函数
 * @returns
 */
export const strFormat = function (str, source, handle = () => { }) {
  if (str instanceof Function) {
    return str(source)
  } else if (!isObject(source)) {
    return str
  }
  const data = { ...source }
  const r = /{[^}]+}/
  while (r.test(str)) {
    const key = str
      .match(r)
      .toString()
      .replace('{', '')
      .replace('}', '')
    const value = get(data, key, [])
    const ids = toArray(value).filter(id => id != null)
    str = str.replace(r, ids.join(','))
    handle(key, value)
  }
  return str
}

/**
* 等待一段时间
*
* @param {*} time
* @returns
*/
export const sleep = async function (time) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve()
    }, time)
  })
}

export const openLoading = function () {
  const loading = document.querySelector("#loading")
  loading.classList.remove("none")
}

export const closeLoading = function () {
  const loading = document.querySelector("#loading")
  loading.classList.add("none")
}

/**
* 将html插入body
*
* @param {*} html
*/
export const insertBody = function (html) {
  document.querySelector('body').insertAdjacentHTML('beforeend', html)
}

/**
* 空间两点之间的距离
*
* @param {*} [point1=[]]
* @param {*} [point2=[]]
* @returns
*/
export const pointDistance = function (point1 = [], point2 = []) {
  let result = 0
  for (let i = 0; i < point1.length; i++) {
    const x1 = point1[i]
    const x2 = point2[i]
    const x = x2 - x1
    const value = Math.pow(x, 2)
    result += value
  }
  return Math.sqrt(result)
}

/**
 * lodash 的 mergeRight 改造，将会选择为null，undefined的值
 *
 * @returns
 */
export const merge = function () {
  return mergeWith(...arguments, (obj, source) => {
    if ([obj, source].some(item => [null, undefined].includes(item))) {
      return obj || source
    } else if ([obj, source].every(item => item instanceof Array)) {
      const objLen = get(obj, 'length', 0)
      const sourceLen = get(source, 'length', 0)
      if (objLen !== sourceLen) {
        return source
      }
    }
  })
}

export const jsonParse = function (obj) {
  try {
    return JSON.parse(obj)
  } catch (error) {
    return obj
  }
}

/**
* 文本转dom树
*
* @param {*} data
* @returns {Document}
*/
export const textToDom = function (data) {
  const p = new DOMParser()
  const Html = p.parseFromString(data, "text/html")
  return Html
}

/**
* iframe式请求
*
* @param {*} url
* @param {*} callback
* @returns
*/
export const iframeRequest = function (url, wait) {
  const body = document.body
  const iframe = document.createElement('iframe')
  iframe.src = url
  body.appendChild(iframe)
  return new Promise((resolve) => {
    iframe.onload = async () => {
      try {
        const win = iframe.contentWindow
        const doc = win.document
        if (wait instanceof Function) {
          await wait(doc, win)
        }
        resolve({ doc, win })
      } catch (error) {
        console.log('报错了', error, url)
        resolve(null)
      } finally {
        setTimeout(() => {
          iframe.remove()
        }, 500)
      }
    }
  })
}

export const q = s => document.querySelector(s)

export const qs = s => [...document.querySelectorAll(s)]

export const e = (dom, selector) => dom.querySelector(selector)

/**
* 相当于dom.querySelectorAll
*
* @param {*} dom
* @returns {Array<HTMLElementTagNameMap>}
* @param {*} selector
*/
export const es = (dom, selector) => [...dom.querySelectorAll(selector)]


/**
 * 清空cookies
 *
 */
export const clearCookie = function () {
  var keys = document.cookie.match(/[^ =;]+(?=\=)/g)
  let domainArray = ['.dtyunxi.cn', '.dtyunxi.com']
  if (keys) {
    for (var i = keys.length; i--;) {
      document.cookie = keys[i] + '=0;path=/;expires=' + new Date(0).toUTCString()
      document.cookie = keys[i] + '=0;path=/;domain=' + document.domain + ';expires=' + new Date(0).toUTCString()
      domainArray.forEach(domain => {
        document.cookie = keys[i] + `=0;path=/;domain=${domain};expires=` + new Date(0).toUTCString()
      })
    }
  }
}

export const average = function (list) {
  if (list instanceof Array) {
    const total = sum(list.map(i => typeof i === 'number' ? i : Number(i)))
    const len = list.length
    return Math.floor(total / len)
  } else {
    return 0
  }
}
