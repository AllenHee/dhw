$(function () {
  // 分类栏图标反转效果
  $(".zc-category-list").on("mouseenter", 'a', function () {
    $(this).addClass('active');
  });
  $(".zc-category-list").on("mouseleave", 'a', function () {
    $(this).removeClass('active');
  });
  $(".zc-category-list").on("click", 'a', function () {
    $(".zc-category-list a").removeClass('current');
    $(this).addClass('current');
  });

  
  // 分类栏弹出菜单
  $(".pop>a").click(function (e) {
    e.stopPropagation();
    $(this).next().slideToggle();
    return false;
  });
  $("body").click(function () {
    $(".zc-category").find(".pop ul").hide();
  });
  $(".pop ul a").click(function () {
    $(this).parents("ul").prev().find("span").text($(this).text());
    $(this).parents("ul").hide();
  });
  
  // 瀑布流悬停效果
  $(".fall-box").on("mouseenter", "li", function () {
    $(this).find(".support").show()
      .end().find(".edit").show();
  });
  $(".fall-box").on("mouseleave", "li", function () {
    $(this).find(".support").hide()
      .end().find(".edit").hide();
  });
  
  
  // 数据交互
  var paydata = {};
  
  var total;  // 总条数
  var loaded = 0; // 已加载的条数
  var maxPages = 6;  // 允许滚动加载的最大次数
  var loadedPages = 1;  // 已加载的次数
  var hasAjax = false;  // 当前有无ajax请求
  // 下拉加载
  $(window).scroll(function () {
    var viewHeight = $(window).height();  // 窗口高度
    var docHeight = $(document).height(); // 文档高度
    var docStrollTop = $(document).scrollTop(); // 文档往上滚的高度
    if (docHeight - docStrollTop < viewHeight + 300 && !hasAjax && loadedPages < maxPages && loaded < total) {
      loadData(loadedPages, true);
      hasAjax = true; // 当前页面有ajax请求
    }
  });
  // 更多按钮加载
  $(".fall-more a").click(function () {
    if (loaded < total) {
      loadData(loadedPages, true);
    }
    return false;
  });
  // 类型加载
  function selectType() {
    var zc_type = $(this).attr("data-type");
    paydata.type = parseInt(zc_type);
    loaded = 0;
    loadedPages = 1;
    
    $('.zc-category-list li').each(function() {
      $(this).find('a').removeClass('current');
      var type = $(this).attr('data-type');
      if (type == paydata.type) {
        $(this).find('a').addClass('current');
      }
    });
    
    loadData(1, false);
    $('#su').val('');
    return false;
  }
  $('.fall-box-wrap').on('click', '.zctypeselect', selectType)
  $(".zc-category-list").on("click", "li", selectType);
  // 状态加载
  $(".zc-state-menu a").click(function () {
    var zc_state = $(this).attr("data-zc-state");
    paydata.state = parseInt(zc_state);
    if (paydata.stcookie00) {
      paydata.state = "";
    }
    loaded = 0;
    loadedPages = 1;
    loadData(1, false);
    $('#su').val('');
    return false;
  });
  // 排序加载
  $(".zc-sort-menu a").click(function () {
    var zc_sort = $(this).attr('data-zc-sort')
    paydata.sort = zc_sort;
    loaded = 0;
    loadedPages = 1;
    loadData(1, false);
    $('#su').val('');
    return false;
  });
  // 首页搜索加载
  window.searchNoRedirect = function() { // 首页搜索
    paydata.keyword = $('#su').val();
    loadData(1, false, function() {
      paydata.keyword = '';
    });
  }
  
  // 加载数据的函数
  function loadData(page, isAdd, fn) {
    $.post("/Index/List", $.extend(paydata, { pageIndex: page, pageSize: 8 }), function (d) {
      total = d.result.total; // 更新总条数
      loaded += d.result.data.length; // 更新已经加载的条数
      
      var isLogined = d.result.praise;
      
      var items = d.result.data;
      $(window).scroll(function() {
        return false;
      })
      // 如果不是加载更多，先清空原内容
      if (!isAdd) {
        var fall_boxes = $(".fall-box");
        for (var i = 0; i < fall_boxes.length; i++) {
          fall_boxes[i].innerHTML = "";
        }
      }
      // 如果没有数据，显示相关提示并退出方法
      if (items.length == 0) {
        $('.fall-more a').hide();
        $('.noContent').show();
        return false;
      } else {
        $('.fall-more a').show();
        $('.noContent').hide();
      }
      // 如果数据已经加载完了，隐藏加载更多按钮
      if (loaded == total) {
        $('.fall-more a').hide();
      } else {
        $('.fall-more a').show();
      }
      
      for (var j = 0; j < items.length; j++) {
        items[j].domain = dhw.imgurl;
        var html = template("fallbox", items[j]);
        
        switch ((j + 1) % 4) {
          case 1:
            $(".fall-box-1").append(html);
            break;
          case 2:
            $(".fall-box-2").append(html);
            break;
          case 3:
            $(".fall-box-3").append(html);
            break;
          case 0:
            $(".fall-box-4").append(html);
            break;
        }
      }
      loadedPages++;  // 更新已经加载的页面
      hasAjax = false;  // 当前页面无ajax请求
      $('.support').each(function() {
        var id = $(this).attr('data-id');
        var cookies = "data-" + id;
        if($.cookie(cookies) == "true" || isLogined == 1) {
          $(this).find("i").addClass("lauded");
        }
        
        var total = parseInt($(this).attr("data-like"));
        var round = total;
        if(round >= 10000) {
          round = round/10000;
          round = Math.floor(round);
          round += "万";
          $(this).find("span").text(round);
        }
        $(this).find("span").text(round);
        
      })
      
      if (fn) {
        fn();
      }
    });
  }
  // 首次加载数据
  if ( $.cookie('zchou_keyword') ) {
    $('#su').val($.cookie('zchou_keyword'));
    paydata.keyword = $.cookie('zchou_keyword');
    $.removeCookie('zchou_keyword');
    loadData(1, false, function() {
      paydata.keyword = '';
    });
  } else if ( $.cookie('zchou_type') ) {
    paydata.type = $.cookie('zchou_type');
    $.removeCookie('zchou_type');
    
    $('.zc-category-list li').each(function() {
      $(this).find('a').removeClass('current');
      var type = $(this).attr('data-type');
      if (type == paydata.type) {
        $(this).find('a').addClass('current');
      }
    });
    
    loadData(1, false);
  } else {
    loadData(1, false);
  }
  
 
  
  // 众筹首页点赞
  $(".fall-box").on("click", ".support", function() {
    var that = $(this);
    var s = that.parents(".fall-box-item").find(".oneMore")
    var ftid = $(this).attr("data-id");
    var cookies = "data-" + ftid;
    var praise = $(".support").attr("data-praise");
    if ($.cookie(cookies) != "true") {
      var para = {
        id: ftid
      }
      $.post("/cpzcDetail/Laud", para).success(function() {
        s.css("display", "block").animate({
          "top": "20px",
          "right": "25px",
          "opacity": 0,
          "font-size": "12px"
        },1000, function() {
          s.css("display", "none");
        });
        var total =parseInt(that.attr("data-like"));
        total = total + 1;
        var round = total;
        if(round >= 10000) {
          round = round/10000;
          round = Math.floor(round);
          round += "万";
        }
        that.find("span").text(round);
        that.attr("data-like", total);
        that.find("i").addClass("lauded")
        $.cookie(cookies, "true")
      });
    } 
    if($.cookie(cookies) == "true" || praise == 1) {
      alert("已点赞");
      return false;
    }
    // 解析cookie的属性值
      // var cookie = {};
      // var all = document.cookie;
      // var list = all.split(";");
      // for (var i=0; i<list.length; i++) {
      //   cookie = list[i];
      //   var p = cookie.indexOf("=");
      //   var cookie_name = cookie.substring(0,p);
      //   var value = cookie.substring(p+1);
      //   value = decodeURIComponent(value);
      //   cookie[cookie_name] = value;
      // }
  });
  
});

