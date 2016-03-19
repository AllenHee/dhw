// 列表页
$('.sbcs_type_cont_item').click(function () {
  var index = $(this).index();
  $('.sbcs_type_cont_item').removeClass('sbcs_type_cont_item-current').eq(index).addClass('sbcs_type_cont_item-current')
})

$('.sbcs_filterbox_items dd').click(function() {
  var index = $(this).index();
  $(this).parents('.sbcs_filterbox_items').find('dd').removeClass('sbcs_filterbox_current')
    .eq(index - 1).addClass('sbcs_filterbox_current')
})


var para = {
  pcode: '01',
  pageSize: 20,
  pageIndex: 1,
  orderby: '综合'
};
loadData("/Trademark/list", para, "sbTemplate", ".items", false);
function load(elem, children_elem, type) {
  elem.find(children_elem).click(function () {
    var min = $(this).attr('data-min');
    var max = $(this).attr('data-max');
    if(min !== '') {
      min = parseInt(min);
    } 
    if(max !== '') {
      max = parseInt(max);
    }
    if(type === 'zcnx') {
      para.year1 = min;
      para.year = max;
      loadData("/Trademark/list", para, "sbTemplate", ".items", false);
    }
    if(type === 'jgqj') {
      para.price1 = min;
      para.price2 = max;
      loadData("/Trademark/list", para, "sbTemplate", ".items", false);
    }
    if(type === 'type') {
      para.num = $(this).text();
      loadData("/Trademark/list", para, "sbTemplate", ".items", false);
    }
  })
}

load($('.sbcs_filterbox_items').eq(0), 'dd', 'zcnx')
load($('.sbcs_filterbox_items').eq(1), 'dd', 'jgqj')
load($('.sbcs_filterbox_items').eq(2), 'dd', 'type')

$('.sbcs_type_cont_item').click(function () {
  para.pcode = $(this).attr('data-pcode')
  loadData("/Trademark/list", para, "sbTemplate", ".items", false);
})

$('.rank_item_pop').click(function () {
  if($(this).hasClass('selected')) {
    $(this).removeClass('selected')
  }
  $('.liebiao_rank span').removeClass('selected')
  $(this).addClass('selected')
  para.orderby = '人气';
  loadData("/Trademark/list", para, "sbTemplate", ".items", false);
})
$('.rank_item_price').click(function () {
  if($(this).hasClass('selected')) {
    $(this).removeClass('selected')
  }
  $('.liebiao_rank span').removeClass('selected')
  $(this).addClass('selected')
  para.orderby = '价格';
  loadData("/Trademark/list", para, "sbTemplate", ".items", false);
})
$('.rank_item').click(function () {
  $('.liebiao_rank span').removeClass('selected')
  $(this).addClass('selected')
  para.orderby = '综合';
  loadData("/Trademark/list", para, "sbTemplate", ".items", false);
})