var app = angular.module('dhwApp', ['ui.router', 'ngAnimate']);

app.config(['$stateProvider', '$urlRouterProvider', function ($stateProvider, $urlRouterProvider) {
  $urlRouterProvider.otherwise('/home');
  $stateProvider
    .state('home', {
      url: '/home',
      templateUrl: dhw.gettplurl('home.html')
    })
    .state('kjfw', {
      url: '/kjfw',
      templateUrl: dhw.gettplurl('kjfw.html')
    })
    .state('rczp', {
      url: '/rczp',
      templateUrl: dhw.gettplurl('rczp.html')
    })
    .state('cysj', {
      url: '/cysj',
      templateUrl: dhw.gettplurl('cysj.html')
    })
    .state('zchuang', {
      url: '/zchuang',
      templateUrl: dhw.gettplurl('zchuang.html')
    })
    .state('zchou', {
      url: '/zchou',
      templateUrl: dhw.gettplurl('zchou.html')
    })
    .state('zbao', {
      url: '/zbao',
      templateUrl: dhw.gettplurl('zbao.html')
    })
    .state('srdz', {
      url: '/srdz',
      templateUrl: dhw.gettplurl('srdz.html')
    })
    .state('zxsj', {
      url: '/zxsj',
      templateUrl: dhw.gettplurl('zxsj.html')
    })
    .state('cqbh', {
      url: '/cqbh',
      templateUrl: dhw.gettplurl('cqbh.html')
    })
    .state('ssgs', {
      url: '/ssgs',
      templateUrl: dhw.gettplurl('ssgs.html')
    })
}])
  .controller('dhwCtrl', ['$scope', '$http', '$location', '$rootScope', '$state', function (s, h, l, r, $state) {
    r.dir = '';
    
    s.urlstate = $state;
    
    // 模块数组
    s.modules = [
      {
        name: 'home',
        text: '首页',
        show: true,
        temp: true
      },
      {
        name: 'kjfw',
        text: '会计服务',
        show: true,
        temp: true
      },
      {
        name: 'rczp',
        text: '人才招聘',
        show: true,
        temp: true
      },
      {
        name: 'cysj',
        text: '创意设计',
        show: true,
        temp: true
      },
      {
        name: 'zchuang',
        text: '众创',
        show: true,
        temp: true
      },
      {
        name: 'zchou',
        text: '众筹',
        show: true,
        temp: true
      },
      {
        name: 'zbao',
        text: '众包',
        show: true,
        temp: true
      },
      {
        name: 'srdz',
        text: '私人定制',
        show: true,
        temp: true
      },
      {
        name: 'cqbh',
        text: '产权保护',
        show: true,
        temp: true
      },
      {
        name: 'zxsj',
        text: '转型升级',
        show: true,
        temp: true
      },
      {
        name: 'ssgs',
        text: '公司上市',
        show: true,
        temp: true
      },
    ];
    
    
    // 获取数据
    h.post('/Home/GetModules').success(function(data) {
      if (data.success) {
        if (data.result != null) {
          s.modules = data.result;
          s.isLogin = true;
        } else {
          // 新用户，保存全部模块
          h.post('/Home/SaveModules', {
            module: angular.toJson(s.modules)
          });
        }
      }
    });
    
    // 确认或取消模块勾选
    s.confirmOrCancel = function(confirm) {
      if (confirm) {
        s.modules.map(function(module) {
          module.show = module.temp;
          
          // 如果当前模块被删除，切换路由视图
          var pathName = l.path();
          var moduleName = pathName.substring(1, pathName.length);
          s.modules.map(function(module) {
            if (module.name == moduleName && !module.temp) {
              if (moduleName == 'ssgs') {
                s.moduleSwitch('home', moduleName);
              } else {
                s.moduleSwitch('left', moduleName);
              }
            }
          });
        });
        // 保存数据
        h.post('/Home/SaveModules', {
          module: angular.toJson(s.modules)
        }).success(function() {
        });
      } else {
        s.modules.map(function(module) {
          module.temp = module.show;
        });
      }
    };
    
    // 路由切换
    s.moduleSwitch = function (dir, prev) {
      // 如果有进行中的路由切换动画，不往下执行
      if ( $('.view-animate').is(':animated') ) {
        return;
      }
      
      // 上一个模块在数组中的下标
      var prevIndex;
      s.modules.map(function(value, i) {
        if (value.name == prev) {
          prevIndex = i;
        }
      });
      
      /// 下一个模块
      var next;
      
      if (dir == 'left' || dir == 'right') {
        // 如果传进来的第一个参数是方向，赋值给r.dir，并确定下一个模块的名字
        r.dir = dir;
        
        function setNext() {
          prevIndex = dir == 'left' ? prevIndex + 1 : prevIndex - 1;
          if (s.modules[prevIndex].show == true) {
            next = s.modules[prevIndex].name;
          } else {
            setNext()
          }
        }
        setNext();
        
      } else {
        // 如果传进来的第一个参数是下一个模块的名字，取得其在数组中的下标，并和上一个模块的下标做比较
        next = dir;
        var nextIndex;
        s.modules.map(function(value, i) {
        if (value.name == next) {
            nextIndex = i;
          }
        });
        // 根据比较结果确定方向
        r.dir = nextIndex > prevIndex ? 'left' : 'right';
      }
      
      // 如果下一个模块是存在的，执行路由切换
      if (next) {
        l.path(next);
      }
      
    };
    
  }]);


// 动画
(function (window, angular, $, payApp) {
  'use strict';
  payApp.animation('.view-animate', ['$rootScope', function ($rootScope) {
    return {
      enter: function (element, df) {
        var $element = $(element);
        var dir = $rootScope.dir;

        $(".view-animate").css("position", "absolute");
        if (dir == 'left') {

          $element.css("left", '100%');
          $element.animate({
            left: "0%"
          }, 500, function () {
            $element.css("position", 'relative');
            df();
          });

        } else if (dir == 'right') {
          $element.css("left", '-100%');
          $element.animate({
            left: "0%"
          }, 500, function () {
            $element.css("position", 'relative');
            df();
          });
        } else {

          $(".view-animate").css("position", "relative");
          df();

        }


      },
      move: function (element) {
      },
      leave: function (element, df) {
        var $element = $(element);
        var dir = $rootScope.dir;

        $(".module").css("position", "absolute");
        if (dir == 'left') {
          $element.css("left", 0);
          setTimeout(function () {
            $element.animate({
              left: "-100%"
            }, 300, function () {
              df();
            });
          }, 10);
        } else if (dir == 'right') {
          $element.css("left", 0);
          setTimeout(function () {
            $element.animate({
              left: "100%"
            }, 300, function () {
              df();
            });
          }, 10);
        } else {

          $(".module").css("position", "relative");
          df();
        }


      }
    };
  }]);
})(window, window.angular, $, angular.module('dhwApp'));