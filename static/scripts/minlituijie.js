$(document).ready(function() {
  var h = [],
    nav_h = $('.banner').height() + $('.intro-bg').height(),
    l = $('.nav').offset().left;

  //导航栏选中高亮
  $(".nav a").click(function() {
    $(".nav a").removeClass("nav_curent");
    $(this).addClass("nav_curent")
  })

  // 滚动事件
  $(window).scroll(function() {
    if ($(window).scrollTop() > nav_h) {

      // 导航栏fix定位
      $('.nav').css({ 'position': 'fixed', 'top': '20px', 'left': 'l' })

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
    }

  });

  //跳转至人才招聘
  $(".major_icon").click(function() {
    var position = $(this).text()
    window.location.href = "http://hr.dreamhiway.com/jobs?su=" + position;

  });
});