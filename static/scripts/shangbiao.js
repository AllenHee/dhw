$('.slide_little i').click(function() {
  var index = $(this).index();
  var s_left = - 770 * index + 'px';
  $('.index_slider').animate({ left: s_left });
  $('.slide_little i').removeClass('slide_little-current').eq(index).addClass('slide_little-current')
})
$('.index_trademark_show_item').mouseenter(function() {
  $(this).find('.index_trademark_mask').show();
})
$('.index_trademark_show_item').mouseleave(function() {
  $(this).find('.index_trademark_mask').hide();
})



$('.cqbh_prov').click(function() {
  if ($('.index_type_show').is(':animated') || $('.index_type_mask').is(':animated')) {
    return false;
  }
  var w_left = parseInt($('.index_type_show').css('left'));
  var m_left = parseInt($('.index_type_mask').css('left'));
  if (m_left > 346) {
    $('.index_type_mask').animate({ left: m_left - 173 + 'px' })
  }
  if (w_left >= -5190 && w_left <= -173 && m_left === 346) {
    $('.index_type_show').animate({ left: w_left + 173 + 'px' })
  }
  if (w_left > -173) {
    if (m_left > 0) {
      $('.index_type_mask').animate({ left: m_left - 173 + 'px' })
    }
  }
})
$('.cqbh_next').click(function() {
  if ($('.index_type_show').is(':animated') || $('.index_type_mask').is(':animated')) {
    return false;
  }
  var w_left = parseInt($('.index_type_show').css('left'));
  var m_left = parseInt($('.index_type_mask').css('left'));
  if (m_left < 346) {
    $('.index_type_mask').animate({ left: m_left + 173 + 'px' })
  }
  if (w_left > -5190 && w_left <= 0 && m_left === 346) {
    $('.index_type_show').animate({ left: w_left - 173 + 'px' })
  }
  if (w_left <= -5190) {
    if (m_left > 0) {
      $('.index_type_mask').animate({ left: m_left + 173 + 'px' })
    }
  }
})
$('.sbcs_filterbox_items dd').click(function() {
  var index = $(this).index();
  $(this).parents('.sbcs_filterbox_items').find('dd').removeClass('sbcs_filterbox_current')
    .eq(index - 1).addClass('sbcs_filterbox_current')
})