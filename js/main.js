function file_upload(files) {
  if (files.length == 0) return alert('请选择图片文件！')
  for (var j = 0, len = files.length; j < len; j++) {
    console.log('文件上传流',files[j])
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
      success: function(result) {
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
      error: function() {
        console.log('图片上传失败')
      },
    })
  }
}