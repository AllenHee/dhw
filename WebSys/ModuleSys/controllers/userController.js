//杨辉 2015-11-7 后台管理系统 用户列表信息
app.controller('userctrl', ['$scope', '$http', function ($scope, $http) {

    //分页相关参数 
    $scope.page = { pageSize: 10, pageIndex: 1, total: 0 };
    //初始化查询
    $scope.qrydata = { state: '' };
    $scope.loaddata = function (i) {
        if (!!i) $scope.page.pageIndex = i;
        //获取Json数据，根据参数设置值
        $http.post('/SysSsUser/UserList', $.extend({}, $scope.page, $scope.qrydata)).success(function (d) {
            if (d.success) {
                $scope.list = d.result.data;
                $scope.page.total = d.result.total;
            }
        });
    };
    //加载数据
    $scope.loaddata(1);
    //查询
    $scope.search = function () { $scope.loaddata(1); }
    //标题
    $scope.title = "用户列表信息";

} ])

//陈磊 2015-11-07 后台管理系统 用户表详细信息
app.controller('userdetailctrl', ['$scope', '$http', '$routeParams', 'tool', function ($scope, $http, $routeParams, tool) {
    //初始化获取数据状态,获取未绑定数据
    var id = $routeParams.id;
    var loaddata = function () {
        //获取Json数据，根据参数设置值
        if (id == "0")
            $scope.data = {};
        else
            $http.post('/SysSsUser/UserDetail', { id: id }).success(function (d) {
                if (d.success) {
                    $scope.data = d.result;
                    $scope.data.state += '';
                }
            });
    };
    //加载数据
    loaddata();
    //保存
    $scope.save = function () {
        if (id == "0")
            $.post('/SysSsUser/UserAdd', { id: id, account: $scope.data.account, name: $scope.data.name }, tool.getDetailCallBack("操作成功", '#/user'));
        else
            $.post('/SysSsUser/UserEdit', { id: id, account: $scope.data.account, name: $scope.data.name }, tool.getDetailCallBack("操作成功", '#/user'));
    }

    //陈磊 2015-11-09 添加删除
    $scope.del = function () {
        //弹出框
        tool.confirm(function () {
            //点击确定执行删除
            $.post('/SysSsUser/UserDel', { id: id, stateName: $scope.data.stateName }, tool.getDetailCallBack("操作成功",  '#/user'  ));
        });
    }
    //标题
    $scope.title = "用户表详细信息";

} ]);