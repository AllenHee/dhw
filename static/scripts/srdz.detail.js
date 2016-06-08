$(function () {
  // 模块的切换
  $(".Mtitle_items").click(function () {
    var indexs = $(this).index();
    $(".Mtitle_items").removeClass("Mtitle_items_current").eq(indexs).addClass("Mtitle_items_current");
    $(".show").hide().eq(indexs).show();
  })
  $('.topDetail_r_style_l')
  // 款式的选择
  var sku = {
    
  };
  var text;
  var skuname;  
  $(".topDetail_r_style_span").click(function () {
    var list = $(this).parent();
    var index = $(this).index();
    skuname = $(this).parents('.topDetail_r_style').find('.topDetail_r_style_l').attr('data-name');
    text = $(this).text();
    sku[skuname] = text;
    list.find(".topDetail_r_style_span").removeClass("active").eq(index).addClass("active");
  })
  // 显示和隐藏详细信息
  // $(".more_btn").click(function() {
  //   $(".topDetail_r_intro").removeClass("max-height").css("height" , "auto");
  //   $(".more_btn").css("display","none");
  //   $(".less_btn").css("display" , "block");
  // })
  // $(".less_btn").click(function() {
  //   $(".topDetail_r_intro").addClass("max-height");
  //   $(this).hide();
  //   $(".more_btn").css("display","block");
  // });
  // 图片地址
  $(".topDetail_c_pic_items_img").click(function () {
    var origi_src = $(this).attr("src");
    var index = origi_src.indexOf("_");
    var bef_src = origi_src.substring(0, index);
    var last_src = bef_src + "_330x310.png"
    $(".topDetail_c_img").attr("src", last_src);
  });
  // 数量增减
  
  $(".topDetail_r_qua span").click(function () {
    var num = $(".topDetail_r_qua_input");
    var total = parseInt($(".topDetail_r_qua_total").attr("data-kc"));
    if ($(this).hasClass("minus")) {
      if (num.val() > 1) {
        num.val(num.val() - 1);
      }
    } else if ($(this).hasClass("plus")) {
      if (num.val() < total)
        num.val(parseInt(num.val()) + 1);
    }
  });
  var para = {
    fpid: fpid,
    pageIndex: 1,
    pageSize: 5
  }
  loadData("/Detail/Pjxx", para, "yhpjid", ".yhpj_wrap", function (data) {
    for (var j = 0; j < data.result.data.length; j++) {
      data.result.data[j].rankArr = [];
      for (var i = 0; i < data.result.data[j].rank; i++) {
        data.result.data[j].rankArr.push("");
      }
    }

    var total = data.result.total;
    $(".commentTotal").text(total);
  }, '.pagination-pj');

  loadData("/Detail/Cjjl", para, "cjjlid", ".cjjl_tbody", function (data) {
    var total = data.result.total;
    $(".recordTotal").text(total);
  }, '.pagination-jl');
  
  // 立即定制事件
  $('.topDetail_r_btn').click(function () {
      
      // 判断是否已经登录
      var mainurl = dhw.mainurl;
      var localurl = encodeURIComponent(window.location.href);
      var url = mainurl + "login?redirectURL=" + localurl;
      if (!$.cookie("accountType")) {
          location.href = url;
      }
      var text = $('.active').text();
      var jsonbody = JSON.stringify(sku);
      var count = parseInt($('.topDetail_r_qua_input').val());
      var para = {
      productid: fpid,
      // count: count,
      body: text
    }
    if (text === '' && $('.topDetail_r_style_span').length > 0) {
      alert('请选择类型');
      return false;
    }
    $.post('/ShoppingCart/ShoppingCartAdd', para).success(function (d)
    {
      if (d.success) {
        var id = d.result;
        window.location.href = '/pay1/' + id;
      } else {
        alert('您需要先登录')
      }
    })
    });
  
  
});
var quantity = parseInt($('.hd_cont_l_keep span').text());
if (quantity > 999) {
  $('.hd_cont_l_keep span').text('999+');
}
// 关注
function atten() {
  var attention = parseInt($('.hd_cont_l_keep').attr('data-attention'))
  var para = {
    id: fpid
  }
  if($('.hd_cont_l_keep').hasClass('cancel')) {
    return;
  }
  $.post('/Detail/AttentionAdd', para).success(function () {
    attention = attention + 1;
    $('.hd_cont_l_keep span').text(attention);
    var but = "已关注" + "(" + '<span>' + attention + '</span>' + ")";
    $(".hd_cont_l_keep").html(but);
    $(".hd_cont_l_keep").attr("data-attention", attention);
    $('.hd_cont_l_keep').addClass('cancel')
    var quantity = parseInt($('.hd_cont_l_keep span').text());
    if (quantity > 999) {
      $('.hd_cont_l_keep span').text('999+');
    }
  })

}