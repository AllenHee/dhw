var app = angular.module('confirmApp', []);


app.controller('confirmCtrl', ['$scope', '$http', function (s, h) {
    s.data = {};
    s.submit = function() {
        h.post('/ThirdPartyLogin/AddPerson',s.data).success(function(d) {
            // if(d.success) {
            //     console.log(s.data)
            // }else {
            //     console.log(0)
            // }
            if (d.success) {
                $('.errorPop_wrap').show();
                $('#confirm_reg').show();
                setTimeout(function () {
                    location.pathname = "/login";
                }, 3000)
            } 
            // else {
            //     $('.errorPop_wrap').show();
            //     $('.verifyCodeError').html(data.msg)
            //     $('.errorPop').fadeIn(function () {
            //         s.codeRefresh();
            //     });
            // }
        })
    } 
    
    
    // 绑定QQ数据
    s.dataQQ = {};
    s.bin = function() {
        h.post('/ThirdPartyLogin/UserQQReg', s.dataQQ).success(function(d) {
            if (d.success) {
                $('.errorPop_wrap').show();
                $('#qq').show();
                setTimeout(function () {
                    location.pathname = "/login";
                }, 3000)
            } else {
                $('.errorPop_wrap').show();
                $('.verifyCodeError').html(d.msg)
                $('.errorPop').fadeIn(function () {
                    s.codeRefresh();
                });
            }
        })
    }    
    
    
    // 验证手机，用户名
    s.validate = function (value, prop) {
        if (value != undefined) {
            h.post('/Reg/Check', { keyword: value }).success(function (data) {
                if (data.result) {
                    s.isValid[prop] = 1;
                } else {
                    s.isValid[prop] = 0;
                }
            });
        }
    };
    
    
    
    // 刷新验证码
    s.codeRefresh = function () {
        $('#verifyImg').attr('src', '/Login/VerifyCode?_=' + Math.random());
    };


    // 关闭错误提示框
    s.closeErrorPop = function () {
        $('.errorPop_wrap, .errorPop').hide();
    };
}])       
