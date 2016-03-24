$(function() {
  var data = {
    
  };
  var confirmTime = 60;
  $('.forget_form_input_radio input').click(function() {
    data.type = $(this).attr('data-type');
  })
  $('.forget_form_send_btn button').click(function() {
    data.keyword = $('#username').val();
    console.log(data);
    $.post('/Reg/ResetGet',data).success(function(res) {
      if(res.success){
        $('#new_pass').removeAttr('disabled');
        $('#confirm_pass').removeAttr('disabled');
        $('.confirm_send_btn').html()
        var interval = setInterval(function() {
          confirmTime -= 1;
          if(confirmTime === 1 ){
            clearInterval(interval)
          }else {
            $('.confirm_send_btn').html('倒计时' + confirmTime);
          } 
        },1000)
      }else {
        alert('您申请重置密码的帐号不存在')
      }
    })
  })
  $.validator.addMethod('ispass', function(value) {
     var pass = /^[a-zA-Z0-9\-\.]{6,20}$/;
     return pass.test(value);     
  },"密码只能包含英文字母数字以及 . - 组成,长度为6-20");
  $('#signupForm').validate({
    // debug : true,
    rules : {
      new_pass : "ispass",
      confirm_pass : {
        required : true,
        equalTo : "#new_pass"
      },
    },
    messages : {
      confirm_pass: {
        required: "请输入密码",
        minlength: "密码长度不能小于 5 个字母",
        equalTo: "两次密码输入不一致"
      },
    },
    submitHandler : function() {
        data.mobile_code = $('#confirm_number').val();
        data.newpwd = $('#new_pass').val();
        $.post('/Reg/ChangePassword',data).success(function(d) {
        if(d.success) {
          alert('修改成功');
        }else {
          alert('您申请重置密码的帐号不存在或者验证码过期');
        }
        })
        console.log(data)
     
    }
  })
})