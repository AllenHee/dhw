//收藏,取消功能
function CysjSc() {
  if ($(".zbrw_t_r_atte").hasClass("cancel")) {
    alert("已收藏")
    return false;
  }
  var para = {
    fpid: cpid
  }
  $.post("/CysjPub/CysjSc", para).success(function() {
    var total = parseInt($(".zbrw_t_r_atte").attr("data-collection"));
    
    total = total + 1;
    console.log(total)
    if (total >= 1000) {
    total = total / 1000;
    total = Math.floor(total);
    total += "+";
    var but = "已收藏" + "(" + '<span>' + total + '</span>' + ")";
    $(".zbrw_t_r_atte").html(but);
    $(".zbrw_t_r_atte").attr("data-collection", total);
    $(".zbrw_t_r_atte").addClass("cancel");
    }else {
       var but = "已收藏" + "(" + '<span>' + total + '</span>' + ")";
    $(".zbrw_t_r_atte").html(but);
    $(".zbrw_t_r_atte").attr("data-collection", total);
    $(".zbrw_t_r_atte").addClass("cancel");
    }
  })
}
 function aa() {
      $("#yzm").attr('src', '/Detail/VerifyCode?_=' + (+new Date()));
 }
 $('#yzm').click(aa);
$(function () {
  // 地址选择
  var provUl = $('.provUl');
  var area = "";
  var data = {};
  $("#address").click(function () {
    $(".provUl").css("display", "block");
    $(".cityUl").css("display", "none");
    $("#address").val("");
    area = ""
  });
  
  $(".areaselect").click(function(event) {
    event.stopPropagation();
  });
  
  $("body").click(function() {
    $(".provUl, .cityUl, .countyUl").css("display", "none");
    area = "";
  });
  
  var prov = _areaselect_data.p;
  for (var i = 0; i < prov.length; i++) {
    var lis = $("<li>" + prov[i] + "</li>");
    $(".provUl").append(lis);
  };
  $(".provUl").on("click", "li", function () {
    $(".provUl").css("display", "none");
    $(".cityUl").css("display", "block");
    var prov = $.trim($(this).text());
    area += prov;
    var city = _areaselect_data.c[prov];
    var ulCont = "";
    for (var i = 0; i < city.length; i++) {
      var lis = "<li>" + city[i] + "</li>";
      ulCont += lis;
    }
    $(".cityUl").html(ulCont);
    $("#address").val(area);
  });

  $(".cityUl").on("click", "li", function () {

    var city = $.trim($(this).text());
    if (area == "北京市" || area == "天津市" || area == "上海市" || area == "重庆市") {
      area += "-";
      area += city;
      $(".provUl").css("display", "none");
      $(".cityUl").css("display", "none");
      $("#address").val(area);
      area = "";
    }
    else {
      $(".cityUl").css("display", "none");
      // $(".countyUl").css("display", "block")
      area += "-";
      area += city;
      // var county = _areaselect_data.a[area];
      // var ulcont = "";
      // for (var i = 0; i < county.length; i++) {
      //   var lis = "<li>" + county[i] + "</li>";
      //   ulcont += lis;
      // }
      // $(".countyUl").html(ulcont);
      $("#address").val(area);
      area = "";
    }
  });
  // $(".countyUl").on("click", "li", function () {
  //   var county = $.trim($(this).text());
  //   area += "-";
  //   area += county;
  //   $(".provUl").css("display", "none");
  //   $(".cityUl").css("display", "none");
  //   $(".countyUl").css("display", "none");
  //   $("#address").val(area);
  //   area = "";
  // })
  
  
  $('input, textarea').placeholder();

  //模块切换 
  $(".zbrw_t_l_sjfp i").mouseenter(function () {
    $(".pos_tip").show();
  }).mouseleave(function () {
    $(".pos_tip").hide();
  })
  $(".cytg_ttl li").click(function () {
    var indexs = $(this).index();
    $(".cytg_ttl li").removeClass("current").eq(indexs).addClass("current");
    $(".cytg_cont").addClass("hidden").eq(indexs).removeClass("hidden");
  });
   
  //附件上传
     var uploader = WebUploader.create({
            auto: true,
            swf: '//cdn.dreamhiway.com/static/lib/Uploader.swf',
            server: dhw.fileuploadurl + '?key=diy',
            pick :'#picker',
            resize: false
       });
       uploader.on('fileQueued', function (file) {
          $('#fileUp').find('.uploader-list').html('<div id="' + file.id + '" class="item">' +
          '<h4 class="info">' + file.name + '</h4>' +
          '<p class="state">等待上传...</p>' +
          '</div>');
      });
      uploader.on('uploadProgress', function (file, percentage) {
        var $li = $('#fileUp').find('#' + file.id),
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
        $('#fileUp').find('#' + file.id).find('p.state').text('已上传');
        data.saveaddr = res.path + res.name
      });

      uploader.on('uploadError', function (file) {
        $('#fileUp').find('#' + file.id).find('p.state').text('上传出错');
      });

      uploader.on('uploadComplete', function (file) {
        $('#fileUp').find('#' + file.id).find('.progress').fadeOut();
      });
   //数据上传 
   
   $.validator.addMethod('isprice', function(value) {
     var price = /^[1-9]{1}\d*$/;
     return price.test(value);     
  },"请输入正确报价,雇佣预期价格为￥500-1000");
  
  $.validator.addMethod('iscycle', function(value) {
     var cycle = /^[1-9]{1}\d*$/;
     return cycle.test(value);     
  },"请输入天数, 如: 3 ");
  
  $('#toubiao').validate({
    // debug : true,
    rules : {
      price : "isprice",
      cycle : "iscycle",
      address : {
        required : true,
      },
      intro : {
        required : true,
      },
    },
    messages : {
      address: {
        required: "地区不能为空",
      },
      intro : {
        required : "请输入报价说明"
      }
    },
    submitHandler : function() {
        data.cpid = cpid;
        data.quote = $('#price').val();
        data.worktime = $('#cycle').val();
        data.address = $('#address').val();
        data.intro = $('#intro').val();
        data.verify = $('#yzm_input').val();
        $.post('/Detail/AddTb',data).success(function(d) {
        if(d.success) {
          alert('提交成功');
         // location.reload();
        }else {
          alert(d.msg);
          aa();
        }
        })
    }
  })
   
  // 数据交互
  var para = {
    cpid: cpid,
    pageIndex: 1,
    pageSize: 5
  }
  loadData("/Detail/ListLy", para, "commentTpl", ".commentCont", function(data) {
    var total = data.result.total;
    $('.commentCount').text(total);
  }, '.pagination_comment');

  loadData("/Detail/ListTg", para, "cytg", "#cytg_cont", function(data) {
    var total = data.result.total;
    $('.tgCount').text(total);
  }, '.pagination_tg');

  $(".fbly_btn").click(function () {
    var cont = $(".fbly_ta").val();
    if (cont == "") {
      $(".errorTip").css("display", "block");
      return false;
    }
    else {
      $.post("/Detail/AddLyfb", {
        cpid: cpid,
        commemt: cont
      }).success(function (d) {
        if(d.success) {
        $(".errorTip").css("display", "none");
        loadData("/Detail/ListLy", para, "commentTpl", ".commentCont", false);
        }else {
          alert(d.msg)
        }
      })
    }
  });
  
  
  
  
});

