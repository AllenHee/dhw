// 列表页
$('.sbcs_type_cont_item').click(function() {
  var index = $(this).index();
  $('.sbcs_type_cont_item').removeClass('sbcs_type_cont_item-current').eq(index).addClass('sbcs_type_cont_item-current')
})

$('.sbcs_filterbox_items dd').click(function() {
  var index = $(this).index();
  $(this).parents('.sbcs_filterbox_items').find('dd').removeClass('sbcs_filterbox_current')
    .eq(index - 1).addClass('sbcs_filterbox_current')
})


//解析URL
function getQueryString(name) {
  var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
  var r = window.location.search.substr(1).match(reg);
  if (r != null) return unescape(r[2]); return null;
}


var pcode = getQueryString('pcode');
var price1 = getQueryString('price1')
var price2 = getQueryString('price2')
var keyword = getQueryString('keyword')
var type = decodeURI(escape(getQueryString('type')))
var year1 = getQueryString('year1')
var year2 = getQueryString('year2')
var para = {
  year1: '',
  year2: '',
  price1: '',
  price2: '',
  type: '',
  pcode: '01',
  pageSize: 20,
  pageIndex: 1,
  orderby: '综合'
};
if (pcode) {
  para.pcode = pcode;
  for (var i = 0, len = $('.sbcs_type_cont_item').length; i < len; i++) {
    if ($('.sbcs_type_cont_item').eq(i).attr('data-pcode') === pcode) {
      $('.sbcs_type_cont_item').removeClass('sbcs_type_cont_item-current').eq(i).addClass('sbcs_type_cont_item-current')
    }
  }
}
if (price1) {
  para.price1 = price1;
}
if (price2) {
  para.price2 = price2;
}
if (type) {
  para.type = type;
}
if (keyword) {
  para.keyword = keyword;
}
if (year1) {
  para.year1 = year1;
}
if (year2) {
  para.year2 = year2;
}
for (var i = 0, len = $('.sbcs_filterbox_items').eq(0).find('dd').length; i < len; i++) {
  var that = $('.sbcs_filterbox_items').eq(0).find('dd').eq(i);
  if (that.attr('data-min') === para.year1 && that.attr('data-max') === para.year2) {
    $('.sbcs_filterbox_items').eq(0).find('dd').removeClass('sbcs_filterbox_current').eq(i).addClass('sbcs_filterbox_current')
  }
}
for (var i = 0, len = $('.sbcs_filterbox_items').eq(1).find('dd').length; i < len; i++) {
  var that = $('.sbcs_filterbox_items').eq(1).find('dd').eq(i);
  if (that.attr('data-min') === para.price1 && that.attr('data-max') === para.price2) {
    $('.sbcs_filterbox_items').eq(1).find('dd').removeClass('sbcs_filterbox_current').eq(i).addClass('sbcs_filterbox_current')
  }
}
if (para.type !== 0) {
  for (var i = 0, len = $('.sbcs_filterbox_items').eq(2).find('dd').length; i < len; i++) {
    if ($('.sbcs_filterbox_items').eq(2).find('dd').eq(i).text() === para.type) {
      $('.sbcs_filterbox_items').eq(2).find('dd').removeClass('sbcs_filterbox_current').eq(i).addClass('sbcs_filterbox_current')
    }
  }
} else {
  console.log(1)
  $('.sbcs_filterbox_items').eq(2).find('dd').removeClass('sbcs_filterbox_current').eq(0).addClass('sbcs_filterbox_current')
}
loadData("/Trademark/list", para, "sbTemplate", ".items", false);
function load(elem, children_elem, type) {
  elem.find(children_elem).click(function() {
    var min = $(this).attr('data-min');
    var max = $(this).attr('data-max');
    if (min !== '') {
      min = parseInt(min);
    }
    if (max !== '') {
      max = parseInt(max);
    }
    if (type === 'zcnx') {
      para.year1 = min;
      para.year = max;
      loadData("/Trademark/list", para, "sbTemplate", ".items", false);
    }
    if (type === 'jgqj') {
      para.price1 = min;
      para.price2 = max;
      loadData("/Trademark/list", para, "sbTemplate", ".items", false);
    }
    if (type === 'type') {
      para.num = $(this).text();
      loadData("/Trademark/list", para, "sbTemplate", ".items", false);
    }
  })
}

load($('.sbcs_filterbox_items').eq(0), 'dd', 'zcnx')
load($('.sbcs_filterbox_items').eq(1), 'dd', 'jgqj')
load($('.sbcs_filterbox_items').eq(2), 'dd', 'type')

// 大类的悬浮事件
$('.sbcs_type_all').mouseenter(function () {
  $('.sbcs_type_cont').show();
  $('.sbcs_type_text i').css('transform', 'rotateZ(180deg)')
})
$('.sbcs_type_all').mouseleave(function () {
  $('.sbcs_type_cont').hide();
  $('.sbcs_type_text i').css('transform', 'rotateZ(0)')
})

$('.sbcs_type_cont_item').click(function() {
  var text = $(this).text();
  $('.sbcs_type_text span').text(text);
  $('.sbcs_type_cont').hide();
  para.pcode = $(this).attr('data-pcode')
  loadData("/Trademark/list", para, "sbTemplate", ".items", false);
})

$('.rank_item_pop').click(function() {
  if ($(this).hasClass('selected')) {
    $(this).removeClass('selected')
  }
  $('.liebiao_rank span').removeClass('selected')
  $(this).addClass('selected')
  para.orderby = '人气';
  loadData("/Trademark/list", para, "sbTemplate", ".items", false);
})
$('.rank_item_price').click(function() {
  if ($(this).hasClass('selected')) {
    $(this).removeClass('selected')
  }
  $('.liebiao_rank span').removeClass('selected')
  $(this).addClass('selected')
  para.orderby = '价格';
  loadData("/Trademark/list", para, "sbTemplate", ".items", false);
})
$('.rank_item').click(function() {
  $('.liebiao_rank span').removeClass('selected')
  $(this).addClass('selected')
  para.orderby = '综合';
  loadData("/Trademark/list", para, "sbTemplate", ".items", false);
})
