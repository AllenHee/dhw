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
  setCommon($('.kj_filter_box div').eq(2), 'dd', 'rztx');
  loadData("/Accounting/List", para, "financeList", ".rcmd");

  $(".rcmd").on("click", ".tags li", function() {
    var tagsli = $(this).text();
    para.keyword = tagsli;
    loadData("/Accounting/List", para, "financeList", ".rcmd");
  });

});