$('.order_reduce').click(function () {
  var count = parseInt($('.order_count').attr('value'));
  if (count === 2) {
    $(this).addClass('disableReduce');
  }
  if (count > 1) {
    count = count - 1;
    $('.order_count').attr('value', count)
  }

})
$('.order_add').click(function () {
  $('.order_reduce').removeClass('disableReduce')
  var count = parseInt($('.order_count').attr('value'));
  count = count + 1;
  $('.order_count').attr('value', count)
})