var app = angular.module('rzCorApp', ['baseapp']);
app.controller('rzCorCtrl', ['$scope', '$http', '$location', function (s, h, l) {

  s.data = {};

  s.isFirst = true;
  s.isSecond = false;
  s.isPersonal = true;
  s.valiType = 0;
  s.isValid = {};
  s.list = {
    provinces: _areaselect_data.p,
    citys: [],
    counties: [],
    types: ['身份证']
  }

  s.next = function () {
    s.isFirst = false;
    s.isSecond = true;
  }
  s.prov = function () {
    s.isFirst = true;
    s.isSecond = false;
  }
  
  // s.getCitys = function(prov) {
  //   if (prov.indexOf('市') > 0) {
  //     var arr = [];
  //     arr.push(prov);
  //     s.list.citys = arr;
  //   } else {
  //     s.list.citys = _areaselect_data.c[prov];
  //   }
  //   s.list.counties = [];
  //   s.dataC.city= '';
  //   s.dataC.county = '';
  // };
  // s.getCounties = function(city) {
  //   if (city.split('-')[0] == city.split('-')[1]) {
  //     s.list.counties = _areaselect_data.c[city.split('-')[0]];
  //   } else {
  //     s.list.counties = _areaselect_data.a[city];
  //   }
  //   s.dataC.county = '';
  // };
  
  s.closeErrorPop = function () {
    $('.errorPop_wrap, .errorPop').hide();
  };

  s.check = function (event) {
    var elem = event.target;
    var subling = $(elem).parents(".formSet_checkBox_wrap").siblings(".formSet_input")
    subling.val("");
    if ($(elem).is(":checked")) {
      subling.prop("disabled", "disabled")
    } else {
      subling.prop("disabled", "")
    }
  }

  s.submit = function () {
    var para = $.extend({}, s.data);
    if ($("#longtime").is(":checked")) {
      para.longtime = true;
      para.term = '';
    } else {
      para.longtime = false;
    }
    if ($("#longtimeID").is(":checked")) {
      para.longtimeID = true;
      para.validity = '';
    } else {
      para.longtimeID = false;
    }
    para.province = s.area.province;
    para.city = s.area.city;
    para.county = s.area.county;
    function close() {
      $(".modal_bg").fadeOut();
      $(".modal_cont").fadeOut();
    }
    $(".modal_cont_t_close").click(function () {
      close();
    });
    h.post("/CenterAuth/CompanyAuth", para).success(function (data) {
      if (data.success) {
        $(".modal_cont_button_conf").click(function () {
          location.hash = '#/list';
        });
        s.popupText = "3秒后自动返回,或点击确认返回";
        setTimeout(function () {
          location.hash = '#/list';
        }, 3000);
        $(".modal_bg").fadeIn();
        $(".modal_cont").fadeIn();
      } else {
        $(".modal_cont_button_conf").click(function () {
          close();
        });
        $(".modal_bg").fadeIn();
        $(".modal_cont").fadeIn();
        s.popupText = data.msg;
      }
    })
  }


}])