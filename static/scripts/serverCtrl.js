$(function() {
  var para = {
    ddid:ddid,
    typeid: '',
    pageIndex: 1,
    pageSize: 8
  }
  loadData('/CompanyHome/FwzxList', para, 'server', '.gsServe_main', false);
  $('.gsServe_choose_item').on('click', function() {
    $('.gsServe_choose_item a').removeClass('current');
    $(this).find('a').addClass('current');
    var typeid = parseInt($(this).attr('data-type'));
    para.typeid = typeid;
    loadData('/CompanyHome/FwzxList', para, 'server', '.gsServe_main', false);
  })
})