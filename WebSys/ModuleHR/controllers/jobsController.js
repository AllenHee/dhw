app
//黄文明 2015-11-11  列表页面
.controller('jobsctrl', ['$scope', '$http', function ($scope, $http) {
    console.log(111);
    //    //分页相关参数 
    $scope.page = { pageSize: 10, pageIndex: 1, total: 0 };
    //    //初始化查询
    $scope.qrydata = { Position:'', City: '', gznx: '', xueli: '', scale: '', Dtmc: '' };
    $scope.loaddata = function (i) {
        if (!!i) $scope.page.pageIndex = i;
        //获取Json数据，根据参数设置值
        $http.post('/HRZpxx/List', $.extend({}, $scope.page, $scope.qrydata)).success(function (d) {
            if (d.success) {
                $scope.list = d.result.data;
                $scope.page.total = d.result.total;
            }
        });
    };
    //    //加载数据
    $scope.loaddata(1);
    //查询
    $scope.search = function () { $scope.loaddata(1); }
    //标题
    $scope.title = "用户列表信息";

} ])

//黄文明 2015-11-12 详细页面 查看、修改
.controller('jobsdetailctrl', ['$scope', '$http', '$routeParams', 'tool', function ($scope, $http, $routeParams, tool) {
    //初始化获取数据状态,获取未绑定数据
    var id = $routeParams.id;
    var loaddata = function () {
        //获取Json数据，根据参数设置值
        $http.post('/HRZpxx/Detail', { id: id }).success(function (d) {
            if (d.success) {
                $scope.data = d.result;
            }
        });
    };
    //加载数据
    loaddata();
    //查询
    $scope.search = function () { loaddata(); }
    //保存
    $scope.save = function () {
        //修改
        tool.postAlertGo('/HRZpxx/Edit', { ent:
        {
            id: id,
            CompanyID: $scope.data.CompanyID,
            Position: $scope.data.Position,
            Dtid: $scope.data.Dtid,
            Dtmc: $scope.data.Dtmc,
            CityCode: $scope.data.CityCode,
            City: $scope.data.City,
            Money: $scope.data.Money,
            Tag: $scope.data.Tag,
            Req_gznx: $scope.data.gznx,
            Req_xueli: $scope.data.xueli,
            PV: $scope.data.PV,
            gzxz: $scope.data.gzxz,
            Desc: $scope.data.Desc,
            gzdz: $scope.data.gzdz,
            gzdzBDMap: $scope.data.gzdzBDMap,
            changNum: $scope.data.changNum,
            Req_yy: $scope.data.yy,
            Req_nn_min: $scope.data.min,
            Req_nn_max: $scope.data.max
        }
        }, "操作成功", '#/jobs');
    }
    //删除
    $scope.del = function () {
        tool.confirm(function () {
            $.post('/HRZpxx/Del', { id: id }, tool.getDetailCallBack('操作成功', '#/jobs'));
        });
    }
    //标题
    $scope.title = "用户表详细信息";

} ]);