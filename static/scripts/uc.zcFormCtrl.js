var app = angular.module("zcApp", ['ui.router', 'baseapp']);

app.config(['$stateProvider', '$urlRouterProvider', function ($stateProvider, $urlRouterProvider) {
  $urlRouterProvider.otherwise("/fb");
  $stateProvider
    .state('list', { url: "/list", templateUrl: dhw.gettplurl('zc-list.html'), controller: 'zclistCtrl' })
    .state('gzlist', { url: "/gzlist", templateUrl: dhw.gettplurl('zc-gzlist.html'), controller: 'zcgzlistCtrl' })
    .state('list_detail',{url:"/list_detail",templateUrl:dhw.gettplurl('fb_preview.html'),controller: 'list_detailCtrl'})
     .state('tzlist',{url:"/tzlist",templateUrl:dhw.gettplurl('zc-tzlist.html'),controller: 'zctzlistCtrl'});

  $stateProvider
    .state('ProjectLaunch', {
      url: '/fb',
      controller: 'mainCtrl',
      templateUrl: dhw.gettplurl('fb_main.html')
    })
    .state('ProjectLaunch.basic', {
      url: '/basic',
      controller: 'basicCtrl',
      templateUrl: dhw.gettplurl('fb_basic.html')
    })
    .state('ProjectLaunch.project', {
      url: '/project',
      controller: 'projectCtrl',
      templateUrl: dhw.gettplurl('fb_project.html')
    })
    .state('ProjectLaunch.detail', {
      url: '/detail',
      controller: 'detailCtrl',
      templateUrl: dhw.gettplurl('fb_detail.html')
    })
    .state('ProjectLaunch.payback', {
      url: '/payback',
      controller: 'paybackCtrl',
      templateUrl: dhw.gettplurl('fb_payback.html')
    })
    .state('ProjectLaunch.preview', {
      url: '/preview',
      controller: 'previewCtrl',
      templateUrl: dhw.gettplurl('fb_preview.html')
    });

}])
  .directive('placeholder', function ($timeout) {
    var i = document.createElement('input');
    if ('placeholder' in i) {
      return {}
    }
    return {
      link: function (scope, elm, attrs) {
        if (attrs.type === 'password') {
          return;
        }
        $timeout(function () {
          elm.val(attrs.placeholder);
          elm.bind('focus', function () {
            if (elm.val() == attrs.placeholder) {
              elm.val('');
            }
          }).bind('blur', function () {
            if (elm.val() == '') {
              elm.val(attrs.placeholder);
            }
          });
        });
      }
    }
  }).
//黄文明 2015-12-5 个人中心 众筹项目查询  列表页面  根据用户id获取
  controller('zclistCtrl', ["$scope", "$http", function ($scope, $http) {/*众包列表*/
    //分页相关参数 
    $scope.page = { pageSize: 10, pageIndex: 1, total: 0 };
    $scope.loaddata = function (i) {
      if (!!i) $scope.page.pageIndex = i;
      //获取Json数据，根据参数设置值
      $http.post('/CpzcList/List', $.extend({}, $scope.page, $scope.qrydata)).success(function (d) {
        if (d.success) {
          $scope.list = d.result.data;
          $scope.page.total = d.result.total;
        }
      });
    };
    //加载数据
    $scope.loaddata(1);
  }])
//黄文明 2015-12-7 个人中心  众筹  关注列表
  .controller('zcgzlistCtrl', ["$scope", "$http", function ($scope, $http) {
    //分页相关参数 
    $scope.page = { pageSize: 10, pageIndex: 1, total: 0 };
    $scope.loaddata = function (i) {
      if (!!i) $scope.page.pageIndex = i;
      //获取Json数据，根据参数设置值
      $http.post('/CpzcGzList/List', $.extend({}, $scope.page, $scope.qrydata)).success(function (d) {
        if (d.success) {
          $scope.list = d.result.data;
          $scope.page.total = d.result.total;
        }
      });
    };
    //加载数据
    $scope.loaddata(1);
    $scope.save = function (id) {
        $.post('/CpzcGzList/DelAttention', { id: id });
        $scope.loaddata(1);
    }
    
  }])
// 主控制器
  .controller('mainCtrl', ['$scope', '$http', '$state', '$location', function (s, h, $state, $location) {
    s.urlstate = $state;
    
    // 标签转跳
    s.route = function (routeName, prevRoute) {
      $location.path('/fb/' + routeName);
      s.saveDraft(prevRoute);
    };
    
    // 草稿数据
    s.draft = {};
    // 验证数据
    s.isValid = {}
    // 验证方法
    s.setValid = function (current, async) {
      var isValid = true;
      $('.isValid').each(function () {
        if ($(this).is('input[disabled]')) {
          isValid = false;
        }
      });
      if (async) {
        s.$apply(function () {
          s.isValid[current] = isValid ? true : false;
        });
      } else {
        s.isValid[current] = isValid ? true : false;
      }
    };
   
    // 获取验证
    // 获取草稿和验证
    s.getDraft = function (minor, fn) {
      var mainmark = $location.search().id;
      // 获取草稿
      h.post('/AppDraft/GetSub', {
        type: 'crowdfunding',
        mainmark: mainmark,
        minor: minor
      }).success(function (data) {
        fn(data.result.content);
      });
      // 获取验证
      h.post('/AppDraft/GetSub', {
        type: 'crowdfunding',
        mainmark: mainmark,
        minor: 'isvalid'
      }).success(function (data) {
        $.extend(s.isValid, data.result.content);
      });
    };
    // 提交草稿和验证
    s.saveDraft = function (currentName, direction, isManual) {
      var mainmark = $location.search().id;
      // 如果上一个标签不是预览，就提交相关数据
      if (currentName != 'ProjectLaunch.preview') {
        var current = currentName.split('.')[1];
        var content = s.draft[current]();
        h.post('/AppDraft/SaveSub', { type: 'crowdfunding', mainmark: mainmark, minor: current, content: content }).success(function () {
          if (isManual) {
            // var today = new Date();
            // var hour = today.getHours(),
            //     minute = today.getMinutes(),
            //     second = today.getSeconds();
            // var time = hour + ':' + minute + ':' + second;
            $('.saveTip-' + current).text('保存成功');
          }
        });
      
        // 提交验证
        s.setValid(current);
        var isValid = $.extend({}, s.isValid);
        isValid = angular.toJson(isValid)
        h.post('/AppDraft/SaveSub', { type: 'crowdfunding', mainmark: mainmark, minor: 'isvalid', content: isValid }).success(function () {
          // 成功
        });
      }
      
      // 转跳标签
      if (direction == 1) {// 下一步
        var next;
        switch (current) {
          case 'basic':
            next = 'project';
            break;
          case 'project':
            next = 'detail';
            break;
          case 'detail':
            next = 'payback';
            break;
        }
        $location.path('/fb/' + next);
        $(document).scrollTop(0);
      } else if (direction == 0) {
        var prev;
        switch (current) {// 上一步
          case 'project':
            prev = 'basic';
            break;
          case 'detail':
            prev = 'project';
            break;
          case 'payback':
            prev = 'detail';
            break;
        }
        $location.path('/fb/' + prev);
        $(document).scrollTop(0);
      }

    };
  
    // 提交审核
    s.submit = function () {
      var mainmark = $location.search().id;
      h.post('/CpzcFb/Sumbit', {
        mainmark: mainmark
      }).success(function () {
        window.location.href  = 'http://www.dreamhiway.com/AppCF#/list';
      });
    };
    
    
    /*** 行为 ***/
    // 显示下拉框
    s.showSelectCont = function (event) {
      event.stopPropagation();
      $('.selectCont').hide();
      $(event.target).next().show();
    };
    // 隐藏下拉框
    s.hideSelectCont = function () {
      $('.selectCont').hide();
    };
    // 省市选择 默认省市
    s.provs = _areaselect_data.p;
  
    // 字数统计方法
    s.wordCount = function (elem) {
      var count = elem.val().length;
      var max = elem.attr('maxlength');
      elem.parents('.count').find('.formSet_count_used').text(max - count);
    };
    // 监视文本框，一变化就重新统计字数
    s.wordWatch = function () {
      $('.content').on("input propertychange", '.count input, .count textarea', function () {
        s.wordCount($(this));
      });
    } ();
    
    // 
    var para = $location.search();
    if (para.id) {
      if ($location.path() == '/fb/')
        $location.path('/fb/basic').search(para);
    } else {
      h.post('/AppDraft/GetMainmark', { type: 'crowdfunding', minor: 'basic' }).success(function (data) {
        $location.path('/fb/basic').search({ id: data.result.mainmark });
      });
    }
  }]).
// 基本信息
  controller('basicCtrl', ['$scope', '$http', function (s, h) {
    /*** 数据 ***/
    // 核心数据
    s.dataP = {
      sercont: 1,
      ptid: 3,
    };
    s.dataC = {
      sercont: 1,
      ptid: 3,
    }
    // 视图数据
    s.showPersonal = true;
    // 当前应该处理的是哪个数据
    s.which_data = function () {
      var which_data;
      if (s.showPersonal) {
        which_data = 'dataP';
      } else {
        which_data = 'dataC';
      }
      return which_data;
    }
    
    // 载入草稿和验证
    s.$parent.getDraft('basic', function (draft) {
      $.extend(s, draft);
      if (s.dataP.city) {
        s.prov = s.dataP.city.split(',')[0];
        s.city = s.dataP.city.split(',')[1];
      }
    });

    // 保存草稿数据到根作用域
    s.$parent.draft.basic = function () {
      var draft = {};
      draft.dataP = s.dataP;
      draft.dataC = s.dataC;
      draft.showPersonal = s.showPersonal;
      return angular.toJson(draft);
    };
  
    /*** 行为 ***/
    // 根据省选择市
    s.getCitys = function (event) {
      s.prov = $.trim($(event.target).text());
      s.citys = _areaselect_data.c[s.prov];
      s.city = _areaselect_data.c[s.prov][0];
    };
    // 取得省市信息
    s.setCity = function (event) {
      s.city = $.trim($(event.target).text());
      s.dataP.city = s.prov + "," + s.city;
    };
  
    // 项目类型
    s.zctypes = [
      { 'name': '公益', 'id': 3 },
      { 'name': '科技', 'id': 4 },
      { 'name': '工业', 'id': 5 },
      { 'name': '农业', 'id': 6 },
      { 'name': '家电', 'id': 7 },
      { 'name': '设计', 'id': 8 },
      { 'name': '娱乐', 'id': 9 },
      { 'name': '出版', 'id': 10 },
      { 'name': '房产', 'id': 11 },
      { 'name': '其它', 'id': 12 }
    ];
    // 判断是否是当前选中的类型
    s.isSelected = function (id) {
      var which_data = s.which_data();
      return (
        (id == s[which_data].ptid) ? true : false
        );
    };
    // 选中一个类型
    s.getType = function (event, id) {
      var which_data = s.which_data();
      s[which_data].ptid = id;
    };
  
    // 选择平台服务内容
    s.setSercont = function (event) {
      var which_data = s.which_data();
      var selected = $(event.target).is('.active');
      if (selected) {
        $(event.target).removeClass('active');
        s[which_data].sercont = 0;
      } else {
        $(event.target).addClass('active');
        s[which_data].sercont = 1;
      }
    };

  }]).
// 项目信息
  controller('projectCtrl', ['$scope', '$http', function (s, h) {
    /*** 数据 ***/
    // 核心数据
    s.data = {
      rectag: [],
      diytag: ""
    };
  
    // 载入草稿和验证
    s.$parent.getDraft('project', function (draft) {
      $.extend(s, draft);
    });

    
    // 保存草稿数据到根作用域
    s.$parent.draft.project = function () {
      var draft = {};
      draft.data = s.data;
      return angular.toJson(draft);
    }
  
    /*** 行为 ***/
    // 根据省选择市
    s.getCitys = function (event) {
      s.data.province = $.trim($(event.target).text());
      s.citys = _areaselect_data.c[s.data.province];
      s.data.city = _areaselect_data.c[s.data.province][0];
    };
    // 取得省市信息
    s.setCity = function (event) {
      s.data.city = $.trim($(event.target).text());
    };
  
    // 推荐标签
    s.rectagNames = [
      '通讯数码',
      '家居生活',
      'O2O',
      '移动互联网',
      '电子商务',
      '在线教育',
      '影音娱乐',
      '互联网医疗',
      '互联网金融',
      '企业服务'
    ];
    // 判断某个标签是否为选中标签
    s.isSelected = function (tagname) {
      for (var i = 0; i < s.data.rectag.length; i++) {
        if (tagname == s.data.rectag[i]) {
          return true;
        }
      }
      return false;
    };
    // 选中一个推荐标签
    s.selectTags = function (event) {
      var tagname = $.trim($(event.target).text());
      if (s.isSelected(tagname)) {
        for (var i = 0, n = 0; i < s.data.rectag.length; i++) {
          if (s.data.rectag[i] != tagname) {
            s.data.rectag[n++] = s.data.rectag[i];
          }
        }
        s.data.rectag.length -= 1;
      } else if (s.data.rectag.length < 2) {
        s.data.rectag.push(tagname);
      } else {
        s.modal.show = true;
      }
    };
  
    // 模态框-错误提示
    s.modal = {
      show: false
    };
    s.switchModal = function (index) {
      s.modal.show = !s.modal.show;
    };

  }])
// 详细描述
  .controller('detailCtrl', ['$scope', '$http', function (s, h) {
    /*** 数据 ***/
    // 核心数据
    s.data = {
      video: "",
      text: [
        {
          type: 1,
          title: '请在这里输入段落的标题，可点击右侧“添加文本”添加多个！',
          content: '请在这里输入段落的正文，例如：介绍自己，介绍项目内容。为什么需要大家支持，项目进度等等!'
        },
        { type: 2 }
      ]
    };
    // 视频视图数据与临时核心数据
    s.video = {
      isEdit: true,
    }
    // 文本（与图像）视图数据
    s.isEdit = [false, false]
  
    // 载入草稿和验证
    s.$parent.getDraft('detail', function (draft) {
      $.extend(s, draft);
    });
    
    // 保存草稿数据到根作用域
    s.$parent.draft.detail = function () {
      var draft = {};
      draft.data = s.data;
      draft.video = s.video;
      draft.isEdit = s.isEdit;
      return angular.toJson(draft);
    };
  
    /*** 行为 ***/
    // 视频保存与取消（改变视图）
    s.videoSwitch = function () {
      s.data.video = s.video.isEdit ? s.video.temp : '';
      s.video.isEdit = !s.video.isEdit;
    };
    // 移动文本与图像
    s.move = function (index, direction) {
      // 0表示向上移动，1表示向下移动
      if (direction == 0) {
        // 已经是第一项
        if (index == 0) {
          return false;
        } else {
          // 存储arr[index-1]的值
          var prev = s.data.text[index - 1];
          var _prev = s.isEdit[index - 1];
          // 把arr[index]变成一个空项，把原arr[index]的值赋给arr[index-1]
          s.data.text[index - 1] = s.data.text.splice(index, 1, {})[0];
          s.isEdit[index - 1] = s.isEdit.splice(index, 1, {})[0];
          // 把原arr[index-1]的值赋给arr[index]，完成交换
          s.data.text[index] = prev;
          s.isEdit[index] = _prev;
        }
      } else if (direction == 1) {
        // 已经是最后一项
        if (index == (s.data.text.length - 1)) {
          return false;
        } else {
          var next = s.data.text[index + 1];
          var _next = s.isEdit[index + 1];
          s.data.text[index + 1] = s.data.text.splice(index, 1, {})[0];
          s.isEdit[index + 1] = s.isEdit.splice(index, 1, {})[0];
          s.data.text[index] = next;
          s.isEdit[index] = _next;
        }
      }
    };

    // 模态框-删除功能
    s.modal = {
      show: false
    };
    s.switchModal = function (index) {
      s.modal.show = !s.modal.show;
      // 存储要删除的项的下标
      s.modal.index = index ? index : null;
    };
    s.del = function () {
      // 删除一项回报
      s.data.text.splice(s.modal.index, 1);
      // 删除对应的视图数据
      s.isEdit.splice(s.modal.index, 1);
      s.modal.show = !s.modal.show;
    };

  }])
  .controller('paybackCtrl', ['$scope', '$http', function (s, h) {
    /*** 数据 ***/
    // 核心数据
    s.data = {
      hb: [{ type: 1 }]
    };
    // 视图数据
    s.isEdit = [true]
  
    // 载入草稿和验证
    s.$parent.getDraft('payback', function (draft) {
      $.extend(s, draft);
    });

    
    // 保存草稿数据到根作用域
    s.$parent.draft.payback = function () {
      var draft = {};
      draft.data = s.data;
      draft.isEdit = s.isEdit;
      return angular.toJson(draft);
    };
  
    /*** 行为 ***/
    // 移动
    s.move = function (index, direction) {
      // 0表示向上移动，1表示向下移动
      if (direction == 0) {
        // 已经是第一项
        if (index == 0) {
          return false;
        } else {
          // 存储arr[index-1]的值
          var prev = s.data.hb[index - 1];
          var _prev = s.isEdit[index - 1];
          // 把arr[index]变成一个空项，把原arr[index]的值赋给arr[index-1]
          s.data.hb[index - 1] = s.data.hb.splice(index, 1, {})[0];
          s.isEdit[index - 1] = s.isEdit.splice(index, 1, {})[0];
          // 把原arr[index-1]的值赋给arr[index]，完成交换
          s.data.hb[index] = prev;
          s.isEdit[index] = _prev;
        }
      } else if (direction == 1) {
        // 已经是最后一项
        if (index == (s.data.hb.length - 1)) {
          return false;
        } else {
          var next = s.data.hb[index + 1];
          var _next = s.isEdit[index + 1];
          s.data.hb[index + 1] = s.data.hb.splice(index, 1, {})[0];
          s.isEdit[index + 1] = s.isEdit.splice(index, 1, {})[0];
          s.data.hb[index] = next;
          s.isEdit[index] = _next;
        }
      }
    };

    // 模态框-删除功能
    s.modal = {
      show: false
    };
    s.switchModal = function (index) {
      s.modal.show = !s.modal.show;
      // 存储要删除的项的下标
      s.modal.index = index ? index : null;
    };
    s.del = function () {
      // 删除一项回报
      s.data.hb.splice(s.modal.index, 1);
      // 删除对应的视图数据
      s.isEdit.splice(s.modal.index, 1);
      s.modal.show = !s.modal.show;
      setTimeout(function () {
        s.$parent.setValid('return', true);
      });
    };

  }])
  .controller('previewCtrl', ['$scope', '$http', '$location', function (s, h, $location) {
    s.project = {
      // data: {
      //   rectag: [],
      //   diytag: []
      // }
    };
    s.detail = {};
    s.payback = {};
    
    // 用来把标识类型的数字转换成对应的类型
    s.zstype = ['', '', '', '公益', '科技', '工业', '农业', '家电', '设计', '娱乐', '出版', '房产', '其它']

    s.loadPreview = function () {
      var mainmark = $location.search().id;
      h.post('/AppDraft/GetSubs', {
        mainmark: mainmark,
        type: 'crowdfunding'
      }).success(function (data) {
        $(data.result).each(function () {
          var minor = $(this)[0].minor;
          $.extend(s[minor], $(this)[0].content);

          switch (minor) {
            case 'basic':
              var ptid = $(this)[0].content.showPersonal ? $(this)[0].content.dataP.ptid : $(this)[0].content.dataC.ptid;
              s.ptid = s.zstype[ptid]
              break;
            case 'project':
              if (s.project.data.diytag) {
                s.project.data.diytag = s.project.data.diytag.split(' ');
              }
              break;
          }

        })
      });
    } ();
  }])
  //黄文明 2015-12-18 发布详细页面
.controller('list_detailCtrl', ['$scope', '$http','$location', function ($scope, $http , $location){
    var id = $location.search().id;
    var loaddata = function(){
        $http.post('/CpzcList/List_Detail',{id:id}).success(function(d){
            if (d.success){
            $scope.detail={
                 data:{text:d.result.project.text,                  
                       video:d.result.project.video
                        }};
            $scope.project={
                 data: {city:d.result.project.city ,
                        daysum:d.result.project.daysum ,
                        diytag:d.result.project.diytag,
                        frontpic:d.result.project.frontpic,
                        money:d.result.project.money,
                        province:d.result.project.province,
                        purpose:d.result.project.purpose,
                        rectag:d.result.project.rectag,
                        title:d.result.project.title
                        }};
            $scope.payback={
                  data:{ hb:d.result.payback}};
               }
        $scope.ptid=d.result.project.ptid;
         }); 
    };
    loaddata();
}])

//黄文明 2015-12-26 个人中心  众筹  支持列表
  .controller('zctzlistCtrl', ["$scope", "$http", function ($scope, $http) {
    //分页相关参数 
    $scope.page = { pageSize: 10, pageIndex: 1, total: 0 };
    $scope.loaddata = function (i) {
      if (!!i) $scope.page.pageIndex = i;
      //获取Json数据，根据参数设置值
      $http.post('/CpzcTzList/List', $.extend({}, $scope.page, $scope.qrydata)).success(function (d) {
        if (d.success) {
          $scope.list = d.result.data;
          $scope.page.total = d.result.total;
        }
      });
    };
    //加载数据
    $scope.loaddata(1);
  }]);