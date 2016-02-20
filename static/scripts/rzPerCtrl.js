var app = angular.module('rzPerApp', ['baseapp']);

app.controller('rzPerCtrl', ['$scope', '$http', function(s, h) {
  
  s.data = {
    job: '1'
  }
  
  s.submit = function() {
    var para = $.extend({}, s.data)
    if($("#longtimeID").is(":checked")) {
      para.longtimeID = true;
      para.overdue = "";
    }else {
      para.longtimeID = false;
    }
    h.post("/CenterAuth/PersonalAuth", para
    ).success(function (data) {
    });
  }
  s.check = function(event) {
    var elem = event.target;
    var subling = $(elem).parents(".formSet_checkBox_wrap").siblings(".formSet_input")
      subling.val("");
    if($(elem).is(":checked")) {
      subling.prop("disabled", "disabled")
    }else {
      subling.prop("disabled", "")
    }
  }
  
}])