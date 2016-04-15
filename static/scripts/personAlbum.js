para = {
  pageSize: 20,
  pageIndex: 1,
  duid: personid
}
loadData('/PersonHome/PhotoList', para, 'albumTem', '.album_show')
var length;
$.post('/PersonHome/PhotoList', para).success(function(data) {
  var html = template('showTem', data.result)
  $('.slider').html(html);
  length = data.result.data.length
  $('.slider').css('width', length * 500 + 'px');
})
// 取长度
$('.album_show').on('click', '.album_show_item', function() {
  var index = $(this).index();
  $('.model_bg').show();
  $('.slider').css('left', -index * 500 + 'px');
})
// 关闭按钮
$('.model_close').click(function() {
  $('.model_bg').hide();
})
// 上一张
$('.model_prev').click(function() {
  var left = parseInt($('.slider').css('left'))
  if (left === 0 || $('.slider').is(':animated')) {
    return false;
  }
  $('.slider').animate({ left: left + 500 + 'px' });
})
// 下一张
$('.model_next').click(function() {
  var left = parseInt($('.slider').css('left'))
  if (left === -(length - 1) * 500 || $('.slider').is(':animated')) {
    return false;
  }
  $('.slider').animate({ left: left - 500 + 'px' });
})