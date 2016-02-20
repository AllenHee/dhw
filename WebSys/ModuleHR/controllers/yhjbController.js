app
//陈磊 2015-11-06 后台管理 用户举报的招聘信息
.controller('yhjbctrl', ['$scope', '$http', function ($scope, $http) {
    //分页相关参数
    $scope.page = { pageSize: 10, pageIndex: 1, total: 0 };
    //初始化获取数据状态，设置为空
    $scope.qrydata = { ifdo: '' };
    $scope.loaddata = function (i) {
        if (!!i) $scope.page.pageIndex = i;
        //获取Json数据，根据参数设置值
        $http.post('/HRReportjobs/List', $.extend({}, $scope.page, $scope.qrydata)).success(function (d) {
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
    $scope.title = "用户举报的招聘信息";

} ])

//陈磊 2015-11-06 后台系统 用户举报的详细信息
.controller('yhjbdetailctrl', ['$scope', '$http', '$routeParams', function ($scope, $http, $routeParams) {
    //初始化获取数据状态,获取未绑定数据
    var ids = $routeParams.id.split('-');
    var userid = ids[0];
    var jobid = ids[1];
    // $scope.obj = { xxzt: '', remark: '', id: id };
    var loaddata = function () {
        //获取Json数据，根据参数设置值
        $http.post('/HRReportjobs/JbDetail', { UserID: userid, JobID: jobid }).success(function (d) {
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
    $scope.save = function () { $.post('/HRReportjobs/Jbcl', { UserID: userid, JobID: jobid, doresult: $scope.data.doresult, dohuifu: $scope.data.dohuifu }, function (d) { alert(d.result); window.location.href = '#/yhjb' }); }
    //标题
    $scope.title = "用户举报的详细信息";

} ]);