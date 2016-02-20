//郑玉云 2015-11-9 管理系统 产品众筹 产品详细页面及提交审核
app.controller('xmshctrl', ['$scope', '$http', function ($scope, $http) {
    //分页相关参数 
    $scope.page = { pageSize: 10, pageIndex: 1, total: 0 };
    //初始化查询
    $scope.qrydata = { type: null, state: null, keyword: '', sort: '' };
    $scope.loaddata = function (i) {
        if (!!i) $scope.page.pageIndex = i;
        $http.post('/Crowd/List', $.extend({}, $scope.page, $scope.qrydata)).success(function (d) {
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
    $scope.title = "发布项目审核";
} ])


.controller('xmshdetailctrl', ['$scope', '$http', '$routeParams', 'tool', function ($scope, $http, $routeParams, tool) {
    //初始化获取数据状态,获取未绑定数据
    var id = $routeParams.id;
    
    var loaddata = function () {
        //获取Json数据，根据参数设置值
        $http.post('/Crowd/Detail', { id: id }).success(function (d) {
            if (d.success) {
                $scope.detail = d.result.detail;
                $scope.payback = d.result.payback;
                $scope.Projectprogress = d.result.Projectprogress;

            }
        });
    };
    //加载数据
    loaddata();
    //保存
    $scope.save = function (shjg) {
        if (shjg == "1")
            $.post('/CrowdCP/FbSh', { fpid: id, shjg: shjg }, tool.getDetailCallBack("操作成功", '#/xmsh'));
        else
            $.post('/CrowdCP/FbSh', { fpid: id, shjg: shjg }, tool.getDetailCallBack("操作成功", '#/xmsh'));
    }
    //标题
    $scope.title = "发布项目审核";

} ]);