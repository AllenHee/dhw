
// 数据交互
function attention() {
  var total = parseInt($("#quantity").attr("data-quantity"));
  if ($(".intro_cont_focus").hasClass("cancel")){
    total = total-1;
    para = {
      aiid: id
    };
    $.post("/List/Remove",para).success(function() {
      console.log("成功");
      $(".intro_cont_focus").text("关注").css("color", "#3e4e70").removeClass("cancel");
      
      $.post("/List/FansLogo", paragh, function(data) {
      if (window.dhw) {
        data.result.domain = dhw.imgurl;
      }
      var html = template("logo_show", data.result);
      $(".focus_show").html(html)
    })
    
    });
    $("#quantity").attr("data-quantity",total);
    
    
    
  }
  
  else {
    total = total + 1;
    para = {
      aiid: id
    };
    $.post("/List/Attention",para).success(function() {
      console.log("成功");
      $(".intro_cont_focus").text("取消关注").css("color", "#999").addClass("cancel");
      $.post("/List/FansLogo", paragh, function(data) {
      if (window.dhw) {
        data.result.domain = dhw.imgurl;
      }
      var html = template("logo_show", data.result);
      $(".focus_show").html(html)
    })
    });
    $("#quantity").attr("data-quantity",total);
    
    
  }
  
  
  $("#quantity").text(total);

}

var paragh = {
  id: id  
}

$.post("/List/FansLogo", paragh, function(data) {
  if (window.dhw) {
    data.result.domain = dhw.imgurl;
  }
  var html = template("logo_show", data.result);
  $(".focus_show").html(html)
})