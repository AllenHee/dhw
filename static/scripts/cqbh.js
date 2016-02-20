$(function() {
  $(".cqbh_btn, .sbzc_btn, .search_btn").click(function() {
    $(".query_bg").css("display","block");
  });
  $(".query_close").click(function() {
    $(".query_bg").css("display","none");
  });
  
  $("#query_button").click(function() {
    var inp_name = $("#name").val();
    var inp_phone = $("#phone").val();
    var inp_contant = $("#contant").val();
    if (inp_name != "" && inp_phone != "" && (/^1[3|4|5|8][0-9]\d{8}$/.test(inp_phone))) {
      var type;
      if ($(this).is(".zzq")) {
        type = "著作权";
      }
      else if ($(this).is(".sb")) {
        type = "商标";
      }
      else if ($(this).is(".cq")) {
        type = "产权";
      }
      
      $.post("/Api/Fbxx", {
        type: type,
        name: inp_name,
        phone: inp_phone,
        contant: inp_contant
      }).success(function() {
        $(".query_bg").css("display","none");
        $("#wrong_phone").css("display","none");
      })
    } else {
      if (inp_name == ""){
        $("#name_err").css("display","block");
      }
      if (inp_phone == "") {
        $("#phone_err").css("display","block");
        $("#wrong_phone").css("display","none");
      }
      if (!(/^1[3|4|5|8][0-9]\d{8}$/.test(inp_phone)) && inp_phone != ""){
        $("#wrong_phone").css("display","block");
        $("#phone_err").css("display","none");
      }
      return false;
    }
  });
  
  
  // 著作权页面
  $(".search_down").mouseenter(function() {
      $(".search_ul").slideDown(200);
      $(".search_down").removeClass("search_down_hide").addClass("search_down_show");
      $(".search_ul").addClass("search_ul_show")
      $(".search_down i").css("transform","rotate(180deg)");
    });
    
    $(".search_down").mouseleave(function() {
      $(".search_ul").slideUp(200);
      $(".search_down").removeClass("search_down_show").addClass("search_down_hide");
      $(".search_ul").removeClass("search_ul_show").addClass("search_ul_hide");
      $(".search_down i").css("transform","rotate(0)");
    });
    
    $(".search_ul li").click(function() {
      $(".search_down span").html($(this).html());
      $(".search_ul").slideUp(200);
      $(".search_down").removeClass("search_down_show").addClass("search_down_hide");
      $(".search_ul").removeClass("search_ul_show").addClass("search_ul_hide");
      $(".search_down i").css("transform","rotate(0)");
    });
    
    $(".advantage_items_three").mouseenter(function() {
      $(".advantage_items_three").animate({top: '-15px'},150).animate({top: '0'},"fast");
    });
});