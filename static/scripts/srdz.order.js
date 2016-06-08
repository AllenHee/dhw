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

// 读取数据

var addrData = [];
var para = {
  model: {}
};
// $.post('/useraddr/list').success(function (data) {
//   addrData = data.result;
//   var html = template('addressTem', data);
//   $('.address_tem').html(html)
//   $('.address_tem').on('click', '#modify', function () {
//     var id = $(this).attr('data-id');
//     para.model.id = id;
//     $('.newaddrForm_btn').removeClass('addNewAddr').addClass('addrModify');
//     var id = parseInt($(this).attr('data-id'));
//     for (var i = 0, len = addrData.length; i < len; i++) {
//       if (id === addrData[i].id) {
//         $('#province').val(addrData[i].province_name);
//         $('#city').val(addrData[i].city_name);
//         $('#county').val(addrData[i].district_name);
//         $('#province').attr('data-code', addrData[i].province_code);
//         $('#city').attr('data-code', addrData[i].city_code);
//         $('#county').attr('data-code', addrData[i].district_code);
//         $('#address').val(addrData[i].address);
//         $('#code').val(addrData[i].code);
//         $('#name').val(addrData[i].name);
//         $('#mobile').val(addrData[i].mobile);
//         if (addrData[i].tel) {
//           var tel = addrData[i].tel.split('-');
//           $('#quhao').val(tel[0]);
//           $('#phone').val(tel[1]);
//           $('#fenji').val(tel[2]);
//         }
//         if (addrData[i].isDefault === true) {
//           $('#default').attr('checked', 'checked')
//         }

//       }
//     }
//   })
// })


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
var confirm_addr = $('.address_tem');
$('.nextBtn_btn').click(function () {
  var receiveName = confirm_addr.find('.orderfill_name').val();
  var receivePhone = confirm_addr.find('.orderfill_phone').val();
  //var receiveAddress = confirm_addr.find('.orderfill_addr').text();
  //var districtCode = confirm_addr.find('.district_name').attr('data-code')
  //var invoicehead = $('.invoiceInput').val();
  var remark = $('.invoiceInput_long').val();
  //var isinvoice;
  // if ($('.need_invo').hasClass('selected_icon')) {
  //   isinvoice = true;
  // }
  // if ($('.notNeed_invo').hasClass('selected_icon')) {
  //   invoicehead = null;
  //   isinvoice = false;
  // }
  var para = {
    model: {
      receiveName: receiveName,
      receivePhone: receivePhone,
      // receiveAddress: receiveAddress,
      // districtCode: districtCode,
      //invoicehead: invoicehead,
      remark: remark,
      // isinvoice: isinvoice,
      shoppingCartID: shoppingCartID
    }
  }
  $.ajax({
    url: '/srdzorder/add',
    type: 'POST',
    contentType: 'application/json',
    data: JSON.stringify(para),
    success: function (data) {
      var orderno = data.result.number;
      //console.log(orderno)
      window.location.href = '/pay2/' + orderno;
    }
  })
})

// 地址的修改与保存

$('.orderfill_cont').on('click', '.newAddr', function () {
  $('.newaddrForm_btn').removeClass('addrModify').addClass('addNewAddr')
})

// function address(path) {
//   var province = $('#province').val();
//   var province_code = $('#province').attr('data-code');
//   var city = $('#city').val();
//   var city_code = $('#city').attr('data-code');
//   var county = $('#county').val();
//   var county_code = $('#county').attr('data-code');
//   var address = $('#address').val();
//   var code = $('#code').val();
//   var name = $('#name').val();
//   var mobile = $('#mobile').val();
//   var quhao = $('#quhao').val();
//   var phone = $('#phone').val();
//   var fenji = $('#fenji').val();
//   var tel = quhao + phone + fenji;
//   if ($('#default').is(':checked')) {
//     var isDefault = true;
//   }
//   else {
//     isDefault = false;
//   }
//   var area = {
//     province: {
//       name: province,
//       code: province_code
//     },
//     city: {
//       name: city,
//       code: city_code
//     },
//     district: {
//       name: county,
//       code: county_code
//     }
//   };
//   para.model.name = name;
//   para.model.code = code;
//   para.model.address = address;
//   para.model.mobile = mobile;
//   para.model.tel = tel;
//   para.model.area = area;
//   para.model.isDefault = isDefault;
//   $.ajax({
//     url: path,
//     type: 'POST',
//     contentType: 'application/json',
//     data: JSON.stringify(para),
//     success: function () {
//       $('.model').hide();
//       $('.model_bg').hide();
//       $.post('/useraddr/list').success(function (data) {
//         addrData = data.result;
//         var html = template('addressTem', data);
//         $('.address_tem').html(html)
//       })
//     }
//   })
// }

// $('.model_cont').on('click', '.addrModify', function () {
//   address('/useraddr/edit');
// });

// $('.model_cont').on('click', '.addNewAddr', function () {
//   address('/useraddr/add');
// });

// 删除客户信息
$('.address_tem').on('click', '#delete', function () {
  var conf = confirm('是否确定删除?');
  if (conf) {
    var id = $(this).siblings('#modify').attr('data-id')
    $.post('/useraddr/del', { id: id }).success(function () {
      $.post('/useraddr/list').success(function (data) {
        addrData = data.result;
        var html = template('addressTem', data);
        $('.address_tem').html(html)
      })
    })
  }
})

// 设置默认地址
$('.address_tem').on('click', '.operate_items_grey', function () {
  var id = $(this).siblings('#modify').attr('data-id')
  $.post('/useraddr/setdefault', { id: id }).success(function () { })
})