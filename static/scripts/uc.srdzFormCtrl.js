var app = angular.module("srdzApp", ['ui.router', 'baseapp']);

app.config(['$stateProvider', '$urlRouterProvider', function ($stateProvider, $urlRouterProvider) {
  $urlRouterProvider.otherwise("/");
  $stateProvider.state('main', { url: "/", templateUrl: dhw.gettplurl('srdz-form.html'), controller: "srdzFormCtrl" })
    .state('list', { url: "/list", templateUrl: dhw.gettplurl('srdz-list.html'), controller: "srdzlistCtrl" })
    .state('detail', { url: "/detail/:id", templateUrl: dhw.gettplurl('srdz-detail.html'), controller: "srdzdetailCtrl" })
    .state('gzlist', { url: "/gzlist", templateUrl: dhw.gettplurl('srdz-gzlist.html'), controller: 'srdzgzlistCtrl' });
}]);

app.controller("srdzFormCtrl", ['$scope', '$http', '$location', function (s, h, l) {
  s.data = {};
  s.draft={}
  s.selectType = function (typeNum) {
    s.data.type = typeNum;
  };
  // 用来存放规格的数组
  s.skuTemp = [];

  s.setPlaceholder = function () {
    $('input, textarea').placeholder();
  }
  s.setPlaceholder();

  s.addSku = function () {
    s.skuTemp.push({});
    setTimeout(function () {
      s.setPlaceholder();
    }, 1);
  };

  //提交数据
  s.submit = function () {
    var para = $.extend({}, s.data);
    delete para.realnameauth;
    // 在要提交的数据里定义规格
    para.sku = {};
    // 循环规格数组s.skuTemp，把数据放入规格para.sku
    for (var i = 0; i < s.skuTemp.length; i++) {
      var content = s.skuTemp[i].content;
      if (content[content.length - 1] == ";") {
        content = content.substring(0, content.length - 2);
      }
      para.sku[s.skuTemp[i].name] = content.split(";");
    }
    para.sku = angular.toJson(para.sku);
    // 转义html代码
    para.text = $('<div>').text(para.text).html();
    // 省市县
    for (var prop in s.area) {
      para[prop] = s.area[prop];
    }
    function close() {
      $(".modal_bg").fadeOut();
      $(".modal_cont").fadeOut();
    }
    $(".modal_cont_t_close").click(function () {
      close();
    });
    h.post("/SrdzFb/srfb", para).success(function (data) {
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
    });
  };
  // 获取数据
  s.getDraft = function(fn) {
    h.post("/Zbfb/Get").success(function (data) {
      s.data.realnameauth = data.result.realnameauth;
      if(data.result.area){
        fn(data.result.area)
      }
  });
  }
}])

  .controller("srdzlistCtrl", ["$scope", "$http", function ($scope, $http) {/*私人订制列表*/
    //分页相关参数 
    $scope.page = { pageSize: 10, pageIndex: 1, total: 0 };
    $scope.loaddata = function (i) {
      if (!!i) $scope.page.pageIndex = i;
      //获取Json数据，根据参数设置值
      $http.post('/SrdzFb/List', $.extend({}, $scope.page, $scope.qrydata)).success(function (d) {
        if (d.success) {
          $scope.list = d.result.data;
          $scope.page.total = d.result.total;
        }
      });
    };
    //加载数据
    $scope.loaddata(1);
  }])

  .controller("srdzdetailCtrl", ["$scope", "$http", "$stateParams", function ($scope, $http, $stateParams) {/*私人订制详细*/
    var id = $stateParams.id; console.log(id);
    var loaddata = function () {
      //获取Json数据，根据参数设置值
      $http.post('/SrdzFb/Detail', { id: id }).success(function (d) {
        if (d.success) {
          $scope.data = d.result;
        }
      });
    };
    //加载数据
    loaddata();
  }])


//黄文明 2016-1-15 个人中心  私人订制  关注or取消关注
  .controller('srdzgzlistCtrl', ["$scope", "$http", function ($scope, $http) {
    //分页相关参数 
    $scope.page = { pageSize: 10, pageIndex: 1, total: 0 };
    $scope.loaddata = function (i) {
      if (!!i) $scope.page.pageIndex = i;
      //获取Json数据，根据参数设置值
      $http.post('/SrdzGz/AttentionList', $.extend({}, $scope.page, $scope.qrydata)).success(function (d) {
        if (d.success) {
          $scope.list = d.result.data;
          $scope.page.total = d.result.total;
        }
      });
    };
    //加载数据
    $scope.loaddata(1);
    $scope.save = function (id) {
      $.post('/SrdzGz/AttentionDel', { id: id });
      $scope.loaddata(1);
    }
  }]);