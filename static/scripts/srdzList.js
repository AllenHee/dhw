$(function() {
  var serch_name = $(".header_main_find_input").val();
  
  var para = {
      name: serch_name,
      type :dhwtempvar.type,
      pageIndex: 1,
      pageSize: 9
    }

    $(".cont_fl li input").eq(para.type).attr("checked","checked");
    loadData("/List/Index", para, "List", ".cont_main_ul", false);
    
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
    
    $(".cont_fl li input").click(function(){
      if($(this).text() == "全部") {
        location.search = ""; 
      }
       var datatype = !$(this).attr('data-type') ? null : $(this).attr('data-type');
       location.search = "?type="+datatype;
    }); 
})