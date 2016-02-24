angular.module("baseapp", ['ui.bootstrap.pagination']).run(['$rootScope', function ($rootScope) {
  $rootScope.dhw = dhw;
}]).directive('ngTouched', [function () {
  var TOUCH_CLASS = "ng-touched";
  return {
    restrict: 'A',
    require: 'ngModel',
    link: function (scope, element, attrs, ctrl) {
      ctrl.$touched = false;
      element.bind('blur', function (evt) {
        element.addClass(TOUCH_CLASS);
        scope.$apply(function () {
          ctrl.$touched = true;
        });
      });
    }
  }
}])
// 职位选择
// .directive('positionSelect', function () {
//   return {
//     template: function (elem, attr) {
//       return '<div class="clearfix">' +
//         '<select  class="formSet_select formSet_select-area " ng-model="firPosition" ng-change="setSecPosition()">' +
//         '<option value="">请选择</option>' +
//         '<option value="{{firPosition.id}}" ng-repeat="firPosition in positionList.firPositions">{{firPosition.text}}</option>' +
//         '</select>' +
//         '<select  class="formSet_select formSet_select-area " ng-model="secPosition" ng-change="setThiPosition()">' +
//         '<option value="">请选择</option>' +
//         '<option value="{{secPosition.id}}" ng-repeat="secPosition in positionList.secPositions">{{secPosition.text}}</option>' +
//         '</select>' +
//         '<select  class="formSet_select formSet_select-area" ng-model="thiPosition" ng-options="thiPosition as thiPosition.text for thiPosition in positionList.thiPositions">' +
//         '<option value="">请选择</option>' +
//       // '<option ng-click="setPosition($event)" value="{{thiPosition.id}}" ng-repeat="thiPosition in positionList.thiPositions">{{thiPosition.text}}</option>' +
//         '</select>' +
//         '</div>'
//     },
//     controller: function ($scope, $http) {
//       $scope.$parent.positionList = {
//         firPositions: [],
//         secPositions: [],
//         thiPositions: []
//       };

//       $scope.$parent.thiPosition = {};

//       $scope.$parent.position = {};

//       $http.post("/UserAccount/JobType", { pid: '' }).success(function (data) {
//         $scope.positionList.firPositions = data.result;
//       });

//       $scope.setSecPosition = function () {
//         var p = $scope.firPosition;
//         $http.post("/UserAccount/JobType", { pid: p }).success(function (data) {
//           $scope.positionList.secPositions = data.result;
//         });
//       }
//       $scope.setThiPosition = function () {
//         var p = $scope.secPosition;
//         $http.post("/UserAccount/JobType", { pid: p }).success(function (data) {
//           $scope.positionList.thiPositions = data.result;
//         });
//       }
//       // $scope.setPosition = function(event) {
//       //   $scope.$parent.position.dpname = $(event.target).text();
//       //   $scope.$parent.position.dpid = $scope.thiPosition;
//       //   console.log($scope.$parent.position.dpname)
//       // }
      
//     }
//   }
// })
//提交弹出框
  .directive('pupPop', [function () {
    return {
      template: function (elem, attr) {
        return '<div class="modal_bg"></div>' +
          '<div class="modal_cont model_pos">' +
          '<div class="modal_cont_t">' +
          '<h1>确认提示</h1><span class="modal_cont_t_close">×</span>' +
          '</div>' +
          '<p class="modal_cont_text">' + attr.text + '</p>' +
          '<div class="modal_cont_button">' +
          '<button type="button" class="modal_cont_button_conf">确认</button>' +
          '</div>' +
          '</div>'
      }
    }
  }])
  .directive('selectArea', function () {
    return {
      replace: true,
      scope: true,
      template: function (elem, attrs) {
        return `
        <div class="formSet clearfix">
          <div class="formSetWrap">
            <label class="formSet_label" for="${attrs.name}.province">
              <span class="formRequired" ng-show="${attrs.required}"></span>${attrs.label}
            </label>
            <select class="formSet_select formSelect--multiple" id="${attrs.name}.province" name="${attrs.name}.province"
              ng-model="data.${attrs.name}.province"
              ng-options="item.name for item in ctrl.provinces"
              ng-change="ctrl.getCities(data.${attrs.name}.province);data.${attrs.name}.city='';data.${attrs.name}.district=''"
              ng-required="${attrs.required}"
            >

            </select>
            <select class="formSet_select formSelect--multiple" id="${attrs.name}.city" name="${attrs.name}.city"
              ng-model="data.${attrs.name}.city"
              ng-options="item.name for item in ctrl.cities"
              ng-change="ctrl.getDistricts(data.${attrs.name}.city);data.${attrs.name}.district=''"
              ng-required="${attrs.required}"
              ng-show="ctrl.isShowCities"
            >
            </select>
            <select class="formSet_select formSelect--multiple" id="${attrs.name}.district" name="${attrs.name}.district"
              ng-model="data.${attrs.name}.district"
              ng-options="item.name for item in ctrl.districts"
              ng-required="${attrs.required}"
              ng-show="ctrl.isShowDistricts"
            >
            </select>
          </div>
        </div>
      `;
      },
      controller: ['$http', function ($http) {
        var vm = this;
      
        // 市、县显示切换
        vm.isShowCities = false;
        vm.isShowDistricts = false;

        // 省、市、县数据
        vm.areaData = [];
        // 获取省
        vm.province = (function () {
            $http.post('/Dict/city').success(function(res) {
              vm.areaData = res.result;
              vm.provinces = vm.areaData.filter(function(item) {
                return item.type === 'province';
              })
            })
        })();

        // 点击省获取市
        vm.getCities = function (province) {
                       
         vm.cities = vm.areaData.filter(function(item) {
           return item.type === 'city' && item.code.slice(0,2) === province.code.slice(0,2);
         })
          vm.isShowCities = true; // 显示市
          vm.isShowDistricts = false; // 隐藏县
        };

        // 点击市获取县
        vm.getDistricts = function (city) {
         vm.districts = vm.areaData.filter(function (item) {
             return item.type === 'district' && item.code.slice(0, 5) === city.code.slice(0, 5);
         });
         
          vm.isShowDistricts = true; // 显示县
        };

      }],
      controllerAs: 'ctrl'
    };
  })
  .directive('areaSelect', [function () {
    return {
      template: function (elem, attr) {
        return '<div>' +
          '<select class="formSet_select formSet_select-area" ng-model="area.province" ng-change="setCities()">' +
          '<option value="">请选择</option>' +
          '<option value="{{province}}" ng-repeat="province in areaList.provinces">{{province}}</option>' +
          '</select>' +
          '<select class="formSet_select formSet_select-area" ng-show="areaShow.showCities" ng-model="area.city" ng-change="setCounties()">' +
          '<option value="">请选择</option>' +
          '<option value="{{city}}" ng-repeat="city in areaList.cities">{{city}}</option>' +
          '</select>' +
          '<select class="formSet_select formSet_select-area" ng-show="areaShow.showCounties" ng-model="area.county">' +
          '<option value="">请选择</option>' +
          '<option value="{{county}}" ng-repeat="county in areaList.counties">{{county}}</option>' +
          '</select>' +
          '</div>'
      },
      controller: function ($scope) {
        // 省、市、县数组
        $scope.$parent.areaList = {
          provinces: _areaselect_data.p,
          cities: [],
          counties: []
        };
      
        // 选中的省、市、县
        $scope.$parent.area = {
          province: '',
          city: '',
          county: ''
        };
      
        // 是否显示市、县
        $scope.$parent.areaShow = {
          showCities: false,
          showCounties: false
        };
      
        // 选择省时，取出对应的市的数组
        $scope.setCities = function () {
          var p = $scope.area.province;
          $scope.areaList.cities = _areaselect_data.c[p];
        
          // 清空先前选择的市、县
          $scope.area.city = "";
          $scope.area.county = "";
        
          // 显示市选择框，隐藏县选择框
          $scope.areaShow.showCities = true;
          $scope.areaShow.showCounties = false;
        };
      
        // 选择市时，取出对应的县的数组
        $scope.setCounties = function () {
          var p = $scope.area.province;
          // 如果省份是直辖市
          if (_areaselect_data.s[p]) {
            // 直接返回，因为直辖市只有两级
            return
          }

          var c = $scope.area.city;
          $scope.areaList.counties = _areaselect_data.a[p + '-' + c];
        
          // 清空先前选择的县
          $scope.area.county = "";
        
          // 显示县选择框
          $scope.areaShow.showCounties = true;
        };

      }
    }
  }]).directive('areaSelectSmall', [function () {
    return {
      template: '<div>' +
      '<select class="formSet_select formSet_select-area" ng-model="area.province" ng-change="setCities()">' +
      '<option value="">请选择</option>' +
      '<option value="{{province}}" ng-repeat="province in areaList.provinces">{{province}}</option>' +
      '</select>' +
      '<select class="formSet_select formSet_select-area" ng-show="areaShow.showCities" ng-model="area.city">' +
      '<option value="">请选择</option>' +
      '<option value="{{city}}" ng-repeat="city in areaList.cities">{{city}}</option>' +
      '</select>' +
      '</div>',
      controller: function ($scope) {
        // 省、市数组
        $scope.$parent.areaList = {
          provinces: _areaselect_data.p,
          cities: [],
        };
      
        // 选中的省、市
        $scope.$parent.area = {
          province: '',
          city: '',
        };

        $scope.areaShow = {
          showCities: false
        }

        $scope.setCities = function () {
          $scope.areaShow.showCities = true;

          var p = $scope.area.province;
          $scope.areaList.cities = _areaselect_data.c[p];

          $scope.area.city = "";
        }
      }
    };
  }])
  .directive('timeSelect', [function () {
    return {
      template: '<div class="timeSelect_year"><button class="timeSelect_year_change" type="button" ng-click="changeYear(false)">-</button><span>{{yearTemp}}</span><button class="timeSelect_year_change" type="button" ng-click="changeYear(true)">+</button></div><div class="timeSelect_monthNDate clearfix"><ul class="timeSelect_month"><li class="timeSelect_month_item" ng-class="{current:month==monthTemp, disabled:yearTemp==thisYear && month<thisMonth}" ng-repeat="month in months" ng-click="getDates($event, month)">{{month}}月</li></ul><ul class="timeSelect_date"><li class="timeSelect_date_item" ng-class="{current:yearTemp==year && monthTemp==month && date==dateTemp, disabled:yearTemp==thisYear && monthTemp==thisMonth && date<thisDate}" ng-click="setDate($event, date);$parent.showDate($event);" ng-repeat="date in dates">{{date}}</li></ul></div>',
      controller: function ($scope) {
        // 当前年月日
        var today = new Date();
        $scope.thisYear = today.getFullYear();
        $scope.thisMonth = today.getMonth() + 1;
        $scope.thisDate = today.getDate();
      
        // 年
        $scope.yearTemp = $scope.thisYear;  // 默认当年
        $scope.$parent.year = $scope.yearTemp;
        // 月
        $scope.monthTemp = ($scope.thisMonth < 9) ? '0' + $scope.thisMonth : '' + $scope.thisMonth;  // 默认当月
        $scope.$parent.month = $scope.monthTemp;
        $scope.months = []; //  月份数组
        for (var i = 1; i <= 12; i++) {
          var month_item = i < 10 ? '0' + i : '' + i;
          $scope.months.push(month_item);
        };
        // 日
        $scope.dateTemp = ($scope.thisDate < 9) ? '0' + $scope.thisDate : '' + $scope.thisDate;// 默认当日
        $scope.$parent.date = $scope.dateTemp;
        $scope.dates = [];  // 日期数组，根据不同的月份动态赋值
      
        // 选择年份
        $scope.changeYear = function (isPlus) {
          if (isPlus) { // 点击加号时
            $scope.yearTemp++;
          } else {
            if ($scope.yearTemp > $scope.thisYear) { // 点击减号，并且当前选中年份大于今年时
              $scope.yearTemp--;
            } else {
              return false;
            }
          }
          // 重新给日期数组赋值（不同年份2月的日期不一样）
          $scope.getDates(false, $scope.monthTemp);
        };
      
        // 选择月份，并给日期数组赋值
        $scope.getDates = function (event, whichMonth) {
          //  小于当月的月份不能点击
          if ($(event.target).hasClass('disabled')) {
            return false;
          }
        
          // 给月份赋值
          $scope.monthTemp = whichMonth;
        
          // 高亮选中的月份
          if (event) {
            $(event.target).addClass('current').siblings().removeClass('current');
          }
        
          // 根据月份给日期数组赋值
          function cal(maxDate) {
            var arr = [];
            var item;
            for (var i = 1; i <= maxDate; i++) {
              item = i < 10 ? '0' + i : '' + i;
              arr.push(item);
            }
            $scope.dates = arr;
          }

          switch (whichMonth) {
            // 大月
            case '01':
            case '03':
            case '05':
            case '07':
            case '08':
            case '10':
            case '12':
              cal(31);
              break;
            // 小月
            case '04':
            case '06':
            case '09':
            case '11':
              cal(30);
              break;
            // 2月
            case '02':
              // 是否是闰年
              if (0 == $scope.yearTemp % 4 && (($scope.yearTemp % 100 != 0) || ($scope.yearTemp % 400 == 0))) {
                cal(29);
              } else {
                cal(28);
              }
              break;
          }
        };
        // 根据当月给日期数组赋默认值
        $scope.getDates(false, $scope.monthTemp);
      
        // 选择日期
        $scope.setDate = function (event, whichDate) {
          // 小于当日的日期不能选择
          if ($(event.target).hasClass('disabled')) {
            return false;
          }
        
          // 给日期赋值
          $scope.dateTemp = whichDate;
        
          // 赋值给父控制器
          $scope.$parent.year = $scope.yearTemp;
          $scope.$parent.month = $scope.monthTemp;
          $scope.$parent.date = $scope.dateTemp;

          $(event.target).addClass('current').siblings().removeClass('current'); // 高亮选中的日期
          $scope.isShow = false;
        };

      }
    };
  }]).directive('simditor', function () {
    return {
      restrict: 'A',
      require: 'ngModel',
      link: function (scope, element, attr, ctrl) {
        var editor = new Simditor({
          textarea: $('#editor'),
          //optional options
          upload: true
        });
        editor.on('valuechanged', function () {
          var text = editor.getValue();
          scope.$apply(function () {
            ctrl.$setViewValue(text);
          });
        });
        setTimeout(function () {
          ctrl.$render = function () {
            var _initContent = ctrl.$isEmpty(ctrl.$viewValue) ? '' : ctrl.$viewValue;
            editor.setValue(_initContent);
          };
          ctrl.$render();
        });

        scope.$on('$destroy', function () {
          editor.destroy();
        });
      }
    };
  }).directive('bindimg', function () {
    return {
      restrict: 'A',
      require: 'ngModel',
      link: function (scope, element, attr, ctrl) {
        function bindImg() {
          var uploader = new plupload.Uploader({
            runtimes: 'flash',
            browse_button: element[0],
            container: element[0].id,
            url: dhw.imguploadurl + "?key=" + attr.keyname + "&t=" + attr.size,
            flash_swf_url: '/plupload.flash.swf',

            init: {
              FilesAdded: function (up, files) {
                uploader.start();
              },

              FileUploaded: function (up, file, info) {
                if (info.response != null) {
                  var jsonstr = eval("(" + info.response + ")");

                  var imgUrl = jsonstr.path + jsonstr.name;
                  scope.$apply(function () {
                    ctrl.$setViewValue(imgUrl);
                  });
                }
              },

              // Error: function (up, args) {
              //   if (args.file) {
              //     alert('[error] File:' + args.file);
              //   } else {
              //     alert('[error]' + args);
              //   }
              // }
            }
          });
          uploader.init();
        }
        setTimeout(function () {
          bindImg();
        });

      }
    };
  })
  .directive('bindfile', function () {
    return {
      restrict: 'A',
      require: 'ngModel',
      link: function (scope, element, attr, ctrl) {
        function bindfile() {
          var uploader = new plupload.Uploader({ //实例化一个plupload上传对象
            runtimes: 'flash',
            browse_button: element[0],
            container: element[0].id,
            url: 'http://192.168.2.10:82/uploadfj' + "?key=" + attr.keyname,
            flash_swf_url: '/plupload.flash.swf',

            init: {
              FilesAdded: function (up, files) {
                uploader.start();
              },

              FileUploaded: function (up, file, info) {
                if (info.response != null) {
                  var jsonstr = eval("(" + info.response + ")");

                  scope.$apply(function () {
                    ctrl.$setViewValue(jsonstr.path + jsonstr.name);
                  });
                }
              },

              // Error: function (up, args) {
              //   if (args.file) {
              //     alert('[error] File:' + args.file);
              //   } else {
              //     alert('[error]' + args);
              //   }
              // }
            }
          });
          uploader.init();
        }
        bindfile();
      }
    };
  });

