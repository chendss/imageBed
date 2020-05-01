import $ from 'jquery'
import './styles/index.scss'

console.log('hahah2')
// var url = 'https://api.uomg.com/api/image.ali'
var url = 'https://api.169740.com/api/image.ali'
$(document).ready(function () {
  $("input[type='file']").change(function (e) {
    file_upload(this.files)
  })
  var obj = $('body')
  obj.on('dragenter', function (e) {
    e.stopPropagation()
    e.preventDefault()
  })
  obj.on('dragover', function (e) {
    e.stopPropagation()
    e.preventDefault()
  })
  obj.on('drop', function (e) {
    e.preventDefault()
    file_upload(e.originalEvent.dataTransfer.files)
  })
})
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
function url_upload () {
  var urls = $('#urls').val()
  if (urls == false) return alert('请输入图片链接！')
  var UrlArr = urls.split('\n')
  $('#url_upload_model').modal('hide')
  for (var j = 0, len = UrlArr.length; j < len; j++) {
    console.log(UrlArr[j])
    $.getJSON(url, { imgurl: UrlArr[j] }, function (result, textStatus) {
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
      console.log(result)
    })
  }
  console.log('test')
}