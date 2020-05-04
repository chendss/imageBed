import axios from 'axios'
import './styles/index.scss'
import config from '@/config'
import { Notyf } from 'notyf'
import UploadFile from './script/upload'
import ImageControl from './script/imageControl'
import { qs, log, q, es, get } from '@/utils/index'
import MicroModal from 'micromodal'

const notyf = new Notyf({ duration: 2000 })

const imgClick = function (id) {
  MicroModal.show(id)
  log('按摩', id)
}

const insertImg = function (url, file) {
  const resultBox = q('#id-upload-result')
  const id = get(file, 'lastModified', '')
  resultBox.insertAdjacentHTML('beforeend', `
    <div class="img-result-item" >
      <img src="${url}" onclick="imgClick(${id})" id="${id}">
      <p>${url}  <strong>${get(file, 'name', '')}</strong></p>
    </div>
  `)
}

const inputEvent = function (upload) {
  const input = q('#id-upload-btn input')
  input.addEventListener('change', async () => {
    log('change', input.files)
    const uploadBtn = q('#id-upload-btn')
    uploadBtn.setAttribute('d', 'true')
    const file = input.files[0]
    const res = await upload.send(file)
    const url = get(res, ['url', 'imgurl'], null)
    if (url == null) {
      notyf.error('上传失败，请更换图床或者重新上传')
    } else {
      insertImg(url, file)
      notyf.success('成功')
    }
    uploadBtn.setAttribute('d', '')
  })
}

const main = async function () {
  window.imgClick = imgClick
  await ImageControl.new()
  const upload = new UploadFile()
  inputEvent(upload)
  const typeBtn = q('#id-type-btn')
  typeBtn.addEventListener('click', () => {
    q('#id-drop').classList.toggle('none')
  })
  es(typeBtn, '.cy_btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const input = q('#id-upload-btn input')
      const type = btn.getAttribute('urltype')
      upload.changeType(type)
      input.outerHTML = '<input type="file" id="id-input-upload"></input>'
      inputEvent(upload)
    })
  })
}

main()