$(function() {
  // 基地图片循环滚动
  var wrapper = $(".main_picture_wrap");
  var ul = $(".main_picture");
  ul.html(ul.html());
  function scroll() {
    wrapper.scrollLeft(wrapper.scrollLeft()+1);
    if (wrapper.scrollLeft() == (ul.width()/2)) {
      wrapper.scrollLeft(0);
    }
  }
  var marquee = setInterval(scroll, 20);
  wrapper.mouseenter(function() {
    clearInterval(marquee);
  }).mouseleave(function() {
    marquee = setInterval(scroll, 20);
  });
  
  // 左侧点击切换右侧
  $(".sidebar_menu_item").click(function() {
    $(".sidebar_menu_item").removeClass("current");
    $(this).addClass("current");
    var index = $(this).parent().index();
    $(".main_box").removeClass("current")
                  .eq(index).addClass("current");
  })
});

// 何伟
$(".main_ttl_items").click(function() {
  var indexs = $(this).index();
  $(".main_ttl_items").removeClass("main_ttl_items-current").eq(indexs).addClass("main_ttl_items-current");
  $(".main_cont").removeClass("hidden").eq(indexs-1).addClass("hidden");
});