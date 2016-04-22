$(function () {
  // 详情导航
  // 各个子项目距离文档顶部的距离
  var subPrjt = [];
  $(".subPrjt").each(function () {
    subPrjt.push($(this).offset().top - 50);
  });
  // 滚动后悬浮
  $(window).scroll(function () {
    var scroll_top = $(document).scrollTop();
    if (scroll_top > 500) {
      $(".zbxq_nav_bg").addClass("fixed");
    } else {
      $(".zbxq_nav_bg").removeClass("fixed");
    }
    // 根据滚动位置改变标签样式
    if (scroll_top < subPrjt[0]) {
      $(".zbxq_nav_item").removeClass("current")
        .eq(0).addClass("current");
    }
    for (var i = 0; i < subPrjt.length; i++) {
      if ((i == subPrjt.length - 1 && scroll_top > subPrjt[i]) || (scroll_top > subPrjt[i] && scroll_top < subPrjt[i + 1])) {
        $(".zbxq_nav_item").removeClass("current")
          .eq(i + 1).addClass("current");
      }
    }
  });
  // 点击
  $(".zbxq_nav_item").click(function () {
    $(".zbxq_nav_item").removeClass("current");
    $(this).addClass("current");
  });

  // 支持记录获取数据
  var para = {
    pageIndex: 1,
    pageSize: 10
  }
  $(".subPrjt").each(function () {
    var id = $(this).find(".container_cont_r").find("input").val();
    para.misid = id;
    var targetElemID = $(this).attr("id");
    var targetElem = "#" + targetElemID + " .container_cont_rlist";
    loadData("/Detail/TgrList", para, "zbRecord", targetElem);
  });

  // 圆形统计
  if (navigator.appVersion.indexOf('MSIE 8.0') < 0 && navigator.appVersion.indexOf('MSIE 9.0') < 0) {
    $('#myStat').circliful();
  }
});

// 收藏
// var pro_id = parseInt($(".project").attr("value"));
function collection() {
  if ($(".hd_cont_l_keep").hasClass("cancel")) {
    alert("已收藏")
    return false;
  }
  var para = {
    id: subjectID
  }
  $.post("/Detail/Collect", para).success(function () {
    var total = parseInt($(".hd_cont_l_keep").attr("data-collection"));
    total = total + 1;
    $(".hd_cont_l_keep span").text(total);
    var but = "已收藏" + "(" + '<span>' + total + '</span>' + ")";
    $(".hd_cont_l_keep").html(but);
    $(".hd_cont_l_keep").attr("data-collection", total);
    $(".hd_cont_l_keep").addClass("cancel");
  })
}

// 上传文件插件
var para = {};

var uploader = WebUploader.create({
  swf: '../Uploader.swf',
  server: 'http://192.168.2.10:82/uploadfj?key=zb',
  pick: '#picker',
  resize: false,
  auto: true
});
uploader.on('fileQueued', function (file) {
  $('.web_uploader').append('<div id="' + file.id + '" class="item">' +
    '<h4 class="info">' + file.name + '</h4>' +
    '<p class="state">等待上传...</p>' +
    '</div>');
});

uploader.on('uploadProgress', function (file, percentage) {
  var $li = $('#' + file.id),
    $percent = $li.find('.progress .progress-bar');

  // 避免重复创建
  if (!$percent.length) {
    $percent = $('<div class="progress progress-striped active">' +
      '<div class="progress-bar" role="progressbar" style="width: 0%">' +
      '</div>' +
      '</div>').appendTo($li).find('.progress-bar');
  }

  $li.find('p.state').text('上传中');

  $percent.css('width', percentage * 100 + '%');
});
uploader.on('uploadSuccess', function (file, res) {
  $('#' + file.id).find('p.state').text('已上传');
  para.attachment_orgin = file.name
  para.attachment = res._raw;
  console.log(para.attachment_orgin, para.attachment)
});

uploader.on('uploadError', function (file) {
  $('#' + file.id).find('p.state').text('上传出错');
});

uploader.on('uploadComplete', function (file) {
  $('#' + file.id).find('.progress').fadeOut();
});



// 数据传输
// $('.container_but').click(function() {
//   var contact = $('.qqnumber').find('input').val();
//   var workCycle = $('.overtime').find('input').val();
//   var misid = $(this).parents('.subPrjt').attr('data-id');
//   var fpid = subjectID;
//   para.fpid = fpid;
//   para.misid = misid;
//   para.workCycle = workCycle;
//   para.contact = contact;
//   $.post('/Detail/Delivery', para).success(function (d) {
//      if (d.success) {
//        alert('接单成功，可到个人中心进行查看')
//      } else {
//        alert('因网络原因接单失败,请稍后重试');
//      }
//   })
// })


//弹出弹窗
// $('.btn_order').click(function () {
//   $('.toubiao_pupop').css("display", "block");
// });
// //关闭弹窗
// $('.close_toubiao_pupop').click(function () {
//   $('.toubiao_pupop').css("display", "none");
// })
//附件上传

//稿件提交
$('.toubiao_submit').click(function () {
  var project_id = project_id;
  var id = $(this).find('.container_cont_r').find('input').val();
  var phone = $('#toubiao_phone').val();
  var txt = $('textarea').val();
  var fujian = data.saveaddr;
  var fujian_name = res.name;
  var para = {
    fpid: project_id,
    misid: id,
    contact: phone,
    content: txt,
    attachment: fujian,
    attachmentname: fujian_name
  }
  $.post("/detail/zbadd", para).success(function (data) {
    if (data.success) {
      alert('接单成功，可到个人中心进行查看')
    } else {
      alert('因网络原因接单失败,请稍后重试');
    }
  })
});