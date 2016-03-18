$(function() {
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
  $(".header-nav .last").mouseenter(function() {
    $(this).css({
      "background-color": "#667085",
      "color": "#fff"
    }).find(".last-pop").show();
  }).mouseleave(function() {
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
    success: function(data) {
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

      var post = template('posts', { posts: posts });
      var img = template('images', { images: images })
      $('.post').html(post);
      $('.post-pic').html(img)
    }
  });
  //  //限制字符个数
  //  $(".textOver").each(function(){
  //       var maxwidth=20;
  //       if($(this).text().length>maxwidth){
  //           $(this).text($(this).text().substring(0,maxwidth));
  //           $(this).html($(this).html()+'...');
  //       }
  //   });

  // 热门会计列表筛选
  $('.kj_filter_box div dd').click(function() {
    if ($(this).hasClass('more')) {
      return false;
    } else {
      $(this).siblings().css(
        {
          'background-color': '#fff',
          'color': '#333'
        }
      ).end().css({
        'background-color': '#ff6501',
        'color': '#fff'
      })
    }
  })


  $('.kj_filter_box .has-more .more').mouseenter(function() {
    $(this).parent().next().show();
  }).parents('.has-more').mouseleave(function() {
    $(this).find('ul').hide();
  }).find('li').click(function() {
    $(this).parent().hide();
  })
});



var para = {
  pageIndex: 1,
  pageSize: 10,
  keyword: "",
  city_code: ""
}
function search() {
  var searchValue = $("#searchValue").val();
  para.keyword = searchValue;
  loadData("/Accounting/List", para, "financeList", ".rcmd");
}

$(function() {
  var keynameValue = $.cookie('keyname');
  if (keynameValue) {
    para.keyword = keynameValue;
  }
  //搜索
  function setCommon(elem, children_elem, property) {
    elem.find(children_elem).click(function() {
      if ($(this).hasClass("more")) {
        return false;
      }
      var value;
      // 判断是否是所在地点
      if (property === 'szdd' || property === 'city_code') {
        value = $(this).attr('data-citycode');
        property = 'city_code';
      } else {
        value = $.trim($(this).text());
      }
      if (value == "全国" || value == "全部") {
        value = '';
      }
      para[property] = value;
      loadData("/Accounting/List", para, "financeList", ".rcmd");
      console.log(para);
    })
    // “更多”下的选项
    elem.children("ul").find("li").click(function() {
      var value = $(this).text();
      var citycode = $(this).attr('data-citycode')
      elem.find("dd:last-child").prev().text(value).attr('data-citycode', citycode).trigger("click");
      console.log(para);
    });
  }

  var searchkey = decodeURIComponent(location.search).split('=')[1];
  if (searchkey) {
    para.keyword = searchkey
  }

  setCommon($('.kj_filter_box div').eq(0), 'dd', 'szdd');
  setCommon($('.kj_filter_box div').eq(1), 'dd', 'keyword');
  loadData("/Accounting/List", para, "financeList", ".rcmd");

  $(".rcmd").on("click", ".tags li", function() {
    var tagsli = $(this).text();
    para.keyword = tagsli;
    loadData("/Accounting/List", para, "financeList", ".rcmd");
  });

});
