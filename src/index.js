import $ from 'jquery'
import { qs, log } from '@/utils/index'
import axios from 'axios'
import './styles/index.scss'

console.log('hahah2')
// var url = 'https://api.uomg.com/api/image.ali'
var url = 'https://api.169740.com/api/image.ali'
function file_upload (files) {
  if (files.length == 0) return alert('请选择图片文件！')
  for (var j = 0, len = files.length; j < len; j++) {
    console.log('文件上传流', files[j])
    let imageData = new FormData()
    imageData.append('file', 'multipart')
    imageData.append('Filedata', files[j])
    $.ajax({
      url: url,
      type: 'POST',
      data: imageData,
      cache: false,
      contentType: false,
      processData: false,
      dataType: 'json',
      // 图片上传成功
      success: function (result) {
        if (result.code == 1) {
          $('.preview').append(
            '<div><img src="' +
            result.imgurl +
            '" ><code class="title1">' +
            result.imgurl +
            '</code></div>'
          )
        } else {
          layer.open({
            title: '错误',
            content: '第' + j + '个图片上传失败',
          })
        }
      },
      // 图片上传失败
      error: function () {
        console.log('图片上传失败')
      },
    })
  }
}

const getImage = async function () {
  const result = await axios.get('http://localhost:6388/img', { params: { count: '10' } })
  log('haha0', result)
}

const main = function () {
  getImage()
}

main()