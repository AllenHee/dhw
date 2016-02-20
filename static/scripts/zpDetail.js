$('.c-f-title span').click(function() {
  var citycode = $(this).attr('data-citycode');
  var cityname = $(this).text();
  $.cookie('cityname', cityname);
  $.cookie('citycode', citycode);
  location.href = '/jobs';
})

$('.city').click(function () {
  var citycode = $(this).attr('data-citycode');
  var cityname = $(this).text();
  $.cookie('cityname', cityname);
  $.cookie('citycode', citycode);
  location.href = '/jobs';
})