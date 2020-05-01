class DB {

  /**
   * 从缓存提取值
   *
   * @static
   * @param {string} key
   * @returns
   * @memberof DB
   */
  static get (key) {
    let localValue = localStorage.getItem(key)
    return localValue ? JSON.parse(localValue) : null
  }

  /**
   *
   * 写入缓存
   * @static
   * @param {string} key 键
   * @param {string} value 值
   * @memberof DB
   */
  static set (key, value) {
    localStorage.setItem(key, JSON.stringify(value))
  }
}

export default DB