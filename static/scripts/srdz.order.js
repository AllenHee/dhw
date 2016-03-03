// 默认地址与发票的选择
$('.invoice').click(function () {
  var index = $(this).index();
  $('.invoice i').removeClass('selected_icon').eq(index).addClass('selected_icon');
  if ($('.notNeed_invo').hasClass('selected_icon')) {
    $('.invoiceInput').attr('disabled', 'disabled')
  }
  if ($('.need_invo').hasClass('selected_icon')) {
    $('.invoiceInput').removeAttr('disabled')
  }
})
$('.address_tem').on('mouseover', '.areaSelect', function () {
  $(this).addClass('selected_addr');
})
$('.address_tem').on('mouseout', '.areaSelect', function () {
  if ($(this).hasClass('confirm')) {
    return false;
  }
  $(this).removeClass('selected_addr');
})
$('.address_tem').on('click', '.areaSelect', function () {
  var index = $(this).index();
  $('.areaSelect').removeClass('confirm selected_addr').eq(index).addClass('confirm selected_addr');
})

// 点击修改与添加新地址
$('.address_tem').on('click', '#modify', function () {
  $('.model_bg').show();
  $('.model').show();
})
$('.orderfill_cont').on('click', '.newAddr', function () {
  $('.model_bg').show();
  $('.model').show();
  document.getElementById('addrForm').reset();
})

// 地区的选择

var provinces = [];
var cities = [];
var counties = [];
$.getJSON(dhw.urlmain + '/Dict/city2?callback=?', function (data) {
  var provinces = data.result;
  // 循环取得省
  for (var i = 0, pLen = provinces.length; i < pLen; i++) {
    var content = provinces[i].name;
    var code = provinces[i].code;
    var html = '<li data-code="' + code + '">' + content + '</li>'
    $('.addr_province').append(html);
  }
  // 循环取得市
  $('.addr_province li').click(function () {
    cities = [];
    $('.addr_city').empty();
    var province = $(this).html();
    $('#province').val(province);
    for (var i = 0, len = provinces.length; i < len; i++) {
      if (province === provinces[i].name) {
        cities = provinces[i].citys;
      }
    }
    for (var i = 0, cLen = cities.length; i < cLen; i++) {
      var content = cities[i].name;
      var code = cities[i].code;
      var html = '<li data-code="' + code + '">' + content + '</li>'
      $('.addr_city').append(html);
    }
    $('.addr_province').hide();
    $('.addr_city').show();
    $('#province').attr('data-code', $(this).attr('data-code'));
  })
  // 循环取得县
  $('.addr_city').on('click', 'li', function () {
    counties = [];
    $('.addr_county').empty();
    var city = $(this).html();
    $('#city').val(city);
    for (var i = 0, cLen = cities.length; i < cLen; i++) {
      if (city === cities[i].name) {
        counties = cities[i].districts
      }
    }
    for (var i = 0, coLen = counties.length; i < coLen; i++) {
      var content = counties[i].name;
      var code = counties[i].code;
      var html = '<li data-code="' + code + '">' + content + '</li>'
      $('.addr_county').append(html);
    }
    $('.addr_city').hide();
    $('.addr_county').show();
    $('#city').attr('data-code', $(this).attr('data-code'));
  })

  $('.addr_county').on('click', 'li', function () {
    var county = $(this).html()
    $('#county').val(county)
    $('.addr_county').hide();
    $('#county').attr('data-code', $(this).attr('data-code'));
  })

  $('#province').click(function () {
    $('.addr_province').show();
    $('#city').val('');
    $('#county').val('');
  })
  $('#city').click(function () {
    $('.addr_city').show();
  })
  $('#county').click(function () {
    $('.addr_county').show();
  })
})

// 关闭弹出层
$('.model_cancel').click(function () {
  $('.model').hide();
  $('.model_bg').hide();
})

// 订单生成
$('.nextBtn_btn').click(function () {
  var confirm_addr = $('.confirm')
  var receiveName = confirm_addr.find('.orderfill_name').html();
  var receivePhone = confirm_addr.find('.orderfill_phone').html();
  var receiveAddress = confirm_addr.find('.orderfill_addr').text();
  var districtCode = confirm_addr.find('.district_name').attr('data-code')
  var invoicehead = $('.invoiceInput').val();
  var remark = $('.invoiceInput_long').val();
  var isinvoice;
  if ($('.need_invo').hasClass('selected_icon')) {
    isinvoice = true;
  }
  if ($('.notNeed_invo').hasClass('selected_icon')) {
    invoicehead = null;
    isinvoice = false;
  }
  var para = {
    model: {
      receiveName: receiveName,
      receivePhone: receivePhone,
      receiveAddress: receiveAddress,
      districtCode: districtCode,
      invoicehead: invoicehead,
      remark: remark,
      isinvoice: isinvoice,
      shoppingCartID: shoppingCartID
    }
  }
  $.ajax({
    url: '/srdzorder/add',
    type: 'POST',
    contentType: 'application/json',
    data: JSON.stringify(para),
    success: function (data) {
      var orderno = data.result.number
      window.location.href = '/pay2/' + orderno;
    }
  })
})