$('input, textarea').placeholder();
    
    // 工作环境
    $(".e-slider li").click(function() {
      var index = $(this).index();
      var width = $(".e-slide").width();
      $(".e-slide-wrap").animate({"left": - width * index + "px"});
      $(this).siblings().removeClass("current")
             .end().addClass("current");
    })
    
    // 显示弹出层
    function report() {
      $(".modal_bg").fadeIn();
      $(".modal_cont").fadeIn();
    };
    //关闭弹出层
    function close() {
      $(".modal_bg").fadeOut();
      $(".modal_cont").fadeOut();
    }
    $(".modal_cont_t_close").click(function() {
      close();
    });
    $(".modal_cont_b_cancel").click(function() {
      close();
    });
    
    
    // 数据交互
    function collection() {
      
      var para = {
        jobid: jobid
      };
      $.post("/Jobs/Sc",para).success(function() {
        $(".collection").html("<span>" + "已收藏" + "</span>");
      });
    };
    
    
    
    $(".modal_cont_button_conf").click(function() {
      
      $(".jubao").hasClass()
      var t_reason = $("#reason").val();
      var t_detail = $("#detail").val();
      var para = {
        reason: t_reason,
        desc: t_detail,
        jobid: jobid
      }
      
      h.post("/Jobs/Jb",para).success(function(data) {
        
        if (data.success) {
        console.log(1)
        
      }
        $(".report").html("<span>" + "已举报" + "</span>");
        $(".modal_bg").fadeOut();
        $(".modal_cont").fadeOut();
      });
    });