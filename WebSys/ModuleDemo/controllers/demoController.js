
app.controller('democtrl', ['$scope', '$http', function ($scope, $http) {
    $scope.trades = [{id:1,text:'abc'}];
    $scope.submitForm = function (isValid) {
        if (!isValid) {
            alert('验证失败');
        }
        else alert('验证成功');
    };

} ])
