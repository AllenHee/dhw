var para = {
  pcode: '25',
  pageSize: 10,
  pageIndex: 1
}
loadData('/Boutique/list', para, 'jpTem', '.sbcs_jingpin')
$('.sbcs_type_cont_item').click(function () {
  var index = $(this).index();
  var pcode = $(this).attr('data-pcode');
  $('.sbcs_type_cont_item').removeClass('sbcs_type_cont_item-current').eq(index).addClass('sbcs_type_cont_item-current')
  para.pcode = pcode;
  loadData('/Boutique/list', para, 'jpTem', '.sbcs_jingpin');
})
$('.sbcs_filterbox_items dd').click(function () {
  var index = $(this).index();
  var min = $(this).attr('data-min');
  var max = $(this).attr('data-max');
  if(min !== '') {
    para.price1 = parseInt(min);
  }
  if(max !== '') {
    para.price2 = parseInt(max);
  }
  loadData('/Boutique/list', para, 'jpTem', '.sbcs_jingpin');
  $('.sbcs_filterbox_items dd').removeClass('sbcs_filterbox_current').eq(index - 1).addClass('sbcs_filterbox_current')
})