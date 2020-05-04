import BaseUpload from './baseUpload'
import { log, objToFormData } from '@/utils'
import { PostXhr } from '@/utils/baseRequest'

class UploadFile extends BaseUpload {
  constructor() {
    super()
    this.dict = {
      oss: 'https://api.169740.com/api/image.ali',
      sousou: 'https://api.uomg.com/api/image.sogou',
      baidu: 'https://api.169740.com/api/image.baidu',
      qihu: 'https://api.uomg.com/api/image.360',
      weibo: 'https://api.169740.com/api/image.sina',
      juejin: 'https://api.uomg.com/api/image.juejin',
      jd: 'https://api.169740.com/api/image.jd',
    }
    this.type = 'oss'
  }

  get url () {
    return this.dict[this.type]
  }

  changeType (type) {
    this.type = type
  }

  formParams () {
    let params = {
      file: 'multipart',
    }
    return params
  }

	/**
	 * 上传文件到oss
	 *
	 * @param {*} file
	 * @memberof UploadFile
	 */
  async send (file, onprogress) {
    const formParams = this.formParams(file)
    const formData = objToFormData(formParams)
    formData.append('Filedata', file)
    const p = onprogress instanceof Function ? onprogress : function () { }
    const res = await PostXhr.new(this.url).xhrSend(formData, p)
    return res
  }
}

export default UploadFile