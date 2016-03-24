$('.more').mouseenter(function() {
  $(this).find("ul").show();
}).mouseleave(function() {
  $(this).find("ul").hide();
})

//解析URL
function getQueryString(name) {
  var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
  var r = window.location.search.substr(1).match(reg);
  if (r != null) return unescape(r[2]); return null;
}



var para = {
  pageSize: 10,
  pageIndex: 1
}
var id = getQueryString('id');
if (getQueryString('txt')) {
  var txt = decodeURI(escape(getQueryString('txt')));
}
if (txt) {
  if (txt !== 'logo设计' && txt !== '名片设计' && txt !== '品牌设计' && txt !== '卡通形象设计' && txt !== '海报设计' && txt !== '宣传册设计') {
    $(".cysearch_head_sort").eq(0).children('dd').removeClass("cysearch_head_sortd-curent")
    $(".cysearch_head_sort").eq(0).children('.more').prev().addClass("cysearch_head_sortd-curent").text(txt);
  } else {
    for(var i = 0; i < 7; i++) {
      if($(".cysearch_head_sort").eq(0).children('dd').eq(i).text() === txt) {
        $(".cysearch_head_sort").eq(0).children('dd').removeClass('cysearch_head_sortd-curent').eq(i).addClass('cysearch_head_sortd-curent')
      }
    }
  }
}

if (id) {
  console.log(2)
  para.type = id;
}


loadData('/CyList/Index', para, 'cysearchTem', '.cysearch_result');


// 认证的选择
$(".checkbox").click(function() {
  $(this).parent().children().removeClass("cysearch_head_sortd-curent")
  $(this).addClass("cysearch_head_sortd-curent")
  para.du_type = $(this).val();
  loadData('/CyList/Index', para, 'cysearchTem', '.cysearch_result');
})


// 分类的选择
$(".cysearch_head_sort").eq(0).find("dd").click(function() {
  if ($(this).hasClass('more')) {
    return false;
  }
  var index = $(this).index();
  $(".cysearch_head_sort").eq(0).find("dd").removeClass('cysearch_head_sortd-curent').eq(index - 1).addClass('cysearch_head_sortd-curent')
  var type = $(this).attr('data-id')
  para.type = type;
  loadData('/CyList/Index', para, 'cysearchTem', '.cysearch_result');
})
$(".moreType li").click(function(event) {
  event.stopPropagation();
  $(this).parent().hide();
  $(".cysearch_head_sort").eq(0).children('dd').removeClass("cysearch_head_sortd-curent")
  $(this).parent().parent().prev().addClass("cysearch_head_sortd-curent").text($(this).text());
  para.type = $(this).attr('data-id');
  loadData('/CyList/Index', para, 'cysearchTem', '.cysearch_result');
})


// 地区的选择
$(".cysearch_head_sort").eq(1).children("dd").click(function() {
  if ($(this).hasClass('more')) {
    return false;
  }
  var index = $(this).index();
  $(".cysearch_head_sort").eq(1).find("dd").removeClass('cysearch_head_sortd-curent').eq(index - 1).addClass('cysearch_head_sortd-curent')
  var city_code = $(this).attr('data-citycode')
  para.city_code = city_code;
  loadData('/CyList/Index', para, 'cysearchTem', '.cysearch_result');
})
$(".moreAddr li").click(function(event) {
  event.stopPropagation();
  $(this).parent().hide();
  $(".cysearch_head_sort").eq(1).children('dd').removeClass("cysearch_head_sortd-curent")
  $(this).parent().parent().prev().addClass("cysearch_head_sortd-curent").text($(this).text());
  para.city_code = $(this).attr('data-citycode');
  loadData('/CyList/Index', para, 'cysearchTem', '.cysearch_result');
})
// 价格
$('.search').click(function() {
  para.minmoney = $('#minmoney').val();
  para.maxmoney = $('#maxmoney').val();
  loadData('/CyList/Index', para, 'cysearchTem', '.cysearch_result');
})