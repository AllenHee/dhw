$('.slide_little i').click(function() {
  var index = $(this).index();
  s_left = - 655 * index + 'px';
  $('.index_slider').animate({ left: s_left });
  $('.slide_little i').removeClass('slide_little-current').eq(index).addClass('slide_little-current')
})
$('.index_trademark_show').on('mouseenter', '.index_trademark_show_item', function() {
  $(this).find('.index_trademark_mask').show();
})
$('.index_trademark_show').on('mouseleave', '.index_trademark_show_item', function() {
  $(this).find('.index_trademark_mask').hide();
})




// 取数据
var s_firPic = {};
var s_fouPic = {};
var s_secPic = {};
var s_thiPic = {};
var firPic = [];
var secPic = [];
var thiPic = [];
var fouPic = [];
function getData(pcode) {
  $.post('/index/list', { pcode: pcode }).success(function(data) {
    var typeHtml = template('typeName', data.result)
    $('.index_trademark_text').html(typeHtml);
    if (window.dhw) {
      s_firPic.imgurl = dhw.imgurl;
      s_fouPic.imgurl = dhw.imgurl;
      s_thiPic.imgurl = dhw.imgurl;
      s_secPic.imgurl = dhw.imgurl;
    }
    if (data.result.trademark.length < 8) {
      s_firPic.imgurl = dhw.imgurl;
      $('.first_icon').show();
      $('.second_icon').hide();
      $('.third_icon').hide();
      $('.fourth_icon').hide();
      firPic = data.result.trademark.slice(0, 8)
      s_firPic.firPic = firPic;
      var firHtml = template('firTem', s_firPic)
      $('.firPic').html(firHtml)
      $('.secPic').html('')
      $('.thiPic').html('')
      $('.fouPic').html('')
    }
    if (data.result.trademark.length > 8 && data.result.trademark.length < 16) {
      firPic = data.result.trademark.slice(0, 8)
      secPic = data.result.trademark.slice(8)
      s_firPic.firPic = firPic;
      s_secPic.secPic = secPic;
      $('.first_icon').show();
      $('.second_icon').show();
      $('.third_icon').hide();
      $('.fourth_icon').hide();
      var firHtml = template('firTem', s_firPic)
      var secHtml = template('secTem', s_secPic)
      $('.firPic').html(firHtml)
      $('.secPic').html(secHtml)
      $('.thiPic').html('')
      $('.fouPic').html('')
    }
    if (data.result.trademark.length > 16 && data.result.trademark.length <= 27) {
      firPic = data.result.trademark.slice(0, 8)
      secPic = data.result.trademark.slice(8, 16)
      thiPic = data.result.trademark.slice(16)
      s_firPic.firPic = firPic;
      s_secPic.secPic = secPic;
      s_thiPic.thiPic = thiPic;
      $('.first_icon').show();
      $('.second_icon').show();
      $('.third_icon').show();
      $('.fourth_icon').hide();
      var firHtml = template('firTem', s_firPic)
      var secHtml = template('secTem', s_secPic)
      var thiHtml = template('thiTem', s_thiPic)
      $('.firPic').html(firHtml)
      $('.secPic').html(secHtml)
      $('.thiPic').html(thiHtml)
      $('.fouPic').html('')
    }
    if (data.result.trademark.length > 27) {
      $('.first_icon').show();
      $('.second_icon').show();
      $('.third_icon').show();
      $('.fourth_icon').show();
      firPic = data.result.trademark.slice(0, 8)
      secPic = data.result.trademark.slice(8, 16)
      thiPic = data.result.trademark.slice(16, 25)
      fouPic = data.result.trademark.slice(25)
      s_firPic.firPic = firPic;
      s_secPic.secPic = secPic;
      s_thiPic.thiPic = thiPic;
      s_fouPic.fouPic = fouPic;
      var firHtml = template('firTem', s_firPic)
      var secHtml = template('secTem', s_secPic)
      var thiHtml = template('thiTem', s_thiPic)
      var fouHtml = template('fouTem', s_fouPic)
      $('.firPic').html(firHtml)
      $('.secPic').html(secHtml)
      $('.thiPic').html(thiHtml)
      $('.fouPic').html(thiHtml)
    }
  })
}

getData('01')

$('.sbcs_filterbox_items dd').click(function() {
  var index = $(this).index();
  $(this).parents('.sbcs_filterbox_items').find('dd').removeClass('sbcs_filterbox_current')
    .eq(index - 1).addClass('sbcs_filterbox_current')
})


// 分类点击事件
$('.index_type_show_item').click(function() {
  var index = $(this).index();
})
$('.index_search_span').mouseenter(function() {
  $('.index_search_type').show();
})
$('.index_search_span').mouseleave(function() {
  $('.index_search_type').hide();
})
$('.index_search_type dd, .index_search_type dt').click(function() {
  $('.index_search_type').hide();
  $('.index_search_span_s').text($(this).text())
})

// 点击搜索跳转页面
var price1, price2, year1, year2, type, pcode = '01', keyword;
$('.sbcs_filterbox_items').eq(0).find('dd').click(function() {
  year1 = $(this).attr('data-min');
  year2 = $(this).attr('data-max');
})
$('.sbcs_filterbox_items').eq(1).find('dd').click(function() {
  price1 = $(this).attr('data-min');
  price2 = $(this).attr('data-max');
})
$('.sbcs_filterbox_items').eq(2).find('dd').click(function() {
  type = $(this).text();
})
$('.index_search_type dd').click(function() {
  pcode = $(this).find('span').text();
})
$('.index_search_button').click(function() {
  keyword = $('.index_search_input').val()
  var url = '/trademark?keyword=' + keyword + '&&year1=' + year1 + '&&price2=' + price2 + '&&price1=' + price1 + '&&price2=' + price2 + '&&type=' + type + '&&pcode=' + pcode;
  window.location.href = encodeURI(url)
})

// 滚轮事件
$('.index_type_show').on('mousewheel DOMMouseScroll', function(e) {
  e.preventDefault()
  e.returnValue = false
  if ($('.index_type_show').is(':animated')) {
    return false;
  }
  var t = parseInt($('.index_type_show').css('top'));
  var _delta = parseInt(e.originalEvent.wheelDelta || -e.originalEvent.detail);
  // 滚轮向上,大类向下
  if (_delta > 0) {
    if(parseInt($('.index_type_show').css('top')) >= 0) {
      return false;
    }
    $('.index_type_show').animate({ top: t + 180 + 'px' }, 500)
    setTimeout(function() {
      var index = - parseInt($('.index_type_show').css('top')) / 180
      $('.index_type_show_item').removeClass('index_type_show_item-current').eq(index).addClass('index_type_show_item-current')
      var pcode = $('.index_type_show_item-current').attr('data-pcode')
      getData(pcode)
      $('.index_trademark_ttl').text($('.index_type_show_item-current').find('p').text())
    }, 510)
  }
  // 滚轮向下,大类向上
  else {
    if(-parseInt($('.index_type_show').css('top')) >= 7920) {
      return false;
    }
    $('.index_type_show').animate({ top: t - 180 + 'px' }, 500)
    setTimeout(function() {
      var index = - parseInt($('.index_type_show').css('top')) / 180
      $('.index_type_show_item').removeClass('index_type_show_item-current').eq(index).addClass('index_type_show_item-current')
      var pcode = $('.index_type_show_item-current').attr('data-pcode')
      getData(pcode)
      $('.index_trademark_ttl').text($('.index_type_show_item-current').find('p').text())
    }, 510)
  }
})