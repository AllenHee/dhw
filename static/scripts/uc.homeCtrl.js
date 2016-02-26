var app = angular.module("homeApp", ['ui.router', 'baseapp']);

app.config(['$stateProvider', '$urlRouterProvider', function ($stateProvider, $urlRouterProvider) {
  $urlRouterProvider.otherwise("/account");
  $stateProvider
    .state('account', {
      url: "/account",
      templateUrl: dhw.gettplurl('account.html'),
      controller: "accountCtrl"
    })
    .state('services', {
      url: '/services',
      templateUrl: dhw.gettplurl('services.html'),
      controller: "servicesCtrl"
    })
    .state('cases', {
      url: '/cases',
      templateUrl: dhw.gettplurl('cases.html'),
      controller: "casesCtrl"
    })
    .state('servers', {
      url: '/servers',
      templateUrl: dhw.gettplurl('server.html'),
      controller: "serversCtrl"
    })
    .state('serversList', {
      url: '/serversList',
      templateUrl: dhw.gettplurl('servers-list.html'),
      controller: "serversListCtrl"
    })
    .state('casesList', {
      url: '/caseslist',
      templateUrl: dhw.gettplurl('cases-list.html'),
      controller: "casesListCtrl"
    })
    .state('casesdetail', {
      url: '/casesdetail/:ccid',
      templateUrl: dhw.gettplurl('cases-detail.html'),
      controller: "casesCtrldetail"
    })
    .state('serversDetail', {
      url: '/serversDetail/:id',
      templateUrl: dhw.gettplurl('servers-detail.html'),
      controller: "serverDetailCtrl"
    })
    .state('album', {
      url: '/album/:type',
      templateUrl: dhw.gettplurl('album.html'),
      controller: "albumCtrl"
    })
    .state('link', {
      url: '/link',
      templateUrl: dhw.gettplurl('link.html'),
      controller: "linkCtrl"
    })
    .state('bannerDiy', {
      url: '/bannerDiy',
      templateUrl: dhw.gettplurl('bannerDiy.html'),
      controller: "bannerDiyCtrl"
    });
}])
  .controller('bannerDiyCtrl', ['$scope', '$http', function (s, h) {
    s.data = {
      themes: {}
    };
    h.post('/CompanyHomeEdit/TitleDetail').success(function (data) {
      s.data = data.result;
      if (s.data.themes === null) {
        s.data.themes = {}
      }
      s.data.themes = JSON.parse(s.data.themes);
    });
    // 取色器插件
    $('#picker').colpick({

      layout: 'hex',

      submit: 0,

      colorScheme: 'dark',

      onChange: function (hsb, hex, rgb, el, bySetColor) {

        $(el).css('border-color', '#' + hex);

        // Fill the text box just if the color was set using the picker, and not the colpickSetColor function.

        if (!bySetColor) $(el).val(hex);
        s.data.themes.themeColor = '#' + hex;
        s.$digest();
      }

    }).keyup(function () {

      $(this).colpickSetColor(this.value);
    });

    s.submit = function () {
      var para = $.extend(true, {}, s.data);
      para.themes = angular.toJson(para.themes);
      h.post('/CompanyHomeEdit/TitleSave', para).success(function () {
      })
    }

  }])
  .controller('casesCtrl', ['$scope', '$http', '$compile', '$location', function (s, h, c, l) {
    s.data = {};
    s.submit = function () {
      var para = $.extend({}, s.data);
      function close() {
        $(".modal_bg").fadeOut();
        $(".modal_cont").fadeOut();
      }
      $(".modal_cont_t_close").click(function () {
        close();
      });
      h.post('/CompanyHomeEdit/CaseAdd', para).success(function (data) {
        if (data.success) {
          $(".modal_cont_button_conf").click(function () {
            location.hash = '#/caseslist';
          });
          s.popupText = "3秒后自动返回,或点击确认返回";
          setTimeout(function () {
            location.hash = '#/caseslist';
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
  }])
  .controller('serversCtrl', ['$scope', '$http', '$compile', function (s, h, c) {
    s.data = {};
    s.typeids = [
      { id: 1, text: '设计' },
      { id: 2, text: '开发' },
      { id: 3, text: '文案' },
      { id: 4, text: '装修' },
      { id: 5, text: '营销' },
      { id: 6, text: '商务' },
      { id: 7, text: '生活' },
      { id: 8, text: '其他' }
    ]
    s.submit = function () {
      var para = $.extend({}, s.data);
      function close() {
        $(".modal_bg").fadeOut();
        $(".modal_cont").fadeOut();
      }
      $(".modal_cont_t_close").click(function () {
        close();
      });
      h.post('/CompanyHomeEdit/ServiceAdd', para).success(function (data) {
        if (data.success) {
          $(".modal_cont_button_conf").click(function () {
            location.hash = '#/serversList';
          });
          s.popupText = "3秒后自动返回,或点击确认返回";
          setTimeout(function () {
            location.hash = '#/serversList';
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
// 主控制器
  .controller("accountCtrl", ["$scope", "$http", '$compile', '$location', function (s, h, $compile, l) {
    
    // 当前显示哪个标签，默认为个人信息
    s.whichTab = 'personal';
    
    // 是不是企业版
    s.isCoporate = dhwtempvar.isCoporate;

    // 列表数据
    s.list = {
      provinces: _areaselect_data.p,
      citys: [],
      counties: [],
      trades: [],
      startYears: [],
      startMonths: ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12'],
    };
    
    // 取得公司行业
    h.post('/HRZpxxFb/Tradeinfo').success(function (data) {
      s.list.trades = data.result;
    });
    
    // 计算合法的起始年份
    (function () {
      var today = new Date();
      var thisYear = today.getFullYear();
      for (var i = thisYear - 50; i <= thisYear; i++) {
        s.list.startYears.push(i);
      }
    })();
    
    // 计算合法结束年份
    s.getEndYears = function (startYear) {
      var today = new Date();
      var thisYear = today.getFullYear();
      for (var arr = [], i = startYear; i <= thisYear; i++) {
        arr.push(i);
      }
      return arr;
    };
    // 计算合法结束月份
    s.getEndMonth = function (startYear, endYear, endYearTemp) {
      if (startYear && (endYear || endYearTemp)) {
        if (startYear == endYear) {
          for (var arr = [], i = parseInt(s.startMonth); i <= 12; i++) {
            arr.push(i < 10 ? '0' + i : i);
          }
          return arr;
        } else {
          return s.list.startMonths;
        }
      }
    };

    // 根据省份计算城市
    s.getCitys = function (prov) {
      if (prov.indexOf('市') > 0) {// 直辖市
        var arr = [];
        arr.push(prov);
        s.list.citys = arr;
      } else {
        s.list.citys = _areaselect_data.c[prov];
      }
      s.list.counties = [];
    };
    // 根据城市计算县
    s.getCounties = function (city) {
      if (city.split('-')[0] == city.split('-')[1]) {
        s.list.counties = _areaselect_data.c[city.split('-')[0]];
      } else {
        s.list.counties = _areaselect_data.a[city];
      }
    };
    
    // 重置表单
    s.resetForm = function (formName, pristineFormTemplate) {
      $(formName).empty().append($compile(pristineFormTemplate)(s));
    };

  }])
// 个人信息
  .controller('personalCtrl', ["$scope", "$http", function (s, h) {
    s.data = {};

    s.list = {
      educations: ['大专', '本科', '硕士', '博士']
    }
    
    // 取得数据
    h.post('/UserAccount/Detail').success(function (data) {
      $.extend(s.data, data.result);
    });


    s.submit = function () {
      var para = $.extend({}, s.data);
      // para.dpid = s.thiPosition.id;
      // para.dpname = s.thiPosition.text;
      h.post('/UserAccount/Edit', para).success(function () {
      })
    };

  }])
  
// 个人头像
  .controller('avatarCtrl', ["$scope", '$http', function (s, h) {
    s.data = {
      x: 0,
      y: 0,
      w: 192,
      h: 192
    };
    h.post('/UserAccount/Img').success(function (data) {
      s.avatar = data.result.logo;
    })

    $(function () {
      $('#avatarImg').Jcrop({
        allowSelect: true,
        allowMove: true,
        allowResize: true,
        onChange: showPreview,
        onSelect: showPreview,
        aspectRatio: 1
      });

      function showPreview(coords) {
        s.data.x = coords.x;
        s.data.y = coords.y;
        s.data.w = coords.h;
        s.data.h = coords.w;
        var rx = 100 / coords.w;
        var ry = 100 / coords.h;

        $('#preview').css({
          width: Math.round(rx * 600) + 'px',
          height: Math.round(ry * 600) + 'px',
          marginLeft: '-' + Math.round(rx * coords.x) + 'px',
          marginTop: '-' + Math.round(ry * coords.y) + 'px'
        });
      }

    });
    
    s.$watch('data.logo', function(oldValue, newValue) {
      var url = dhw.imgurl + s.data.logo + '_600x600' + '.jpg'
      if (s.data.logo) {
        $('.jcrop-holder').find('img').attr('ng-src', url);
        $('.jcrop-holder').find('img').attr('src', url);
      }
    })

    s.submit = function () {
      var params = $.extend({}, s.data);
      params.logo = params.logo + '_600x600';
      params.t = '100x100'
      params.action = 'cut';
      $.post(dhw.imgcuturl, params, function (data) {
        s.$apply(function () {
          s.avatar = data.path + '100x100.jpg';
          s.data.logo = '';
        });
        h.post('/UserAccount/ImgEdit', { logo: s.avatar }).success(function () {
        })
      }, 'json');
    }
  }])
// 公司信息
  .controller('corporateCtrl', ["$scope", "$http", function (s, h) {
    s.data = {};
    s.draft = {};
    // 列表数据
    s.list = {
      natures: ['政府机关/事业单位', '国营', '私营', '中外合资', '外资', '其他'],
      scales: ['5-10人', '10-50人', '50-100人', '100-200人', '200人以上']
    };
    
    // 取得数据
    s.getDraft = function(fn){
       h.post('/UserAccount/Company').success(function (data) { 
        fn(data.result.area);
        if(data.result.business) {
          s.businessTemp = angular.fromJson(data.result.business);
        }
        if(data.result.fuli) {
           s.data.fuli = data.result.fuli;
        }
        $.extend(s.data,data.result)
      })
    }
    // 添加业务范围
    s.businessTemp = [];
    s.addBusiness = function () {
      s.businessTemp.push({});
    };
    //手机号码是否可见
    s.isVisible = function (elem) {
      if ($(elem).is(':checked')) {
        s.data.phonevisible = true;
      } else {
        s.data.phonevisible = false;
      }
    }
    
    // 保存数据
    s.submit = function () {
     var content = s.draft.basic();
     console.log("福利哦"+s.data.fuli);
     var a = s.data.fuli;
     var con = a.replace(/，/,',')
     console.log("222  "+con);
     var para = $.extend(s.data,content);
      para.business = [];
      for (var i = 0, len = s.businessTemp.length; i < len; i++) {
        para.business.push(s.businessTemp[i]);
      }
      para.business = angular.toJson(para.business);
      //数据提交到后台
      h.post('/UserAccount/CompanyEdit', para).success(function (d) {
        if(d.success) {
          console.log("我已经提交成功呢啊")
        }
      });
    }
    
  }])
// 教育经历
  .controller('educationCtrl', ["$scope", "$http", function (s, h) {
    s.data = [];
    s.temp = {};
    
    //原始表单
    var pristineFormTemplate = $('#educationForm').html();
    
    //开始与结束日期
    s.dateTemp = {};
    
    //合法的结束年、月
    s.list = {
      endYears: [],
      endMonths: []
    };
    s.setEndYears = function () {
      s.list.endYears = s.getEndYears(s.dateTemp.startYear);
    };
    s.setEndMonths = function () {
      s.list.endMonths = s.getEndMonth(s.dateTemp.startMonth, s.dateTemp.endYear, s.endYearTemp);
    };
    
    // 修改的是哪一项
    s.index;
    
    // 获取经历列表
    h.post("/UserAccount/EduList").success(function (data) {
      s.data = data.result;
    });
    
    // 读取修改项
    s.modify = function (id, index) {
      s.index = index;

      h.post("/UserAccount/Eduinfo", { id: id }).success(function (data) {
        s.temp = $.extend({}, data.result);

        var beginDate = data.result.begindate.split("-");
        s.dateTemp.startYear = beginDate[0];
        s.dateTemp.startMonth = beginDate[1];

        var endDate = data.result.enddate.split("-");
        s.endYearTemp = endDate[0];

        s.setEndYears();
        s.setEndMonths();

        setTimeout(function () {
          s.$apply(function () {
            $.extend(s.dateTemp, { endYear: endDate[0], endMonth: endDate[1] })
          });
        });

        s.endYearTemp = undefined;
      });
    };
    
    // 删除
    s.del = function (index, id) {
      h.post("/UserAccount/EduDel", { id: id }).success(function () {
        s.data.splice(index, 1);
      })
    };
    
    // 新增或修改
    s.save = function () {
      s.temp.begindate = s.dateTemp.startYear + "-" + s.dateTemp.startMonth;
      s.temp.enddate = s.dateTemp.endYear + "-" + s.dateTemp.endMonth;
      var para = $.extend({}, s.temp);

      var api;

      if (s.index) {//修改
        s.data[s.index] = $.extend({}, s.temp);
        s.index = undefined;
        api = '/UserAccount/EduEdit';
      } else {//新增
        s.data.push(s.temp);
        api = '/UserAccount/EduAdd';
      }

      h.post(api, para).success(function () {
        s.temp = {};
        s.dateTemp = {};
        s.resetForm('#educationForm', pristineFormTemplate);
      });

    };

    // 至今
    s.getToday = function (event) {
      var elem = event.target;
      if ($(elem).is(":checked")) {
        var today = new Date();
        s.endDateTemp = {
          endYear: s.dateTemp.endYear,
          endMonth: s.dateTemp.endMonth
        }
        s.dateTemp.endYear = today.getFullYear();
        s.dateTemp.endMonth = today.getMonth() + 1;
      } else {
        $.extend(s.dateTemp, s.endDateTemp);
      }
    };

  }])
// 工作经历
  .controller('experienceCtrl', ["$scope", "$http", function (s, h) {
    s.data = [];
    s.temp = {};
    
    //原始表单
    var pristineFormTemplate = $('#experienceForm').html();
    
    //开始与结束日期
    s.dateTemp = {};
    
    //合法的结束年、月
    s.list = {
      endYears: [],
      endMonths: []
    };
    s.setEndYears = function () {
      s.list.endYears = s.getEndYears(s.dateTemp.startYear);
    };
    s.setEndMonths = function () {
      s.list.endMonths = s.getEndMonth(s.dateTemp.startMonth, s.dateTemp.endYear, s.endYearTemp);
    };
    
    // 修改的是哪一项
    s.index;
    
    // 获取经历列表
    h.post("/UserAccount/GzjlList").success(function (data) {
      s.data = data.result;
    });
    
    
    // 读取修改项
    s.modify = function (id, index) {
      s.index = index;

      h.post("/UserAccount/Gzjl", { id: id }).success(function (data) {
        s.temp = $.extend({}, data.result);

        var beginDate = data.result.begindate.split("-");
        s.dateTemp.startYear = beginDate[0];
        s.dateTemp.startMonth = beginDate[1];

        var endDate = data.result.enddate.split("-");
        s.endYearTemp = endDate[0];

        s.setEndYears();
        s.setEndMonths();

        setTimeout(function () {
          s.$apply(function () {
            $.extend(s.dateTemp, { endYear: endDate[0], endMonth: endDate[1] })
          });
        });

        s.endYearTemp = undefined;
      });
    };
    
    // 删除
    s.del = function (id, index) {
      h.post("/UserAccount/GzjlDel", { id: id }).success(function () {
        s.data.splice(index, 1);
      });
    };
    
    // 新增或修改
    s.save = function () {
      s.temp.begindate = s.dateTemp.startYear + "-" + s.dateTemp.startMonth;
      s.temp.enddate = s.dateTemp.endYear + "-" + s.dateTemp.endMonth;
      var para = $.extend({}, s.temp);

      var api;

      if (s.index) {//修改
        s.data[s.index] = $.extend({}, s.temp);
        s.index = undefined;
        api = '/UserAccount/GzjlEdit';
      } else {//新增
        s.data.push(s.temp);
        api = '/UserAccount/GzjlAdd';
      }

      h.post(api, para).success(function () {
        s.temp = {};
        s.dateTemp = {};
        s.resetForm('#experienceForm', pristineFormTemplate);
      });

    };
    
    // 至今
    s.getToday = function (event) {
      var elem = event.target;
      if ($(elem).is(":checked")) {
        var today = new Date();
        s.endDateTemp = {
          endYear: s.dateTemp.endYear,
          endMonth: s.dateTemp.endMonth
        }
        s.dateTemp.endYear = today.getFullYear();
        s.dateTemp.endMonth = today.getMonth() + 1;
      } else {
        $.extend(s.dateTemp, s.endDateTemp);
      }
    };

  }])
  .controller('servicesCtrl', ["$scope", "$http", function (s, h) {

    s.data = {};
    s.submit = function () {
      // console.log(s.data);
    }

  }])
  .controller('serversListCtrl', ['$scope', '$http', function (s, h) {
    s.page = { pageSize: 10, pageIndex: 1, total: 0, typrid: '' };
    s.loaddata = function (i) {
      if (!!i) s.page.pageIndex = i;
      //获取Json数据，根据参数设置值
      h.post('/CompanyHomeEdit/ServicrList', $.extend({}, s.page, s.qrydata)).success(function (d) {
        if (d.success) {
          s.list = d.result.data;
          s.page.total = d.result.total;
        }
      });
    }
    //加载数据
    s.loaddata(1);

    s.remove = function (id, index) {
      h.post('/CompanyHomeEdit/ServiceDel', { id: id }).success(function () {
        s.list.splice(index, 1);
      })
    }

  }]).controller('casesListCtrl', ["$scope", "$http", function (s, h) {
    s.para = {
      pageIndex: 1,
      pageSize: 5
    };
    s.list = [];
    s.loaddata = function (i) {
      if (!!i) s.para.pageIndex = i;
      h.post("/CompanyHomeEdit/CaseList", s.para).success(function (d) {
        s.list = d.result.data;
      });
    };
    s.loaddata(1);
    s.del = function (id, index) {
      h.post("/CompanyHomeEdit/CaseDel", { ccid: id }).success(function () {
        s.list.splice(index, 1);
      });
    }
  }])
  .controller('casesCtrldetail', ['$scope', '$http', '$stateParams', "$location", function (s, h, $stateParams, l) {
    s.para = {
      ccid: $stateParams.ccid
    }
    s.loaddata = function () {
      //获取Json数据，根据参数设置值
      h.post('/CompanyHomeEdit/CaseDetail', s.para).success(function (d) {
        if (d.success) {
          s.data = d.result;

        }
      });
    };
    //加载数据
    s.loaddata();
    var para = $.extend({}, s.data);
    function close() {
      $(".modal_bg").fadeOut();
      $(".modal_cont").fadeOut();
    }
    $(".modal_cont_t_close").click(function () {
      close();
    });
    s.submit = function () {
      h.post('/CompanyHomeEdit/CaseEdit', $.extend({}, s.data, s.para)).success(function (data) {
        if (data.success) {
          $(".modal_cont_button_conf").click(function () {
            location.hash = '#/caseslist';
          });
          s.popupText = "3秒后自动返回,或点击确认返回";
          setTimeout(function () {
            location.hash = '#/caseslist';
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
    };
  }])
  .controller('serverDetailCtrl', ['$scope', '$http', "$stateParams", "$location", function (s, h, $stateParams, l) {
    s.data = {};
    s.typeids = [
      { id: 1, text: '设计' },
      { id: 2, text: '开发' },
      { id: 3, text: '文案' },
      { id: 4, text: '装修' },
      { id: 5, text: '营销' },
      { id: 6, text: '商务' },
      { id: 7, text: '生活' },
      { id: 8, text: '其他' }
    ]
    var ddid = $('.wdgz_main_cont_cz').attr('data-ddid')
    var id = $stateParams.id;
    h.post('/CompanyHomeEdit/ServiceDetail', { id: id, ddid: ddid }).success(function (data) {
      s.data = data.result
    })
    s.submit = function () {
      var para = $.extend({}, s.data);
      function close() {
        $(".modal_bg").fadeOut();
        $(".modal_cont").fadeOut();
      }
      $(".modal_cont_t_close").click(function () {
        close();
      });
      var para = $.extend({}, s.data);
      h.post('/CompanyHomeEdit/ServiceEdit', para).success(function (data) {
        if (data.success) {
          $(".modal_cont_button_conf").click(function () {
            location.hash = '#/serversList';
          });
          s.popupText = "3秒后自动返回,或点击确认返回";
          setTimeout(function () {
            location.hash = '#/serversList';
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
  .controller('albumCtrl', ['$scope', '$http', '$stateParams', function (s, h, $stateParams) {
    s.id = $stateParams.type;
    // var getAPI, setAPI;
    
    // switch (id) {
    //   case 1:
    //     getAPI = ;
    //     setAPI = ;
    //     break
    //   case 2:
    //     getAPI = ;
    //     setAPI = ;
    //     break
    //   case 3:
    //     getAPI = ;
    //     setAPI = ;
    //   break
    // }
    s.photos = [{}]
    h.post('/CompanyHomeEdit/PhotoList', {
      type: s.id
    }).success(function (data) {
      s.photos = data.result;
    })



    s.addphoto = function () {
      if (s.photos.length < 5) {
        s.photos.push({});
      } else {
        alert('最多只能上传5张图片!')
      }
    }
    s.delphoto = function (index) {
      s.photos.splice(index, 1);
    }

    s.submit = function () {
      var newArr = [];
      for (var i = 0, len = s.photos.length; i < len; i++) {
        if (s.photos[i].url) {
          newArr.push(s.photos[i]);
        }
      }

      newArr = angular.toJson(newArr);
      h.post('/CompanyHomeEdit/PhotoSave', {
        type: s.id,
        imgs: newArr
      }).success(function () {
      })
    }
  }])
  .controller('linkCtrl', ['$scope', '$http', function (s, h) {
    s.links = [{}];


    s.addlink = function () {
      if (s.links.length < 10) {
        s.links.push({});
      } else {
        alert("最多只能上传十个友情链接");
        return;
      }
    }
    s.dellink = function (index) {
      s.links.splice(index, 1);
    }
    h.post('/CompanyHomeEdit/LinkList').success(function (d) {
      if (d.result.links) {
        s.links = d.result.links;
      }

    });
    s.submit = function () {
      var newArr = [];
      for (var i = 0, len = s.links.length; i < len; i++) {
        newArr.push(s.links[i]);
      }

      newArr = angular.toJson(newArr);

      h.post('/CompanyHomeEdit/LinkSave', {
        links: newArr
      }).success(function (d) {
        if (d.success) {
          alert("提交成功");
        } else {
          console.log("提交失败");
        }
      });
    }
  }]);
  