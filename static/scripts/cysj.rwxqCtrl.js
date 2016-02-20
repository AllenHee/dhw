var tbApp = angular.module("toubiao",[]);
tbApp.controller("tbCtrl", ["$scope", function(s) {
  s.data = {};
  s.submit = function() {
    var para = $.extend({cpid: cpid,duid: ""},s.data);
    $.post("/Detail/AddTb",para).success(function(data) {
    });
  }
  
}]);