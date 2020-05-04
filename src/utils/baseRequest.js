
import { jsonpParse, log, get } from './index'

class XHR {
  constructor(url, headers, method) {
    this.url = url
    this.method = method
    this.headers = headers || {}
    this.xhr = new XMLHttpRequest()
    this.init()
  }

	/**
	 * 这样就可以链式调用节约一行代码
	 *
	 * @static
	 * @param {*} url
	 * @param {*} headers
	 * @returns
	 * @memberof XHR
	 */
  static new (url, headers) {
    return new this(url, headers)
  }

	/**
	 * 父类初始化
	 *
	 * @memberof XHR
	 */
  init () {
    this.xhr.timeout = 8000
    this.xhr.open(this.method, this.url, true)
    Object.keys(this.headers).forEach(key => {
      const val = this.headers[key]
      this.xhr.setRequestHeader(key, val)
    })
  }

  _send (xhr, data) {
    if (data == null) {
      xhr.send()
    } else {
      xhr.send(data)
    }
  }

	/**
	 * 请求发送
	 *
	 * @param {Object} data
	 * @returns
	 */
  xhrSend (data, onprogress) {
    const xhr = this.xhr
    xhr.withCredentials = false
    return new Promise((resolve, reject) => {
      xhr.onreadystatechange = event => {
        const that = event.currentTarget
        const status = that.status
        if (that.readyState === 4) {
          if ([200, 204].includes(status)) {
            const response = jsonpParse(that.response)
            resolve(get(response, 'data', response))
          } else if (status === 403) {
            resolve({ status, message: '没有权限' })
          } else if (that.readyState === 4) {
            reject({ status, body: that })
          }
        }
      }
      xhr.onprogress = onprogress
      xhr.ontimeout = () => reject('请求超时')
      xhr.onerror = reject
      this._send(xhr, data)
    })
  }
}

class PostXhr extends XHR {
  constructor(url, headers) {
    super(url, headers, 'post')
    this.xhr.timeout = 100 * 1000
  }

  send (data) {
    this.xhrSend(data)
  }
}

class GetXhr extends XHR {
  constructor(url, headers) {
    super(url, headers, 'get')
    this.xhr.timeout = 100 * 1000
    this.xhr.responseType = 'json'
  }

  send (data) {
    return this.xhrSend(data)
  }
}

export { PostXhr, GetXhr }
