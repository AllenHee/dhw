app
//黄文明 2015-11-5 后台管理 评估服务 评估信息查看列表
.controller('pgfwctrl', ['$scope', '$http', function ($scope, $http) {
    //分页相关参数 cjq修改2015-11-6
    $scope.page = { pageSize: 10, pageIndex: 1, total: 0 };
    //初始化获取数据状态，设置为空
    $scope.qrydata = { state: '', type: '' };
    $scope.loaddata = function (i) {
        if (!!i) $scope.page.pageIndex = i;
        //获取Json数据，根据参数设置值、cjq修改2015-11-6
        $http.post('/Finance/PgfwList', $.extend({}, $scope.page, $scope.qrydata)).success(function (d) {
            if (d.success) {
                $scope.list = d.result.data;
                $scope.page.total = d.result.total;
            }
        });
    };
    //加载数据 cjq修改2015-11-6
    $scope.loaddata(1);
    //查询
    $scope.search = function () { $scope.loaddata(1); }
    //标题
    $scope.title = "申请列表";

} ])

//黄文明 2015-11-5 申请评估记录的详细信息
.controller('pgfwdetailctrl', ['$scope', '$http', '$routeParams', 'tool', function ($scope, $http, $routeParams, tool) {
    //初始化获取数据状态,获取未绑定数据
    var id = $routeParams.id;
    //陈磊 修改删除$scope.obj 2015-11-06
    var loaddata = function () {
        //获取Json数据，根据参数设置值
        $http.post('/Finance/PgfwDetail', { id: id }).success(function (d) {
            if (d.success) {
                $scope.data = d.result;
            }
        });
    };
    //加载数据
    loaddata();
    //查询
    $scope.search = function () { loaddata(); }
    //保存 陈磊 修改 2015-11-06
    $scope.save = function () { $.post('/Finance/Pgfwcl', { xxzt: $scope.data.xxzt, remark: $scope.data.remark, id: id }, tool.getDetailCallBack('操作成功', '#/pgfw')); }
    //标题
    $scope.title = "详细信息";

} ]);