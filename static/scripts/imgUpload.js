function bindImg(target_btn, isNormal) {
  var btn = target_btn[0]; // 上传按钮，转换成js原生对象
  var img_size = target_btn.attr("data-imgsize"); // 图片规格
  var target_img = isNormal? // 是普通上传按钮还是可一直动态生成的上传按钮
                    target_btn.attr("data-targetimg") : target_btn.parents(".browse-wrap").find(".browse-img"); // 目标img标签

  var uploader = new plupload.Uploader({ //实例化一个plupload上传对象
    browse_button : btn,
    url : dhw.imguploadurl + "?key=cpzc&t=" + img_size,
    init: {
      FileUploaded: function (up, file, info) {
        if (info.response != null) {
          var jsonstr = eval("(" + info.response + ")");
          // 不带主机地址的图片地址（未添加图片规格和后缀）
          var short_url = jsonstr.path + jsonstr.name + "_";
          //一个文件上传成功  
          addImage(short_url);
        }
      },
  
      Error: function (up, args) {
        //发生错误
        if (args.file) {
          alert('[error] File:' + args.file);
        } else {
          alert('[error]' + args);
        }
      }
    }
  });
  
  // 初始化
  uploader.init();
  
  // 绑定文件添加进队列事件
  uploader.bind('FilesAdded',function(uploader,files) {
    uploader.start(); //开始上传
  });
    
  // 把图片添加进页面
  function addImage(short_url) {
    // 如果图片有多个规格，取第一个规格
    img_size = (img_size.indexOf("_") > 0)? img_size.substring(0, img_size.indexOf("_")) : img_size;
    // 在图片地址上加上图片规格和后缀
    // short_url = short_url + img_size + ".jpg";
    // 带主机地址的图片地址
    var url = dhw.imgurl + short_url + img_size + ".jpg";
    
    if (target_btn.is(".edit-browse")) {  // 如果是回报设置里的上传按钮
      target_img.parents(".edit-img").removeClass("addition");
    }
    // 根据之前取得的标识符找到相应图片元素，显示图片，并把图片地址赋给这个元素
    $(target_img).show().attr("src", url)
                        .attr("ssrc", short_url);
  }
}
  