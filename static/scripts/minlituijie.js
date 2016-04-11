$(document).ready(function() {
  var h = [],
    banner_h = $('.banner').height() + $('.intro-bg').height(),
    tools_h = window.screen.height - 230;
  nav_l = $('.nav').offset().left;
  // x = tools_h + 100;

  //导航栏选中高亮
  $(".nav a").click(function() {
    $(".nav a").removeClass("nav_curent");
    $(this).addClass("nav_curent")
  })

  //分享控件fix定位
  // $(".bdshare_popup_box").css({ 'position': 'fixed', 'top': x + 'px' })
  $(".bdshare_popup_box").css('color', 'red')



  // 滚动事件
  $(window).scroll(function() {
    if ($(window).scrollTop() > banner_h) {

      // 导航栏fix定位
      $('.nav').css({ 'position': 'fixed', 'top': '20px' })

      //工具栏fix定位
      $('.tools').css({ 'position': 'fixed', 'top': tools_h + 'px', 'right': '15px', 'display': 'block' })
      // console.log($('.tool').top())

      //导航栏滚动选中
      for (i = 0; i < $(".nav").children().length; i++) {
        h[i] = $(".major-content").eq(i).offset().top - $(window).scrollTop() - 80;
      }
      for (i = 0; i < 36; i++) {
        while (h[i] < 0) {
          var num = i;
          break;
        }
      }
      $(".nav a").removeClass("nav_curent");
      $(".nav a").eq(num).addClass("nav_curent");

      //导航栏滚动条控制
      if (num >= 0) {
        var height = $(".nav a").eq(num).position().top;
        if (height < 50) {
          $(".nav").scrollTop($(".nav").scrollTop() - 20);
        } else if (height > 550) {
          $(".nav").scrollTop($(".nav").scrollTop() + 20);
        }
      }
    } else {
      $('.nav').css({ 'position': '', 'top': '', 'left': '' })
      $('.tools').css({ 'position': '', 'top': '', 'right': '', 'display': 'none' })
    }
  });

  //跳转至人才招聘
  $(".major_icon").click(function() {
    var position = $(this).text()
    window.location.href = "http://hr.dreamhiway.com/jobs?su=" + position;
  });
});