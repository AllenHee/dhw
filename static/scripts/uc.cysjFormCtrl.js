var app = angular.module("cysjApp", ['ui.router', 'baseapp']);

app.config(['$stateProvider', '$urlRouterProvider', function ($stateProvider, $urlRouterProvider) {
  $urlRouterProvider.otherwise("/");
  $stateProvider.state('main', { url: "/", templateUrl: dhw.gettplurl('cysj-form.html'), controller: "cysjFormCtrl" })
    .state('list', { url: "/list", templateUrl: dhw.gettplurl('cysj-list.html'), controller: "cysjlistCtrl" })
    .state('detail', { url: "/detail/:id", templateUrl: dhw.gettplurl('cysj-detail.html'), controller: "cysjdetailCtrl" });
}]);

app.controller("cysjFormCtrl", ["$scope", "$http", '$location', function (s, h, l) {
  s.data = {};
  s.selectTrans = function (event, transNum) {
    s.data.transaction = transNum;
    $(event.target).parents('.formSet').find('.formInputSet_radio').css({
      "background-position": "0 0"
    })
    $(event.target).css({
      "background-position": "0 -20px"
    });
  };
  function close() {
    $(".modal_bg").fadeOut();
    $(".modal_cont").fadeOut();
  }
  $(".modal_cont_t_close").click(function () {
    close();
  });

  s.showDate = function (event) {
    if ($(event.target).hasClass('disabled')) {
      return false;
    }
    s.data.endtime = s.year + '-' + s.month + '-' + s.date;
  }
  s.popupText = '';
  //提交数据
  s.submit = function () {
    var para = s.data;
    delete para.realnameauth;
    h.post("/CysjFb/CyFb", para).success(function (data) {
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
  h.post("/Zbfb/Get").success(function (data) {
    s.data.realnameauth = data.result.realnameauth;
  });
}])

  .controller("cysjlistCtrl", ["$scope", "$http", function ($scope, $http) {/*创意设计列表*/
    //分页相关参数 
    $scope.page = { pageSize: 10, pageIndex: 1, total: 0 };
    $scope.loaddata = function (i) {
      if (!!i) $scope.page.pageIndex = i;
      //获取Json数据，根据参数设置值
      $http.post('/CysjFb/List', $.extend({}, $scope.page, $scope.qrydata)).success(function (d) {
        if (d.success) {
          $scope.list = d.result.data;
          $scope.page.total = d.result.total;
        }
      });
    };
    //加载数据
    $scope.loaddata(1);
  }])

  .controller("cysjdetailCtrl", ["$scope", "$http", "$stateParams", function ($scope, $http, $stateParams) {/*创意设计详细*/
    var id = $stateParams.id; console.log(id);
    var loaddata = function () {
      //获取Json数据，根据参数设置值
      $http.post('/CysjFb/Detail', { id: id }).success(function (d) {
        if (d.success) {
          $scope.data = d.result;
        }
      });
    };
    //加载数据
    loaddata();
  }]);