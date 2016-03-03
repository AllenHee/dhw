// 订单数量的增减

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




// 选择付款方式
$(".fukuan_radiot").click(function () {
  var index = $(this).index();
  $(".fukuan_radiot").removeClass("fukuan_radioo").eq(index).addClass("fukuan_radioo");
});

// 关闭弹出层
$('.model_cancel').click(function () {
  $('.orderFinish_model').hide();
  $('.orderFinish_model_bg').hide();
})
$('.model_cancel').click(function () {
  $('.model').hide();
  $('.model_bg').hide();
})

// 点击立即付款
$('.paynow').click(function () {
  var payment = $('.fukuan_radiot').attr('data-payment');
  var hbcount = $('.order_count').attr('value');
  var para = {
    number: orderno,
    payment: payment,
    hbcount: hbcount
  }
    var url = '/CpzcOrder/Alipay?number=' + orderno + '&payment=' + payment + '&hbcount=' + hbcount
    window.open(url, '_blank');
    window, location.href = '/pay3' + '/' + orderno;
})