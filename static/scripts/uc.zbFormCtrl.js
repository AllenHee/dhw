var app = angular.module("zbApp", ['ui.router', 'baseapp']);

app.config(['$stateProvider', '$urlRouterProvider', function ($stateProvider, $urlRouterProvider) {
  $urlRouterProvider.otherwise("/");
  $stateProvider.state('main', { url: "/", templateUrl: dhw.gettplurl('zb-form.html'), controller: "zbFormCtrl" })
    .state('list', { url: "/list", templateUrl: dhw.gettplurl('zb-list.html'), controller: "zblistCtrl" })
    .state('collect', { url: "/collect", templateUrl: dhw.gettplurl('zb-collect.html'), controller: "zbcollectCtrl" })
    .state('detail', { url: "/detail/:id", templateUrl: dhw.gettplurl('zb-detail.html'), controller: "zbdetailCtrl" });
}]);

app.controller("zbFormCtrl", ['$scope', '$http', '$location', function (s, h, l) {
  s.data = {
    smrz: false,
    sjrz: false,
  };
  s.items = [{}];
  s.selectType = function (typeNum) {
    s.data.typeid = typeNum;
  };
  s.showDate = function (event) {
    if ($(event.target).hasClass('disabled')) {
      return false;
    }
    s.data.endtime = s.year + '-' + s.month + '-' + s.date;
  }
  // 删除任务
  s.del = function (index) {
    s.items.splice(index, 1);
  }
    
  // 添加任务
  // s.del = function(index) {
  //   s.items.push({});
  // }
    
  // 提交数据
  s.submit = function () {
    s.data.items = angular.toJson(s.items);
    // 复制一份数据
    var para = angular.copy(s.data);
    // 删除不需要提交的项
    delete para.realnameauth;
    function close() {
      $(".modal_bg").fadeOut();
      $(".modal_cont").fadeOut();
    }
    $(".modal_cont_t_close").click(function () {
      close();
    });
    h.post("/Zbfb/Fb", para).success(function (data) {
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
    });
  }
  // 获取数据
  h.post("/Zbfb/Get").success(function (data) {
    $.extend(s.data, data.result);
  });
}])

  .controller("zblistCtrl", ["$scope", "$http", function ($scope, $http) {/*众包列表*/
    //分页相关参数 
    $scope.page = { pageSize: 10, pageIndex: 1, total: 0 };
    $scope.loaddata = function (i) {
      if (!!i) $scope.page.pageIndex = i;
      //获取Json数据，根据参数设置值
      $http.post('/Zbfb/List', $.extend({}, $scope.page, $scope.qrydata)).success(function (d) {
        if (d.success) {
          $scope.list = d.result.data;
          $scope.page.total = d.result.total;
        }
      });
    };
    //加载数据
    $scope.loaddata(1);
  }])

  .controller("zbdetailCtrl", ["$scope", "$http", "$stateParams", function ($scope, $http, $stateParams) {/*众包详细*/
    var id = $stateParams.id; console.log(id);
    var loaddata = function () {
      //获取Json数据，根据参数设置值
      $http.post('/Zbfb/Detail', { id: id }).success(function (d) {
        if (d.success) {
          $scope.t1 = d.result.t1;
          $scope.t2 = d.result.t2;
        }
      });
    };
    //加载数据
    loaddata();
  }])

  .controller("zbcollectCtrl", ["$scope", "$http", function ($scope, $http) {/*我的收藏*/
    //分页相关参数 
    $scope.page = { pageSize: 10, pageIndex: 1, total: 0 };
    $scope.loaddata = function (i) {
      if (!!i) $scope.page.pageIndex = i;
      //获取Json数据，根据参数设置值
      $http.post('/Zbfb/Collect', $.extend({}, $scope.page, $scope.qrydata)).success(function (d) {
        if (d.success) {
          $scope.list = d.result.data;
          $scope.page.total = d.result.total;
        }
      });
    };
    //取消收藏
    $scope.cancel = function (id) {
      $http.post('/Zbfb/Cancel', {
        fpid: id
      }).success(function () { $scope.loaddata(1) });
    }

    //加载数据
    $scope.loaddata(1);
  }]);