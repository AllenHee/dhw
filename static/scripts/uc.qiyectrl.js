function collect() {
  if($('.sc').text() == '已收藏') {
    $.post('/CompanyHome/CollectDel', {ddid: ddid}).success(function(d) {
      if(d.success){
        $('.sc').text('收藏')
      }else {
        alert('无法取消收藏')
      }
  })
  }else {
    $.post('/CompanyHome/CollectAdd', {ddid: ddid}).success(function() {
      $('.sc').text('已收藏');
    })
  }
}