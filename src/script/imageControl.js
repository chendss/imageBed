import axios from 'axios'
import { uniq, shuffle } from 'lodash'
import { get, q, es, e } from '@/utils'

class ImageControl {
  constructor() {
    this.time = 6 * 1000
    this.imgList = []
    this.index = 0
    this.status = true
    this.num = '50'
  }

  static async new () {
    const obj = new this()
    await obj.getImage()
    obj.render()
    return obj
  }

  async getImage () {
    const res = await axios.get('/img', { params: { count: this.num } })
    const data = uniq(get(res, 'data', []))
    const bg = q('#id-bg-img')
    this.imgList = shuffle(data)
    const htmlList = data.map(url => {
      const html = `
        <div class="home-cover-img empty">
          <img
            sizes="cover"
            src="${url}"
          />
        </div>
      `
      return html
    })
    bg.insertAdjacentHTML('beforeend', htmlList.join('\n'))
  }

  render () {
    setTimeout(() => {
      const bg = q('#id-bg-img')
      const imgBoxs = es(bg, '.home-cover-img')
      if (this.status === true) {
        let nextIndex = (this.index + 1) % imgBoxs.length
        const thatImgBox = imgBoxs[this.index]
        const nextImgBox = imgBoxs[nextIndex]
        nextImgBox.classList.add('animate-in')
        setTimeout(() => {
          thatImgBox.classList.remove('animate-in')
        }, 2000)
      }
      this.index = (this.index + 1) % imgBoxs.length
      this.render()
    }, this.time)
  }

}

export default ImageControl