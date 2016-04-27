$(function() {
  var para = {
      // type :dhwtempvar.type,
      type: '',
      pageIndex: 1,
      pageSize: 9
    }
    loadData("/List/Index", para, "List", ".cont_main_ul", false);
    // $(".cont_fl li input").eq(para.type).attr("checked","checked");
    // loadData("/List/Index", para, "List", ".cont_main_ul", false);
    
    $(".choose_jg li").click(function() {
      if($(this).text() == "全部") {
        loadData("/List/Index", para, "List", ".cont_main_ul", false);
      }
      var max = !$(this).attr('data-heht') ? null : + $(this).attr('data-heht');
      var min = + $(this).attr('data-low');
      para.pricemin = min;
      para.pricemax = max;
      loadData("/List/Index", para, "List", ".cont_main_ul", false);
    });
    
    // $(".cont_fl li input").click(function(){
    //   if($(this).text() == "全部") {
    //     location.search = "";
    //   }
    //    var datatype = !$(this).attr('data-type') ? null : $(this).attr('data-type');
    //    location.search = "?type=" + datatype;
    // }); 
    $('.cysearch_head_sortd').on('click', function () {
      var index = $(this).index();
      $('.cysearch_head_sortd').removeClass('cysearch_head_sortd-curent').eq(index - 1).addClass('cysearch_head_sortd-curent');
      if($(this).text() === "全部") {
         para.type = '';
         loadData("/List/Index", para, "List", ".cont_main_ul", false);
         return false;
       }
       var datatype = $(this).attr('data-type');
       para.type = datatype;
       loadData("/List/Index", para, "List", ".cont_main_ul", false);
    })
})