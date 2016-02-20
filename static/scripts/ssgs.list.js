var para = {   
  city: "",
  realm: "",
  pageIndex: 1,
  pageSize: 10
} 
loadData("/List/List", para, "tzrid", ".lieb_main_section2_wrap",false);

var city = $(".lieb_main_section1_address li");
var realm =  $(".lieb_main_section1_type li");
city.click(function() {
  var that = $(this);
  loadDataByProp('city', that);
});   
realm.click(function() {
  var that = $(this);
  loadDataByProp('realm', that);
});   
function loadDataByProp(prop, elem) {
  elem.addClass("current").siblings().removeClass("current");
  para[prop] = elem.text() == '全部' ? '' : elem.text();
  loadData("/List/List", para, "tzrid", ".lieb_main_section2_wrap",false)
}