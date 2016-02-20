angular.module('sysbase', ['ngRoute', 'ui.bootstrap'])
.run(['uibPaginationConfig', function (c) {/*配置分页指令*/
    c.boundaryLinks = true; c.firstText = '首页'; c.previousText = '上一页'; c.nextText = '下一页'; c.lastText = '末页';
} ]).run(['uibDatepickerPopupConfig', function (c) {/*配置日期指令*/
    c.currentText = '\u4ECA\u5929'; c.clearText = '\u6E05\u9664'; c.closeText = '\u5173\u95ED'; c.html5Types['datetime-local'] = 'yyyy-MM-dd 00:00:00.000';
} ]).run(["$templateCache", function ($templateCache) {
    $templateCache.put("confirmContent.html",
    "<div class=\"modal-header\">" +
	"    <h3 class=\"modal-title\">确认删除</h3>" +
	"</div>" +
	"<div class=\"modal-body\"><p>您确定要删除本条记录吗？</p></div>" +
	"<div class=\"modal-footer\">" +
    "    <button class=\"btn btn-warning\" ng-click=\"cancel()\">取消</button>" +
	"    <button class=\"btn btn-primary\" ng-click=\"ok()\">确定</button>" +
	"</div>\n" +
    "");
} ]).run(["$templateCache", function ($templateCache) {
    $templateCache.put("alertContent.html",
    "<div class=\"modal-header\">" +
	"    <h3 class=\"modal-title\">{{data.title}}</h3>" +
	"</div>" +
	"<div class=\"modal-body\"><p>{{data.msg}}</p></div>" +
	"<div class=\"modal-footer\">" +
	"    <button class=\"btn btn-primary\" ng-click=\"ok()\">确定</button>" +
	"</div>\n" +
    "");
} ]).run(['$rootScope', function ($rootScope) {
    $rootScope.dhw = dhw;
} ]).service('tool', ['$uibModal', function ($modal) {
    var tool = {
        getDetailCallBack: function (msg, url) {
            return function (d) { tool.alert(msg, function () { window.location.href = url; }) };
        },
        post: function (url, /*参数*/data, callback) {
            angular.forEach(data, function (v, n) { if (typeof v == "object") { data[n] = angular.toJson(v); } });
            $.post(url, data, callback);
        },
        //提交 提醒 返回
        postAlertGo: function (url, /*参数*/data,  /*成功后提醒的信息*/msg,  /*成功后跳转的URL*/gourl) {
            this.post(url, data, tool.getDetailCallBack(msg, gourl));
        }
    };
    tool.alert = function (msg, title, ok) {/*消息提醒框*/
        if (typeof title == "function") {
            ok = title; title = '';
        }
        title = title || '';
        var modalInstance = $modal.open({
            templateUrl: 'alertContent.html',
            controller: function ($scope, $uibModalInstance, data) {
                $scope.ok = function () {
                    $uibModalInstance.close('ok');
                };
                $scope.data = data;
            },
            resolve: {
                data: function () {
                    return { msg: msg, title: title }
                }
            }
        });
        modalInstance.result.then(ok);
    };
    tool.confirm = function (ok, cancel) {/*确认或取消框*/
        var modalInstance = $modal.open({
            templateUrl: 'confirmContent.html',
            controller: function ($scope, $uibModalInstance) {
                $scope.ok = function () {
                    $uibModalInstance.close('ok');
                };
                $scope.cancel = function () {
                    $uibModalInstance.dismiss('cancel');
                };
            }
        });
        modalInstance.result.then(ok, cancel);
    };
    return tool;
} ]).directive('ueditor', [function () {/*富文本编辑器*/
    return {
        restrict: 'A',
        require: 'ngModel',
        link: function (scope, element, attr, ctrl) {
            var um = UM.getEditor('editor');
            um.addListener('contentChange', function () {
                ctrl.$setViewValue(um.getContent());
            });

            ctrl.$render = function () {
                var _initContent = ctrl.$isEmpty(ctrl.$viewValue) ? '' : ctrl.$viewValue;
                um.setContent(_initContent, false);
            };
            scope.$on('$destroy', function () { um.destroy(); });

        }
    };

} ]).directive('dhV1', [function () {/*富文本编辑器*/
    return {
        restrict: 'A',
        require: 'ngModel',
        
        link: function (scope, element, attr, ctrl) {
            element.injector().invoke(['$compile', function ($compile) {
                var ss = '<span  ng-class="{\'dhw-success\':' + attr.dhV1 + '.$valid,\'dhw-error\':' + attr.dhV1 + '.$invalid,\'glyphicon-ok\':' + attr.dhV1 + '.$valid,\'glyphicon-remove\':' + attr.dhV1 + '.$invalid}" class="glyphicon  form-control-feedback" > </span>';
                var s = $compile(ss)(scope);
                element.after(s);


            } ]);



        }
    };

} ]);