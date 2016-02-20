$(function() {
  // 详情导航
  // 各个子项目距离文档顶部的距离
  var subPrjt = [];
  $(".subPrjt").each(function() {
    subPrjt.push($(this).offset().top - 50);
  });
  // 滚动后悬浮
  $(window).scroll(function() {
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
    for (var i=0; i<subPrjt.length; i++) {
      if ((i == subPrjt.length-1 && scroll_top > subPrjt[i]) || (scroll_top > subPrjt[i] && scroll_top < subPrjt[i+1])) {
        $(".zbxq_nav_item").removeClass("current")
                            .eq(i+1).addClass("current");
      }
    }
  });
  // 点击
  $(".zbxq_nav_item").click(function() {
    $(".zbxq_nav_item").removeClass("current");
    $(this).addClass("current");
  });
  
  // 支持记录获取数据
  var para = {
    pageIndex: 1,
    pageSize: 10
  }
  $(".subPrjt").each(function() {
    var id = $(this).find(".container_cont_r").find("input").val();
    para.misid = id;
    var targetElemID = $(this).attr("id");
    var targetElem = "#" + targetElemID + " .container_cont_r tbody";
    loadData("/Detail/TgrList", para, "zbRecord", targetElem);
  });
  
  // 圆形统计
  if (navigator.appVersion.indexOf('MSIE 8.0') < 0 && navigator.appVersion.indexOf('MSIE 9.0') < 0) {
    $('#myStat').circliful();
  }
});

// 收藏
var pro_id =  parseInt($(".project").attr("value"));    
function collection() {
  if ( $(".hd_cont_l_keep").hasClass("cancel")) {
    alert("已收藏")
    return false;
  }
  var para = {
    id: pro_id
  }
  $.post("/Detail/Collect", para).success(function() {
    var total = parseInt($(".hd_cont_l_keep").attr("data-collection"));
    total = total + 1;
    $(".hd_cont_l_keep span").text(total);
    var but = "已收藏" + "(" + '<span>' + total + '</span>' + ")";
    $(".hd_cont_l_keep").html(but);
    $(".hd_cont_l_keep").attr("data-collection", total);
    $(".hd_cont_l_keep").addClass("cancel");
  })
}