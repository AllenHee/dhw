//陈磊 2015-11-10 后台管理系统 公司信息列表
app.controller('companysctrl', ['$scope', '$http', function ($scope, $http) {
    //分页相关参数 
    $scope.page = { pageSize: 10, pageIndex: 1, total: 0 };
    //初始化查询
    $scope.qrydata = { state: '', compay: '', name: '', trade: '' };
    $scope.loaddata = function (i) {
        if (!!i) $scope.page.pageIndex = i;
        //获取Json数据，根据参数设置值
        $http.post('/CenterCompanys/List', $.extend({}, $scope.page, $scope.qrydata)).success(function (d) {
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
    $scope.title = "公司信息列表";

} ])

//陈磊 2015-11-11 后台管理系统 公司信息详细列表
app.controller('companysdetailctrl', ['$scope', '$http', '$routeParams', '$filter', 'tool', function ($scope, $http, $routeParams, $filter,tool) {
    $scope.ui = { isopen: false, click: function () { this.isopen = true; } };


    $http.post('/CenterCompanys/Tradeinfo').success(function (d) {
        if (d.success) {
            $scope.trades = d.result;
        }
    });

    //初始化获取数据状态,获取未绑定数据
    var id = $routeParams.id;

    var loaddata = function () {
        //根据id判断是新增还是修改
        if (id == "0")
        { $scope.type = "add"; $scope.data = {}; }
        else {
            $scope.type = "edit";
            $http.post('/CenterCompanys/Detail', { id: id }).success(function (d) {
                if (d.success) {
                    $scope.data = d.result;
                    $scope.data.state += '';
                    $scope.data.auth += '';
                }
            });
        }
    };
    //加载数据
    loaddata();
    //保存
    $scope.save = function () {
        if (id == "0") {
            // tool.getDetailCallBack("操作成功", '#/companys')

            $.post('/CenterCompanys/Add', { id: id, duid: $scope.data.duid, name: $scope.data.name }, function (d) {
                console.log(d);
                tool.alert("操作成功", function () { window.location.href = '#/companys/' + d.result.id })
            });
        }
        else
            tool.postAlertGo('/CenterCompanys/Edit', { ent: {
                id: id,
                dtid: $scope.data.dtid,
                trade: $scope.data.trade,
                compay: $scope.data.compay,
                profile: $scope.data.profile,
                logo: $scope.data.logo,
                Rating: $scope.data.Rating,
                city: $scope.data.city,
                phone: $scope.data.phone,
                email: $scope.data.email,
                state: $scope.data.state,
                auth: $scope.data.auth,
                attestdate:$filter('date')( $scope.data.attestdate,'yyyy-MM-dd'),
                scale: $scope.data.scale,
                financing: $scope.data.financing,
                homepage: $scope.data.homepage,
                Addr: $scope.data.Addr,
                AddrBdMap: $scope.data.AddrBdMap,
                Nature: $scope.data.Nature
            }
            }, "操作成功", '#/companys');
    }
    //标题
    $scope.title = "公司信息详细列表";

} ]);