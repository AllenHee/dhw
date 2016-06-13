$(function () {
  var cysearch_head_sortd = $('.cysearch_head_sortd');
  var searchArr = [];
  var searchChild = [];
  var para = {
    type: '',
    types: '',
    pageIndex: 1,
    pageSize: 9
  }
  if (dhwtempvar.type != '' || dhwtempvar.types != '') {
    para.type = dhwtempvar.type;
    para.types = dhwtempvar.types;
    cysearch_head_sortd.each(function (i, value) {
      if ($(value).attr('data-type')) {
        console.log(value)
        if ($(value).attr('data-type') === dhwtempvar.type) {
          $(value).addClass('cysearch_head_sortd-curent').siblings().removeClass('cysearch_head_sortd-curent');
        }
      }
    })
    loadData("/List/Index", para, "List", ".cont_main_ul", false);
  } else {
    // if (location.search != '') {
    //   searchArr = location.search.substr(1).split('&');
    //   for (var i = 0; i < searchArr.length; i++) {
    //     searchChild = searchArr[i].split('=');
    //     if (searchChild[0] === 'sbtype') {
    //       para.sbtype = searchChild[1];
    //     }
    //   }
    // }
    loadData("/List/Index", para, "List", ".cont_main_ul", false);
  }
  // 点击价格范围筛选项触发数据筛选
  $(".choose_jg li").click(function () {
    if ($(this).text() == "全部") {
      loadData("/List/Index", para, "List", ".cont_main_ul", false);
    }
    // 取价格范围筛选
    var max = !$(this).attr('data-heht') ? null : + $(this).attr('data-heht');
    var min = + $(this).attr('data-low');
    para.pricemin = min;
    para.pricemax = max;
    loadData("/List/Index", para, "List", ".cont_main_ul", false);
  });
  // 点击分类进行筛选
  cysearch_head_sortd.on('click', function () {
    var index = $(this).index();
    cysearch_head_sortd.removeClass('cysearch_head_sortd-curent').eq(index - 1).addClass('cysearch_head_sortd-curent');
    if ($(this).text() === "全部") {
      para.type = '';
      loadData("/List/Index", para, "List", ".cont_main_ul", false);
      return false;
    }
    var datatype = $(this).attr('data-type');
    para.type = datatype;
    loadData("/List/Index", para, "List", ".cont_main_ul", false);
  })
})