import $ from 'jquery'
import { qs } from '@/utils/index'
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

const changeImg = function () {
  setTimeout(() => {
    const imgs = qs('#id-bg-img .home-cover-img')
    imgs.forEach(img => {
      img.classList.toggle('none')
      img.classList.toggle('animate-in')
      img.src = ''
      setTimeout(() => {
        img.src = 'https://api.uomg.com/api/image.lofter?format=images'
      }, 300);
    })
    changeImg()
  }, 3000)
}

const main = function () {
  changeImg()
}

main()