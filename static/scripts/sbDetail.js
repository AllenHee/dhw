$('.sbcs_contl_sort-add').click(function() {
  $(this).next().slideToggle(400)
  if ($(this).hasClass('moreType')) {
    $(this).text('+').removeClass('moreType');
  } else {
    $(this).text('-').addClass('moreType');
  }
})

$(".shoucang").click(function() {
  if ($(".shoucang").hasClass("cancel")) {
    alert("已收藏");
    return false;
  }
  else {
    var num = parseInt($(".shoucang").attr("data-shoucang"));
    var para = {
      ttid: id
    }
    $.post('/Trademark/CollectAdd', para).success(function() {
      num = num + 1;
      var count = num;
      if (count >= 10000) {
        count = count / 10000;
        count = Math.floor(count);
        count = count + "万";
      }
      $(".shoucang").text(num);
      var txt = "已收藏" + '(<span>' + num + '</span>)';
      $(".shoucang").html(txt);
      $(".shoucang").attr("data-shoucang", num);
      $(".shoucang").addClass("cancel");
    })
  }
})

//显示弹出层
function report() {
  if ($(".jubao").text() === "已举报") {
    alert("已举报")
  } else {
    $(".modal_bg").fadeIn();
    $(".modal_cont").fadeIn();
  }
}
//关闭弹出层
function close() {
  $(".modal_bg").fadeOut();
  $(".modal_cont").fadeOut();
}
$(".modal_cont_t_close").click(function() {
  close();
});


//举报
$(".modal_cont_button_conf").click(function() {
  var t_reason = $("#reason").val();
  var t_detail = $("#detail").val();
  var para = {
    ttid: id,
    text: t_reason + ":" + t_detail
  };

  $.post("/Trademark/ReportAdd", para).success(function(d) {
    if (d.success) {
      $(".jubao").html("已举报");
    }
    $(".modal_bg").fadeOut();
    $(".modal_cont").fadeOut();
  });
});