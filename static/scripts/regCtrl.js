var app = angular.module('regApp', ['baseapp']);
// var app = angular.module('regApp', ['baseapp']);
// app.controller('regCtrl', ['$scope', '$http', function (s, h) {
    
// }])


app.controller('regCtrl', ['$scope', '$http', function (s, h) {
  s.dataP = {};
  s.data = {};
  s.draft={}
  var user = $('#user').val();
  var userpwd = $('#userpwd').val();
  // var usercon = $('#usercon').val();
  var company = $('#company').val();
  var compwd = $('#compwd').val();
  // var comcon = $('#comcon').val();
  if (user) {
    s.dataP.name = user;
  }
  if (userpwd) {
    s.dataP.pwd = userpwd;
    s.confirmP = userpwd;
  }
  if (company) {
    s.data.name = company;
  }
  if (compwd) {
    s.data.pwd = compwd;
    s.confirmC = compwd;
  }


  s.isPersonal = true;
  s.valiType = 0;
  s.isValid = {};

  s.list = {
    departments: ['办公室', '市场部', '采购部', '技术部', '人力资源', '其他'],
    // provinces: _areaselect_data.p,
    // citys: [],
    // counties: [],
    scales: ['5-10人', '10-50人', '50-100人', '100-200人', '200人以上'],
    trades: [],
    natures: ['政府机关/事业单位', '国营', '私营', '中外合资', '外资', '其他']
  };
  
  h.post('/UserAccount/Company').success(function (data) {
    var p = data.result.province;

    if (p) {
      var c = data.result.city;
      s.area.province = p
      s.areaList.cities = _areaselect_data.c[p];
      s.areaShow.showCities = true;
      if (!_areaselect_data.s[p]) {
        s.areaList.counties = _areaselect_data.a[p + '-' + c];
        s.areaShow.showCounties = true;
      }

      setTimeout(function () {
        s.area.city = c;
        s.area.county = data.result.addr;
      });
    }

    $.extend(s.data, data.result);
  });

  h.post('/HRZpxxFb/Tradeinfo').success(function (data) {
    s.list.trades = data.result;
  });
  
  s.getDraft = function(fn) {
       
  };
  
  
  // 验证用户名、手机、邮箱
  s.validate = function (value, prop) {
    if (value != undefined) {
      h.post('/Reg/Check', { keyword: value }).success(function (data) {
        if (data.result) {
          s.isValid[prop] = 1;
        } else {
          s.isValid[prop] = 0;
        }
      });
    }
  };
  
  // 刷新验证码
  s.codeRefresh = function () {
    $('.verifyImg').attr('src', '/Login/VerifyCode?_=' + Math.random());
  };
  
  // 关闭验证码错误提示框
  s.closeErrorPop = function () {
    $('.errorPop_wrap, .errorPop').hide();
  };

  s.submit = function () {
    var para;
    var url;
    if (s.isPersonal) {
      para = $.extend({}, s.dataP);
      url = '/Reg/AddPerson'
    } else {
      para = $.extend({}, s.data);
      url = '/Reg/AddCompany';
    }

    h.post(url, para).success(function (data) {
      if (data.success) {
        $('.errorPop_wrap').show();
        $('.successPop').show();
        setTimeout(function () {
          location.pathname = "/login";
        }, 3000)
      } else {
        $('.errorPop_wrap').show();
        $('.verifyCodeError').html(data.msg)
        $('.errorPop').fadeIn(function () {
          s.codeRefresh();
        });
      }
    });

  }
}]);