var addrApp = angular.module("addr", ["baseapp"]);
addrApp.controller("AddrCtrl", ["$scope", function(s){
  s.data = {
    area: "中国大陆",
    phone: []
  };
  
  s.submit = function() {
    var para = $.extend({}, s.data);
    para.address = s.area + "-" + para.detailAddr;
    delete para.province;
    delete para.city;
    delete para.detailAddr;
    
    para.tel = 
      (para.phone.zone? para.phone.zone : " ") + "-" +
      (para.phone.number? para.phone.number : " ") + "-" +
      (para.phone.extension? para.phone.extension : " ");
    delete para.phone;
    // 提交
    $.post("/CenterAddress/Add",para).success(function(data) {
    });
  }
}]);