import axios from 'axios'
import './styles/index.scss'
import config from '@/config'
import { Notyf } from 'notyf'
import UploadFile from './script/upload'
import ImageControl from './script/imageControl'
import { qs, log, q, es, get } from '@/utils/index'

const notyf = new Notyf({ duration: 2000 })

const main = async function () {
  await ImageControl.new()
  const upload = new UploadFile()
  const input = q('#id-upload-btn input')
  input.addEventListener('change', async () => {
    log('change', input.files)
    const file = input.files[0]
    const res = await upload.send(file)
    const url = get(res, 'url', null)
    if (url == null) {
      notyf.error('上传失败，请更换图床或者重新上传')
    } else {
      notyf.success('成功')
    }
  })
  const typeBtn = q('#id-type-btn')
  typeBtn.addEventListener('click', () => {
    q('#id-drop').classList.toggle('none')
  })
  es(typeBtn, '.cy_btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const type = btn.getAttribute('urltype')
      upload.changeType(type)
    })
  })
}

main()