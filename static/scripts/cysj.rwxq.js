function CysjSc() {
  if ($(".zbrw_t_r_atte").hasClass("cancel")) {
    alert("已收藏")
    return false;
  }
  var para = {
    fpid: cpid
  }
  $.post("/CysjPub/CysjSc", para).success(function() {
    var total = parseInt($(".zbrw_t_r_atte").attr("data-collection"));
    total = total + 1;
    if (total >= 1000) {
    total = total / 1000;
    total = Math.floor(total);
    total += "+";
    var but = "已收藏" + "(" + '<span>' + total + '</span>' + ")";
    $(".zbrw_t_r_atte").html(but);
    $(".zbrw_t_r_atte").attr("data-collection", total);
    $(".zbrw_t_r_atte").addClass("cancel");
    }
  })
}
$(function () {
  
  // 地址选择
  var provUl = $('.provUl');
  var area = "";

  $("#address").click(function () {
    $(".provUl").css("display", "block");
    $("#address").val("");
  });
  $(".areaselect").click(function(event) {
    event.stopPropagation();
  });
  $("body").click(function() {
    $(".provUl, .cityUl, .countyUl").css("display", "none");
    area = "";
  });
  var prov = _areaselect_data.p;
  for (var i = 0; i < prov.length; i++) {
    var lis = $("<li>" + prov[i] + "</li>");
    $(".provUl").append(lis);
  };

  $(".provUl").on("click", "li", function () {
    $(".provUl").css("display", "none");
    $(".cityUl").css("display", "block");
    var prov = $.trim($(this).text());
    area += prov;
    var city = _areaselect_data.c[prov];
    var ulCont = "";
    for (var i = 0; i < city.length; i++) {
      var lis = "<li>" + city[i] + "</li>";
      ulCont += lis;
    }
    $(".cityUl").html(ulCont);
    $("#address").val(area);
  });

  $(".cityUl").on("click", "li", function () {

    var city = $.trim($(this).text());
    if (area == "北京市" || area == "天津市" || area == "上海市" || area == "重庆市") {
      area += "-";
      area += city;
      $(".provUl").css("display", "none");
      $(".cityUl").css("display", "none");
      $("#address").val(area);
      area = "";
    }
    else {
      $(".cityUl").css("display", "none");
      $(".countyUl").css("display", "block")
      area += "-";
      area += city;
      var county = _areaselect_data.a[area];
      var ulcont = "";
      for (var i = 0; i < county.length; i++) {
        var lis = "<li>" + county[i] + "</li>";
        ulcont += lis;
      }
      $(".countyUl").html(ulcont);
      $("#address").val(area);
    }
  });
  $(".countyUl").on("click", "li", function () {
    var county = $.trim($(this).text());
    area += "-";
    area += county;
    $(".provUl").css("display", "none");
    $(".cityUl").css("display", "none");
    $(".countyUl").css("display", "none");
    $("#address").val(area);
    area = "";
  })
  
  
  $('input, textarea').placeholder();

  //模块切换 
  $(".zbrw_t_l_sjfp i").mouseenter(function () {
    $(".pos_tip").show();
  }).mouseleave(function () {
    $(".pos_tip").hide();
  })
  $(".cytg_ttl li").click(function () {
    var indexs = $(this).index();
    $(".cytg_ttl li").removeClass("current").eq(indexs).addClass("current");
    $(".cytg_cont").addClass("hidden").eq(indexs).removeClass("hidden");
  });


  // 数据交互
  var para = {
    cpid: cpid,
    pageIndex: 1,
    pageSize: 5
  }
  loadData("/Detail/ListLy", para, "commentTpl", ".commentCont", function(data) {
    var total = data.result.total;
    $('.commentCount').text(total);
  }, '.pagination_comment');

  loadData("/Detail/ListTg", para, "cytg", "#cytg_cont", function(data) {
    var total = data.result.total;
    $('.tgCount').text(total);
  }, '.pagination_tg');

  $(".fbly_btn").click(function () {
    var cont = $(".fbly_ta").val();
    if (cont == "") {
      $(".errorTip").css("display", "block");
      return false;
    }
    else {
      $.post("/Detail/AddLyfb", {
        cpid: cpid,
        commemt: cont
      }).success(function () {
        $(".errorTip").css("display", "none");
        loadData("/Detail/ListLy", para, "commentTpl", ".commentCont", false);
      })
    }
  });
});

