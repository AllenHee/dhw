//杨辉 2015-11-9
app.controller('artctrl', ['$scope', '$http', function ($scope, $http) {
    //分页相关参数 
    $scope.page = { pageSize: 10, pageIndex: 1, total: 0 };
    //初始化查询
    $scope.qrydata = {};
    $scope.loaddata = function (i) {
        if (!!i) $scope.page.pageIndex = i;
        //获取Json数据，根据参数设置值
        $http.post('/SysArticle/List', $.extend({}, $scope.page, $scope.qrydata)).success(function (d) {
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

//黄文明 2015-11-9
.controller('artdetailctrl', ['$scope', '$http', '$routeParams', 'tool', function ($scope, $http, $routeParams, tool) {
    $http.post('/SysArticle/artType').success(function (d) {
        if (d.success) {
            $scope.types = d.result;
        }
    });
    //初始化获取数据状态,获取未绑定数据
    var id = $routeParams.id;
    var loaddata = function () {
        //获取Json数据，根据参数设置值
        if (id == "0")
            $scope.data = {};
        else
            $http.post('/SysArticle/Detail', { id: id }).success(function (d) {
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
        $scope.data.content=$('<div>').text( $scope.data.content).html()
        if (id == "0")
        //添加
            $.post('/SysArticle/Add', { id: id, type: $scope.data.type, title: $scope.data.title, content: $scope.data.content, suid: $scope.data.suid, url: $scope.data.url }, tool.getDetailCallBack('操作成功', '#/art'));
        else
        //修改
            $.post('/SysArticle/Edit', { id: id, type: $scope.data.type, title: $scope.data.title, content: $scope.data.content, suid: $scope.data.suid, url: $scope.data.url }, tool.getDetailCallBack("操作成功", '#/art'));
    }

    //删除
    $scope.del = function () {
        tool.confirm(function () {
            $.post('/SysArticle/Del', { id: id }, tool.getDetailCallBack('操作成功', '#/art'));
        });
    }
    //标题
    $scope.title = "用户表详细信息";

   
      

} ]);