var app = angular.module('AppZckj', ['ui.router', 'baseapp']);

app.config(['$stateProvider', '$urlRouterProvider', function ($stateProvider, $urlRouterProvider) {
  $urlRouterProvider.otherwise('/');
  $stateProvider
    .state('main', {
      url: '/list',
      templateUrl: dhw.gettplurl('sqrz-list.html'),
      controller: 'sqrzlistCtrl'
    })
    .state('apply', {
      url: '/apply',
      templateUrl: dhw.gettplurl('zckj-apply.html'),
      controller: 'applyCtrl'
    });
}]);



//2015-12-31 郑玉云 个人中心 众创空间  申请入驻表  列表
app.controller('sqrzlistCtrl', ['$scope', '$http', function ($scope, $http) {

  $scope.loaddata = function () {
    //获取Json数据，根据参数设置值
    $http.post('/Zckj/SqrzList', $.extend({})).success(function (d) {
      if (d.success) {
        $scope.list = d.result;
      }
    });
  };
  //加载数据
  $scope.loaddata(1);
}])
  .controller('applyCtrl', ['$scope', '$http', '$location', function ($scope, $http, $location) {
    $scope.todata = [];
    $http.post('/HRZpxxFb/Tradeinfo').success(function (data) {
      $scope.todata = data.result;
    });

    $scope.data = {
      platform: $location.search().platform
    };

    $scope.submit = function () {
      var para = $.extend({}, $scope.data);
      para.dtid = $scope.data.dtid.id;
      para.trade = $scope.data.dtid.text;
      function close() {
        $(".modal_bg").fadeOut();
        $(".modal_cont").fadeOut();
      }
      $(".modal_cont_t_close").click(function () {
        close();
      });
      $http.post('/Zckj/Sqrz', para).success(function (data) {
        if (data.success) {
          $(".modal_cont_button_conf").click(function () {
            location.hash = '#/list';;
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
  }]);