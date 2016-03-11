
$(function() {
 
  var para = {
    "city" : city ,
    "type" : "房地产评估" 
  }
   
    // 弹出层
  $(".pinggu-search").find("button").click(function() {
    $(".pinggu-submit-bg").show();
    $(".pinggu-submit").show();
    return false;
  })
  $(".pinggu-submit-bg").bind("click", closePS);
  $(".ps-title i").bind("click", closePS);
  function closePS() {
    $(".pinggu-submit-bg").hide();
    $(".pinggu-submit").hide();
    $("body").css("overflow", "visible");
  }
  $('.complete-submit_cancel').click(function() {
    $(".pinggu-submit-bg").hide();
    $(".complete-submit").hide();
  })
  $('.confim_btn').click(function() {
    $(".pinggu-submit-bg").hide();
    $(".complete-submit").hide();
  })
  
  
  // 搜索框和底下分类
  var colors = ["#ea8010", "#ff6666", "#2c9ec3", "#9ebf3a"];
  var input = $(".pinggu-search-input");
  var button = $(".pinggu-search-btn");
  
  // 点击标签
  $(".pinggu-search li").click(function() {
    para.type = $(this).attr("data-text");
    $(this).siblings().removeClass("current")
                      .end().addClass("current");
    var color = $(this).css("background-color");
    input.css("border-color", color);
    button.css("background-color", color);
  });
  // 滑进大框
  $(".pinggu-list li").mouseenter(function() {
    var index = $(this).index();
    $(this).css("border-color", colors[index]);
    if (!$(this).find("i").is(":animated")) {
      $(this).find("i").animate({"top": "20px"}, "fast")
                       .animate({"top": "36px"}, "fast");
    }
  })
  // 滑出大框
  .mouseleave(function() {
    $(this).css("border-color", "#c0c0c0");
  })
  // 点击大框
  .click(function() {
    para.type = $(this).attr("data-text");
    var index = $(this).index();
    $(".pinggu-search li").removeClass("current")
                          .eq(index).trigger("click");
    return false;
  });
  
  
  // 动态滚动
  var trends_wrap = $(".trends");
  var trends_1 = $(".trends ul");
  var trends_2 = $("<ul></ul>");
  trends_2.html(trends_1.html());
  trends_wrap.append(trends_2);
  function marquee() {
    if (trends_wrap.scrollTop() >= trends_1.height()) {
      trends_wrap.scrollTop(0);
    } else {
      trends_wrap.scrollTop(trends_wrap.scrollTop()+1);
    }
  }
  var mq = setInterval(marquee, 50);
  trends_wrap.mouseenter(function() {
    clearInterval(mq);
  }).mouseleave(function() {
    mq = setInterval(marquee, 50);
  });
  
  // 我的服务弹出菜单
  $(".header-nav .last").mouseenter(function() {
    $(this).css({
      "background-color": "#667085",
      "color": "#fff"
    }).find(".last-pop").show();
  }).mouseleave(function() {
    $(this).css({
      "background-color": "transparent",
      "color": "#f95f00"
    }).find(".last-pop").hide();
  });
  
  //评估服务提交
$('.ps-button').find('button').click(function(){
  para.qq = $('#qq').val();
  para.name = $('#name').val();
  para.phone = $('#phone').val();
  para.content = $('#content').val();
  console.log(para);
  $.post('/Assessment/Add',para,function(data){
    if(data.success) {
       var r=confirm("信息提交成功");
        if (r==true) {
            $(".pinggu-submit").hide();
            $(".complete-submit").show();
        }
    }
  })
})
  
  
  
});