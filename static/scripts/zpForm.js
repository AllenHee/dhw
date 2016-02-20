$(function() {
  /** 表单取消删除 **/
  $(".rsmM_box").on("click", ".delCancel", function() {
    $(this).parents(".rsm_form_ctrl_model").hide();
  });
  $(".rsmM_box").on("click", ".rsm_form_ctrl_model", function(event) {
    var e = event || window.event;
    e.stopPropagation();
  });
  $(".rsmM_box").on("click", ".rsm_form_ctrl_delete", function(event) {
    var e = event || window.event;
    e.stopPropagation();
  });
  
  /** 下拉控件共用 **/
  // 显示下拉菜单
  $(".rsmM_box").on("click", ".rsm_select_btn", function(event) {
    var e = event || window.event;
    e.stopPropagation();
    // 判断当前list在点击前可不可见
    var list = $(this).next();
    var isListVisible = list.is(":visible");
    // 关闭其它list，切换当前list的可见状态
    $(".rsm_select_lists").hide();
    isListVisible? list.hide() : list.show();
  });
  // 点击外部任意地方关闭下拉菜单
  $(document).click(function() {
    $(".rsm_select_lists").hide();
    // 关闭表单删除框
    $(".rsm_form_ctrl_model").hide();
  });
  $(".rsmM_box").on("click", ".rsm_select_lists", function(event) {
    var e = event || window.event;
    e.stopPropagation();
  });
  // 点击下拉菜单子项
  $(".rsmM_box").on("click", ".rsm_select_lists-normal li", function() {
    $(this).parents(".rsm_select_lists").hide();
  });
  // 点击双列下拉菜单左列
  $(".rsmM_box").on("click", ".rsm_select_list-left li", function() {
    $(this).siblings().removeClass("active")
            .end().addClass("active");
    $(".rsm_select_list-right li").removeClass("active");
  });
  // 点击双列下拉菜单右列
  $(".rsmM_box").on("click", ".rsm_select_list-right li", function() {
    $(this).siblings().removeClass("active")
            .end().addClass("active");
    $(this).parents(".rsm_select_lists").hide();
  });
  
  /** 性别选择 **/
  $(".rsm_inputGroup_gender").click(function() {
    $(this).siblings().removeClass("active")
            .end().addClass("active");
  });
  
  // 右边栏
  // $(".rsmS_item").click(function() {
  //   $(".rsmS_item").removeClass("current");
  //   $(this).addClass("current");
  // });
  
  // var fixed_top = $(".rsmS_fixed").offset().top;
  // var fixed_right = $(".rsmS_fixed").offset().right;
  // var fixed_top_foot = $('.footer').offset().top;
  
  // $(".rsmS_fixed").css("right", fixed_right);
  // $(window).scroll(function() {
  //   var page_scrollTop = $(document).scrollTop();
    
  //   if (page_scrollTop >= fixed_top) {
  //     if(fixed_top_foot - page_scrollTop > 516) {
  //       $(".rsmS_fixed").css("position", "fixed");
  //     }else {
  //       console.log(111)
  //       var top = 516 - (fixed_top_foot - page_scrollTop);
  //       $(".rsmS_fixed").css({"position": "fixed", 'top': -top});
  //     }
  //   } else  {
  //     $(".rsmS_fixed").css({"position": "static", 'top': 0});
  //   }
  // });
  
  // 右边栏添加与删除按钮
  $(".rsmS_item_btn").mouseenter(function() {
    $(this).siblings(".rsmS_item").addClass("hover");
  }).mouseout(function() {
    $(this).siblings(".rsmS_item").removeClass("hover");
  })
  $(".rsmS_item_btn").click(function() {
    if($(this).hasClass("add")) {
      $(this).siblings(".rsmS_item").trigger("click");
    }
  });
  
  // 头像上传
  // $(".avatarUploadBtn").mouseenter(function() {
  //   $(this).addClass("hover");
  // }).mouseleave(function() {
  //   $(this).removeClass("hover");
  // });
});