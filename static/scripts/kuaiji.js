$(function () {
  //  设置顶部滑动块的相关宽度值
  function prepareSlide() {
    var body_width = $("body").width();
    var items_count = $(".slide-wrap").find("li").length;
    $(".slide-wrap").css({
      "width": body_width * items_count + "px",
      "left": "0px"
    });
    $(".slide-wrap a").css("width", body_width + "px");
  }
  // 开始滑动
  prepareSlide();
  $(".slide-wrap").slide(true, true);
  
  // 我的服务弹出菜单
  $(".header-nav .last").mouseenter(function () {
    $(this).css({
      "background-color": "#667085",
      "color": "#fff"
    }).find(".last-pop").show();
  }).mouseleave(function () {
    $(this).css({
      "background-color": "transparent",
      "color": "#f95f00"
    }).find(".last-pop").hide();
  });
  
  // 帖子图片
  $(".post").on('mouseenter', "li", function() {
    if ($(".post-pic a").is(":animated")) {
      return false;
    }
    var index = $(this).index();
    $(".post-pic a").hide()
      .eq(index).fadeIn("fast");
  });

  $.ajax({
    url: 'http://bbs.dreamhiway.com/getposts.php',
    dataType: "jsonp",
    jsonp: "callback",
    success: function (data) {
      var posts = data;
      var images = [];

      for (var i = 0, len = posts.length; i < len; i++) {
        var message = posts[i].message;
        var textEnd = message.indexOf('\n');
        var urlstart = message.indexOf('http');
        var urlend = message.indexOf('[/img]');

        var text = message.slice(0, textEnd);
        var img = message.slice(urlstart, urlend);

        posts[i].message = text;

        images.push({
          tid: posts[i].tid,
          url: img
        });
      }
      
      var post = template('posts', {posts: posts});
      var img = template('images', {images: images})
      $('.post').html(post);
      $('.post-pic').html(img)
    }
  });

});