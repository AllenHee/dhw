$(function () {
  var para = {
    pageIndex: 1,
    pageSize: 10
  }
  
  // 设置列表右上角总页数
  function setTotalPages(data) {
    var total_pages = Math.ceil(data.result.total / 10);
    $(".page-s .total-pages").text(total_pages);
    $(".current-page").text("1");
  }
  // 设置列表右上角当前页数
  function setCurrentPage(data, page) {
    if (data.result.total != 0) {
      $(".current-page").text(page);
    } else {
      $(".current-page").text(0);
    }
    $(document).scrollTop(0);
  }
  
  // 传递参数的方法
  function setProperty(elem, children_elem, property, isJob) {
    // 传参
    elem.find(children_elem).click(function () {
      if ($(this).hasClass("more")) { // 排除“更多”按钮
        return false;
      }
      var value = $.trim($(this).text());
      // 判断是否是工作地点
      if (property === 'gzdd' || property === 'citycode' || property === 'city') {
        value = $(this).attr('data-citycode');
        property = 'citycode';
      }
      if (value == "不限" || value == "全国" || value == "默认") {
        value = "";
      }
      para[property] = value;
      if (isJob) {
        loadData("/jobs/list", para, "jobTemplate", ".pos-box", setTotalPages, false, setCurrentPage);
      } else {
        loadData("/Companys/List", para, "comTemplate", ".filter-result", setTotalPages, false, setCurrentPage);
      }
    });
    // “更多”下的选项
    elem.children("ul").find("li").click(function () {
      var value = $(this).text();
      var citycode = $(this).attr('data-citycode')
      elem.find("dd:last-child").prev().text(value).attr('data-citycode', citycode).trigger("click")
    });
  }
  xxx
  // 职位列表页
  (function () {
    if ($(".pos-box").length) {
      if ($.cookie('citycode')) {
        para.citycode = $.cookie('citycode');
        loadData("/jobs/list", para, "jobTemplate", ".pos-box", setTotalPages, false, setCurrentPage);
        if ($.cookie('cityname') !== '北京' && $.cookie('cityname') !== '上海' && $.cookie('cityname') !== '深圳' && $.cookie('cityname') !== '广州' && $.cookie('cityname') !== '杭州' && $.cookie('cityname') !== '成都' && $.cookie('cityname') !== '南京' && $.cookie('cityname') !== '武汉' && $.cookie('cityname') !== '大连' && $.cookie('cityname') !== '厦门' && $.cookie('cityname') !== '福州' && $.cookie('cityname') !== '泉州' && $.cookie('cityname') !== '天津') {
          $(".filter-box div").eq(0).find("dd:last-child").prev().text($.cookie('cityname')).trigger("click");
        }
        else {
          for (var i = 0, len = $('.has-more').find('dd').length; i < len; i++) {
            if ($.trim($('.has-more').find('dd').eq(i).text()) === $.cookie('cityname')) {
              $('.has-more').find('dd').removeClass('current').eq(i).addClass('current')
            }
          }
        }
      }
      var para_extra = {}
      // 搜索框字段
      para_extra.zwmc = su;
      if($.cookie("gzdd")){
        para.gzdd = $.cookie("gzdd");
      }
      // para_extra.zwmc = su;
      $.extend(para, para_extra);

      setProperty($(".filter-box div").eq(0), "dd", "gzdd", true)
      setProperty($(".filter-box div").eq(1), "dd", "gzjy", true)
      setProperty($(".filter-box div").eq(2), "dd", "xlyq", true)
      setProperty($(".filter-box div").eq(3), "dd", "gsgm", true)
      setProperty($(".filter-box div").eq(4), "dd", "hyly", true);

      setProperty($(".filter-box-s div").eq(0), "dd", "pxzd", true);
      setProperty($(".filter-box-s div").eq(1), "li", "yx", true);
      setProperty($(".filter-box-s div").eq(2), "li", "gzxz", true);

      loadData("/jobs/list", para, "jobTemplate", ".pos-box", setTotalPages, false, setCurrentPage);
    }
  })();
  // 公司列表页
  (function () {
    if ($(".filter-result").length) {
      var para_extra = {}
      para_extra.citycode = ''
      // 搜索框字段
      // para_extra.compay = su;
      $.extend(para, para_extra);

      setProperty($(".filter-box div").eq(0), "dd", "city")
      setProperty($(".filter-box div").eq(1), "dd", "scale")
      setProperty($(".filter-box div").eq(2), "dd", "trade")

      loadData("/Companys/List", para, "comTemplate", ".filter-result", setTotalPages, false, setCurrentPage);
    }
  })();
  
  
  // 职位列表页小筛选框翻页
  $(".page-s i").click(function () {
    var current_page = parseInt($.trim($(".page-s .current-page").text())),
      total_pages = parseInt($.trim($(".page-s .total-pages").text()));
    if ($(this).hasClass("prev")) {
      if (current_page <= 1) return false;
      $(".page-s .current-page").text(current_page - 1);
      para.pageIndex = current_page - 1;
      loadData("/jobs/list", para, "jobTemplate", ".pos-box", setTotalPages, false, setCurrentPage);
    } else {
      if (current_page == total_pages) return false;
      $(".page-s .current-page").text(current_page + 1);
      para.pageIndex = current_page + 1;
      loadData("/jobs/list", para, "jobTemplate", ".pos-box", setTotalPages, false, setCurrentPage);

    }
  });
});

