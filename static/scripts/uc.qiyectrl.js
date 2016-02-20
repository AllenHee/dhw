function collect() {
  if($('.sc').hasClass('cancel')) {
    return false;
  }
  $.post('/CompanyHome/CollectAdd', {ddid: ddid}).success(function() {
    $('.sc').text('已收藏')
    .addClass('cancel');
  })
}