$(function () {
  // 模块的切换
  $(".Mtitle_items").click(function () {
    var indexs = $(this).index();
    $(".Mtitle_items").removeClass("Mtitle_items_current").eq(indexs).addClass("Mtitle_items_current");
    $(".show").hide().eq(indexs).show();
  })
  // 款式的选择
  $(".topDetail_r_style_span").click(function () {
    var list = $(this).parent();
    var index = $(this).index();
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
});
var quantity = parseInt($('.hd_cont_l_keep span').text());
if (quantity > 999) {
  $('.hd_cont_l_keep span').text('999+');
}
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