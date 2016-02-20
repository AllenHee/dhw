var app = angular.module('resumeApp', ['ui.router', 'baseapp']);

app.config(['$stateProvider', '$urlRouterProvider', function ($stateProvider, $urlRouterProvider) {
    $urlRouterProvider.otherwise('/');
    $stateProvider.state('main', { url: '/', templateUrl: dhw.gettplurl('detail.html'), controller: 'ResumeCtrl' })
    .state('preview', { url: '/preview', templateUrl: dhw.gettplurl('preview.html'), controller: 'ResumeCtrl' })
    .state('hire', { url: '/hire', templateUrl: dhw.gettplurl('zp-hire.html'), controller: 'HireCtrl' })
    .state('sczw-list', { url: '/list', templateUrl: dhw.gettplurl('sczw-list.html'), controller: 'sczwlistCtrl' })
    .state('jbzw-list', { url: '/jbzwlist', templateUrl: dhw.gettplurl('jbzw-list.html'), controller: 'jbzwlistCtrl' })
    .state('jbzw-detail', { url: '/detail/:id', templateUrl: dhw.gettplurl('jbzw-detail.html'), controller: 'jbzwdetailCtrl' })
    .state('tdjl-list', { url: '/tdjl-list', templateUrl: dhw.gettplurl('tdjl-list.html'), controller: 'tdjllistCtrl' })
    .state('yfb-list', { url: '/yfb-list', templateUrl: dhw.gettplurl('yfb-list.html'), controller: 'yfblistCtrl' })
    .state('yfb-detail', { url: '/yfb-detail', templateUrl: dhw.gettplurl('yfb-detail.html'), controller: 'yfbdetailCtrl' })
    .state('yfb-list_down', { url: '/yfb-list_down', templateUrl: dhw.gettplurl('yfb-list.html'), controller: 'yfblistCtrl' })
    .state('yfb-detail_down', { url: '/yfb-detail_down', templateUrl: dhw.gettplurl('yfb-detail.html'), controller: 'yfbdetailCtrl' })
    .state('td-list0', { url: '/td-list0', templateUrl: dhw.gettplurl('td-list.html'), controller: 'tdlistCtrl' })
    .state('td-list1', { url: '/td-list1', templateUrl: dhw.gettplurl('td-list.html'), controller: 'tdlistCtrl' })
    .state('td-list2', { url: '/td-list2', templateUrl: dhw.gettplurl('td-list.html'), controller: 'tdlistCtrl' })
    .state('td-list3', { url: '/td-list3', templateUrl: dhw.gettplurl('td-list.html'), controller: 'tdlistCtrl' })
    .state('td-list4', { url: '/td-list4', templateUrl: dhw.gettplurl('td-list.html'), controller: 'tdlistCtrl' })
    .state('td-preview-detail', { url: '/td-preview-detail', templateUrl: dhw.gettplurl('td-preview-detail.html'), controller: 'tdpreviewdetailCtrl' });
} ]);

// 发布简历
app.controller('ResumeCtrl', ['$scope', '$http', '$location', function (s, h, $location) {

    /** 数据交互 **/

    // 读取数据
    h.post('/HRFbjl/GetDetail').success(function (data) {
        // 取得简历ID
        s.resumeID = data.result.ent.resumeID;
        // 取得主表信息
        s.intentTemp.situation = data.result.ent.situation;

        var obj_names = [
      'infoTemp',
      'educations',
      'internships',
      'projects',
      'presentations',
      '',
      'evaluations',
      'usernameTemp',
      'userintroTemp',
      'expectations',
    ];

        var items = data.result.items;
        // 循环获取的数据
        for (var i = 0; i < items.length; i++) {
            //定义类型和内容
            var _type = items[i].type;
            var _content = items[i].content;
            // 把内容插入对应的对象或数组
            if (_type == 7) { // 技能评价
                s[obj_names[_type - 1]].push({});
                s.skills = _content[0].skill;
            } else { // 其它
                s[obj_names[_type - 1]] = _content;
            }

            // 根据类型，把应该显示的视图模块显示出来
            switch (_type) {
                case 1:
                    s.show.info = true;
                    break;
                case 4:
                case 5:
                case 7:
                case 10:
                    var obj_name = obj_names[_type - 1].substring(0, obj_names[_type - 1].length - 1);
                    s.show[obj_name] = true;
            }
        }



        // 简历完成百分比
        s.getPercentage();

        // 隐藏所有表单，显示所有展示
        setTimeout(function () {
            $('.rsm_form').hide();
            $('.rsm_result').show();
        });


    });

    // 存储数据
    s.setData = function (boxID) {
        var para = {};
        para.resumeID = s.resumeID;
        // 保存数据
        if (boxID == 'intent') {
            para.situation = s.intentTemp.situation;
            $.post('/HRFbjl/SaveDetail', para, function () {
            });
        } else {
            para.type = parseInt(s[boxID].type);
            para.content = s[boxID].content;
            $.post('/HRFbjl/SaveDetailSub', para, function () {
            });
        }
    }


    /** 通用 **/

    // 用来知道当前的盒子是哪个盒子的方法
    function whichBox(elem) {
        var box = elem.parents('.rsmM_box');
        return box.attr('id');
    }

    // 添加
    s.add = function (event) {
        var boxID = whichBox($(event.target));
        // 添加一项
        s[boxID + 's'].push({});
        // 使添加按钮无效
        $('#' + boxID).find('.rsmM_box_ttl_r').attr('disabled', 'disabled');
    };

    // 编辑
    s.temp = { orignal: true };
    s.edit = function (event, index) {
        var boxID = whichBox($(event.target));

        // 找到当前盒子的展示部分和表单部分
        var box;
        if ($(event.target).is('.outerEdit')) {
            box = $(event.target).parents('.rsmM_box');
        } else {
            box = $(event.target).parents('.rsm_template');
        }
        box.find('.rsm_result').hide();
        box.find('.rsm_form').show();

        if (index < 0) {
            for (var prop in s[boxID + 'Temp']) {
                s.temp[prop] = s[boxID + 'Temp'][prop];
            }
        } else {
            // 把s[boxID+'s'][index]的当前值存储在s.temp
            for (var prop in s[boxID + 's'][index]) {
                s.temp[prop] = s[boxID + 's'][index][prop];
            }
        }
        s.temp.orignal = false;
    };

    // 保存
    s.save = function (event, index) {
        var boxID = whichBox($(event.target));

        // 判断触发事件的是否是保存按钮
        var isSave = $(event.target).is('.hl');
        // 取得相关元素
        var box = $(event.target).parents('.rsm_template');
        var result = box.find('.rsm_result');
        var form = box.find('.rsm_form');

        if (isSave) {// 保存按钮
            // 简历完成百分比
            s.getPercentage();
            // 存储数据
            s[boxID].content = angular.toJson((index < 0) ? s[boxID + 'Temp'] : s[boxID + 's']);
            s.setData(boxID);
            // 改变视图
            form.hide();
            result.show();
        } else {// 取消按钮
            if (!(index < 0) && s.temp.orignal) {// 新创建的数组型表单，减去数组一个项，自动转换视图
                s[boxID + 's'].splice(index, 1);
            } else {// 其它
                // 把保存在s.temp里的临时值赋回给s[boxID+'s'][index]
                for (var prop in s.temp) {
                    (index < 0) ?
            s[boxID + 'Temp'][prop] = s.temp[prop]
            :
            s[boxID + 's'][index][prop] = s.temp[prop];
                }
                // 改变视图
                form.hide();
                result.show();
            }
        }
        // 把s.temp重置回默认值
        s.temp = { orignal: true };
        // 使添加按钮生效
        $('#' + boxID).find('.rsmM_box_ttl_r').prop('disabled', false);
    };

    // 保存求职意向（主表）
    s.intentSave = function () {
        var para = {};
        para.resumeID = s.resumeID;
        para.situation = s.intentTemp.situation;
        $.post('/HRFbjl/SaveDetail', para, function () {
        })
    }

    // 删除
    s.del = function (event) {
        $(event.target).next().show();
        return false;
    };
    // 确认删除
    s.delConfirm = function (event, index) {
        var boxID = whichBox($(event.target));
        s[boxID + 's'].splice(index, 1);
        // 如果是技能评价 把skills数组恢复默认状态
        if (boxID == 'evaluation') {
            s.skills = [{}];
        }
        // 存储数据
        s[boxID].content = angular.toJson((index < 0) ? s[boxID + 'Temp'] : s[boxID + 's']);
        s.setData(boxID);
    };
    // 右边栏删除
    s.delSider = function (rsmArray, typeNum) {
        s[rsmArray] = [];
        // 如果是技能评价，把skills数组恢复默认状态
        if (rsmArray = 'evaluations') {
            s.skills = [{}];
        }
        // 存储数据
        var para = {};
        para.resumeID = s.resumeID;
        para.type = typeNum;
        $.post('/HRFbjl/DelDetailSub', para, function () {
        });
    };
    // 编辑时，清空输入框里的名字和介绍的默认值
    s.delDflt = function (prop, text) {
        var boxID = whichBox($(event.target));
        if (s[boxID + 'Temp'][prop] == text) {
            s[boxID + 'Temp'][prop] = '';
        }
    };


    /** 定义各个盒子的数据 **/
    // 盒子显示与隐藏
    s.show = {
        'info': false,
        'project': false,
        'presentation': false,
        'expectation': false,
        'evaluation': false
    };
    // 名字
    s.username = {
        'type': 8
    };
    s.usernameTemp = {
        'name': '请输入姓名'
    };
    // 介绍
    s.userintro = {
        'type': 9
    };
    s.userintroTemp = {
        'intro': '请介绍你自己'
    };
    // 基本信息
    s.info = {
        'type': 1
    };
    s.infoTemp = {};
    // 实习经历
    s.internship = {
        'type': 3
    };
    s.internships = [];
    // 教育经历
    s.education = {
        'type': 2
    };
    s.educations = [];
    // 项目经验
    s.project = {
        'type': 4
    };
    s.projects = [];
    // 自我描述
    s.presentation = {
        'type': 5
    };
    s.presentations = [];
    // 期望工作
    s.expectation = {
        'type': 10
    };
    s.expectations = [];
    // 技能评价
    s.evaluation = {
        'type': 7
    };
    s.evaluations = [];
    s.skills = [{}];
    s.skillAdd = function () {
        s.skills.push({});
    }
    s.skillDel = function (index) {
        if (index == 0) {
            s.evaluations = [];
            s.skills = [{}];
        } else {
            s.skills.splice(index, 1);
        }
    }
    // 求职意向
    s.intentTemp = {
        'situation': '我目前已离职，可快速到岗'
    };

    /** 简历完成度 **/
    s.percentage;
    s.getPercentage = function () {
        var per = 0;
        if (s.usernameTemp.name != '请输入姓名') per += 6;
        if (s.userintroTemp.intro != '请介绍你自己') per += 6;
        for (var prop in s.infoTemp) {
            if (s.infoTemp != {}) per += 2;
        }
        if (s.internships.length != 0) per += 12;
        if (s.educations.length != 0) per += 12;
        if (s.projects.length != 0) per += 12;
        if (s.presentations.length != 0) per += 12;
        if (s.expectations.length != 0) per += 12;
        if (s.evaluations.length != 0) per += 12;
        s.percentage = per;
    }
    s.getPercentage();


    /** 下拉控件 **/
    // 时间内数据
    s.date = {
        today: function () {
            var date = new Date();
            var temp = {};
            temp.year = date.getFullYear();
            temp.month = date.getMonth() + 1;
            return temp;
        },
        wokrYear: function () {
            var year = [];
            var startYear = s.date.today().year - 26;
            for (var i = startYear; i < s.date.today().year + 1; i++) {
                year[i - startYear] = i;
            }
            return year;
        },
        birthYear: function () {
            var year = [];
            var startYear = s.date.today().year - 45;
            for (var i = startYear; i < s.date.today().year - 15; i++) {
                year[i - startYear] = i;
            }
            return year;
        },
        gradYear: function () {
            var year = [];
            var startYear = s.date.today().year - 26;
            for (var i = startYear; i < s.date.today().year + 3; i++) {
                year[i - startYear] = i;
            }
            return year;
        },
        month: ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12']
    };
    // 其它数据
    s.listData = {
        // 最高学历
        degree: ['大专', '本科', '硕士', '博士', '其它'],
        // 工作年限
        experience: ['应届毕业生', '1年', '2年', '3年', '4年', '5年', '6年', '7年', '8年', '9年', '10年', '10年以上'],
        // 工作性质
        nature: ['全职', '兼职', '实习'],
        // 期望月薪
        salary: ['2k以下', '2k-5k', '5k-10k', '10k-15k', '15k-25k', '25k-50k', '50k以上'],
        // 技能评价
        level: ['了解', '熟悉', '掌握', '精通', '专家'],
        // 求职意向
        intent: ['我目前已离职，可快速到岗', '我目前正在职，正考虑换个新环境', '我暂时不想找工作', '我是应届毕业生'],
        // 省份
        provs: [],
        // 城市，默认为热门城市
        citys: ['北京', '上海', '广州', '深圳', '杭州', '成都', '西安', '南京', '厦门', '武汉'],
        getCitys: function (prov) {
            switch (prov) {
                // 热门城市                                                                                                   
                case '热门城市':
                    s.listData.citys = ['北京', '上海', '广州', '深圳', '杭州', '成都', '西安', '南京', '厦门', '武汉'];
                    break
                    // 如果是直辖市，不显示市下面具体的区
                case '北京':
                case '天津':
                case '上海':
                case '重庆':
                    s.listData.citys = [prov + "市"];
                    break;
                // 如果是一般省份，取得省下的城市                                                                                                   
                default:
                    for (var prop in _areaselect_data.c) {
                        if (prop.indexOf(prov) >= 0) {
                            s.listData.citys = _areaselect_data.c[prop];
                        }
                    }
                    break;
            }
        }
    }
    // 取得省份，即给s.listData.provs赋值
    s.getProvs = function () {
        s.listData.provs = _areaselect_data.p.map(function (value) {
            if (value.indexOf('黑龙江') >= 0) {
                return value.substring(0, 3);
            }
            return value.substring(0, 2);
        })
    } ();

    // 下拉控件数据操作
    s.selectData = function (event, prop, index) {
        var elem = $(event.target) // 相当于this
        var boxID = whichBox(elem);
        var select_box = elem.parents('.rsm_select');

        var isCalender = elem.parent().is('.rsm_select_list-month');
        var isSkill = elem.is('.skill');

        var data;
        if (isCalender) {
            var left = select_box.find('.rsm_select_list-left .active').text();
            var right = elem.text();
            data = left + '.' + right;
        } else {
            data = elem.text();
        }

        if (isSkill) {
            s.skills[index].level = data;
            s.evaluations[0].skill = s.skills;
        } else {
            (index < 0) ? (s[boxID + 'Temp'][prop] = data) : (s[boxID + 's'][index][prop] = data);
        }

    };

    /** 性别选择 **/
    s.selectGerder = function (event) {
        elem = ($(event.target).is('i')) ? $(event.target).parent() : $(event.target);
        var gender = $(elem).text();
        $('.formInfo_gender').val(gender);
        s.infoTemp.gender = gender;
    };
    s.JobID = $location.search().JobID;
    s.table = $location.search().table;
    // var JobID = $location.search().JobID;
    s.tzcg = function () {
        $.post('/HRDelivery/Delivery', { JobID: s.JobID, ResumeID: s.resumeID });
    }

} ])

//2015-12-7 郑玉云 个人中心 服务 人才 收藏职位列表页面
  .controller('sczwlistCtrl', ['$scope', '$http', function ($scope, $http) {
      //分页相关参数 
      $scope.page = { pageSize: 10, pageIndex: 1, total: 0 };
      $scope.loaddata = function (i) {
          if (!!i) $scope.page.pageIndex = i;
          //获取Json数据，根据参数设置值
          $http.post('/HRSczw/List', $.extend({}, $scope.page, $scope.qrydata)).success(function (d) {
              if (d.success) {
                  $scope.list = d.result.data;
                  $scope.page.total = d.result.total;
              }
          });
      };
      //加载数据
      $scope.loaddata(1);
      //取消收藏
      $scope.save = function (jobid, type) {
          $.post('/HRSczw/Qxsc', { jobid: jobid, type: type });
          $scope.loaddata(1);
      }
  } ])

//2015-12-7 郑玉云 个人中心 服务 人才 举报职位列表页面
  .controller('jbzwlistCtrl', ['$scope', '$http', function ($scope, $http) {
      //分页相关参数 
      $scope.page = { pageSize: 10, pageIndex: 1, total: 0 };
      $scope.loaddata = function (i) {
          if (!!i) $scope.page.pageIndex = i;
          //获取Json数据，根据参数设置值
          $http.post('/HRJbzw/List', $.extend({}, $scope.page, $scope.qrydata)).success(function (d) {
              if (d.success) {
                  $scope.list = d.result.data;
                  $scope.page.total = d.result.total;
              }
          });
      };
      //加载数据
      $scope.loaddata(1);
  } ])

//2015-12-7 郑玉云 个人中心 服务 人才 举报职位详细页面
  .controller('jbzwdetailCtrl', ['$scope', '$http', '$stateParams', function ($scope, $http, $stateParams) {/*私人订制详细*/
      var id = $stateParams.id;
      //初始化查询
      var loaddata = function () {
          //获取Json数据，根据参数设置值
          $http.post('/HRJbzw/Detail', { jobid: id }).success(function (d) {
              if (d.success) {
                  $scope.qk = d.result.qk;
                  $scope.cljg = d.result.cljg;
              }
          });
      };
      //加载数据
      loaddata();
  } ])

//2015-12-7 郑玉云 个人中心 服务 人才 已投简历列表
  .controller('tdjllistCtrl', ['$scope', '$http', function ($scope, $http) {
      //分页相关参数 
      $scope.page = { pageSize: 10, pageIndex: 1, total: 0 };
      $scope.loaddata = function (i) {
          if (!!i) $scope.page.pageIndex = i;
          //获取Json数据，根据参数设置值
          $http.post('/HRTdjl/List', $.extend({}, $scope.page, $scope.qrydata)).success(function (d) {
              if (d.success) {
                  $scope.list = d.result.data;
                  $scope.page.total = d.result.total;
              }
          });
      };
      //加载数据
      $scope.loaddata(1);
  } ]).
// 发布招聘
  controller('HireCtrl', ['$scope', '$http', function (s, h) {
      s.data = {};

      s.xueli = ['不限', '大专', '本科', '硕士', '博士'];
      s.jingyan = ['不限', '应届毕业生', '一年以下', '1-3年', '3-5年', '5-10年', '10年以上'];
      s.money = ['不限', '2k以下', '2k-5k', '5k-10k', '10k-15k', '15k-25k', '25k-50k', '50k以上'];
      s.xingzhi = ['不限', '全职', '兼职', '实习'];
      s.hangye = [];

      // 取得行业名称和ID
      h.post('/HRZpxxFb/Tradeinfo').success(function (data) {
          s.hangye = data.result;
      });

      s.select = function (event, prop, id) {
          var selected = $(event.target).text();
          // if (selected == "不限") {
          //   selected = "";
          // }
          s.data[prop] = selected;

          // 行业ID
          if (id) {
              s.data.dtid = id;
          }
      };

      s.submit = function () {
          var para = $.extend({}, s.data);
          for (var prop in para) {
              if (para[prop] == '不限') {
                  para[prop] = '';
              }
          }
          para.Dtid = s.dtmc.id;
          para.Dtmc = s.dtmc.text;
          $.post("/HRZpxxFb/InfoFb", para).success(function () {
              //陈磊 2015-12-23 修改成功发布跳转列表页面
              window.location.href = '#/yfb-list';
          });
      };
  } ])

//2015-12-22 陈磊 个人中心 人才招聘 已发布的招聘
  .controller('yfblistCtrl', ['$scope', '$http', '$location', function ($scope, $http, $location) {
      var path = $location.path();
      $scope.downpage = false;
      //分页相关参数 
      $scope.page = { pageSize: 10, pageIndex: 1, total: 0 };
      if (path == "/yfb-list_down") {
          $scope.qrydata = { state: 255 };
          $scope.downpage = true;
      }
      else {
          $scope.qrydata = { state: 1 };
      }
      $scope.loaddata = function (i) {
          if (!!i) $scope.page.pageIndex = i;
          //获取Json数据，根据参数设置值
          $http.post('/HRZpcx/List', $.extend({}, $scope.page, $scope.qrydata)).success(function (d) {
              if (d.success) {
                  $scope.list = d.result.data;
                  $scope.page.total = d.result.total;
              }
          });
      };

      $scope.del = function (id) {
          $http.post('/HRZpcx/Del', { id: id }).success(function (d) {
              $scope.loaddata(1);
          });
      }

      //加载数据
      $scope.loaddata(1);

  } ])

//2015-12-22 陈磊 个人中心 人才招聘 已发布的详细招聘信息
  .controller('yfbdetailCtrl', ['$scope', '$http', '$location', function ($scope, $http, $location) {
      var path = $location.path();
      if (path == "/yfb-detail_down") {
          $scope.downpage = true;
      }
      else {
          $scope.downpage = false;
      }
      var id = $location.search().id;

      //初始化获取数据状态,获取未绑定数据
      var loaddata = function () {
          $http.post('/HRZpcx/Detail', { id: id }).success(function (d) {
              if (d.success) {
                  $scope.data = d.result;
              }
          });
      };
      //加载数据
      loaddata();

  } ])

//黄文明 2015-12-24  查看收到的投递简历
  .controller('tdlistCtrl', ['$scope', '$http', '$location', function ($scope, $http, $location) {
      var path = $location.path();
      $scope.downpage = false;
      if (path == "/td-list0") {
          $scope.qrydata = { state: 0 };
          $scope.downpage = true;
      }
      else if (path == "/td-list1") {
          $scope.qrydata = { state: 1 };
          $scope.downpage = true;
      }
      else if (path == "/td-list2") {
          $scope.qrydata = { state: 2 };
          $scope.downpage = true;
      }
      else if (path == "/td-list3") {
          $scope.qrydata = { state: 3 };
          $scope.downpage = true;
      }
      else if (path == "/td-list4") {
          $scope.qrydata = { state: 4 };
          $scope.downpage = true;
      }
      //分页相关参数 
      $scope.page = { pageSize: 10, pageIndex: 1, total: 0 };
      $scope.loaddata = function (i) {
          if (!!i) $scope.page.pageIndex = i;
          //获取Json数据，根据参数设置值
          $http.post('/HRDelivery/DeliveryList', $.extend({}, $scope.page, $scope.qrydata)).success(function (d) {
              if (d.success) {
                  $scope.list = d.result.data;
                  $scope.page.total = d.result.total;
              }
          });
      };
      //加载数据
      $scope.loaddata(1);
      $scope.yck = function (JobID, tdUserID, statemc) {
          if (statemc < 1) {
              $.post('/HRDelivery/DeliveryEdit', { JobID: JobID, state: 1, tdUserID: tdUserID });
          }
      }
      $scope.tzms = function (JobID, tdUserID) {
          $.post('/HRDelivery/DeliveryReply', { JobID: JobID, state: 3, tdUserID: tdUserID });
      }
  } ])

//黄文明 2015-12-25 投递简历详细信息 
  .controller('tdpreviewdetailCtrl', ['$scope', '$http', '$location', function ($scope, $http, $location) {
      $scope.show = {};
      var obj_names = [
      'infoTemp',
      'educations',
      'internships',
      'projects',
      'presentations',
      '',
      'evaluations',
      'usernameTemp',
      'userintroTemp',
      'expectations'
    ];
      var JobID = $location.search().JobID;
      var tdUserID = $location.search().tdUserID;
      $scope.statemc = $location.search().statemc;
      //初始化获取数据状态,获取未绑定数据
      var loaddata = function () {
          $http.post('/HRDelivery/DeliveryDetail', { tdUserID: tdUserID, JobID: JobID }).success(function (d) {
              if (d.success) {
                  $scope.data = d.result.content.root.resume;
                  for (var i = 0; i < $scope.data.length; i++) {
                      switch ($scope.data[i].TypeID) {
                          case "1":
                              $scope.infoTemp = $scope.data[i].Content.root.data;
                              $scope.show.info = true;
                              break;
                          case "2":
                              $scope.educations = $scope.data[i].Content.root.data;
                              break;
                          case "3":
                              $scope.internships = $scope.data[i].Content.root.data;
                              break;
                          case "4":
                              $scope.projects = $scope.data[i].Content.root.data;
                              $scope.show.projects = true;
                              break;
                          case "5":
                              $scope.presentations = $scope.data[i].Content.root.data;
                              $scope.show.presentations = true;
                              break;
                          case "7":
                              $scope.evaluations = $scope.data[i].Content.root.data;
                              $scope.show.evaluations = true;
                              break;
                          case "8":
                              $scope.usernameTemp = $scope.data[i].Content.root.data;
                              break;
                          case "9":
                              $scope.userintroTemp = $scope.data[i].Content.root.data;
                              break;
                          case "10":
                              $scope.expectations = $scope.data[i].Content.root.data;
                              $scope.show.expectations = true;
                              break;
                      }
                  }
              }
          });
      };
      //加载数据
      loaddata();
      //0:投递成功
      //      $scope.tdcg = function (ResumeID) {
      //          $.post('/HRDelivery/Delivery', { JobID: JobID, ResumeID: ResumeID, tdUserID: tdUserID });
      //      }
      //2:待沟通
      $scope.dgt = function () {
          $.post('/HRDelivery/DeliveryEdit', { JobID: JobID, state: 2, tdUserID: tdUserID });
      }
      //3：通知面试
      $scope.tzms = function () {
          $.post('/HRDelivery/DeliveryReply', { JobID: JobID, state: 3, tdUserID: tdUserID });
      }
      //4：不适合
      $scope.bhs = function () {
          $.post('/HRDelivery/DeliveryEdit', { JobID: JobID, state: 4, tdUserID: tdUserID });
      }
  } ]);