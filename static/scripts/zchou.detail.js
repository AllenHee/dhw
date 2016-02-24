$(function() {

  if ( !$.cookie("accountType") ) {
    $(".fbBox").attr("placeholder", "您必须登录后才可发表评论，点此登录。")
    var mainurl = dhw.mainurl;
    var localurl = encodeURIComponent(window.location.href);
    var url = mainurl + "login?redirectURL=" + localurl;
    $(".cm-area textarea").focus(function() {
      var conf = confirm("您还未登录，请先登录再进行评论，点击确定跳转到登录页面");
      if(conf == true) {
        location.href = url;
      }else {
        
      }
    });
  };
  // 显示评论框
  $(".cm-contents").on("click", ".cm-reply", function() {
    $(this).parent().parent().next().toggle();
    return false;
  });
  // 右侧资金选择
  $(".zjzc-select-money a").click(function() {
    $(this).siblings().removeClass("current")
            .end().addClass("current");
    return false;
  });
  // 右侧框悬停
  $(".zj-class").mouseenter(function() {
    $(this).find(".zj-c-border").show();
  }).mouseleave(function() {
    $(this).find(".zj-c-border").hide();
  });
  // 悬浮工具栏
  $(window).scroll(function() {
    if ($(this).scrollTop() > 745) {
      $(".fixedbar-fixed").css({
        "position": "fixed",
        "z-index": 102,
        "left": "50%",
        "margin-left": "-512px"
      });
    } else {
      $(".fixedbar-fixed").css({
        "position": "absolute",
        "z-index": "",
        "left": "0",
        "margin-left": "0"
      });
    };
    if ($(this).scrollTop() > 1022) {
      $(".fixedbar .support-btn").show();
    } else {
      $(".fixedbar .support-btn").hide();
    }
  });
  $(".fixedbar li").click(function() {
    $(".fixedbar li").removeClass("current");
    $(this).addClass("current");
  });
  
  // 取得项目ID
  var para = {
    pageIndex: 1,
    pageSize: 10
  };
  
  para.fpid = project_id;
  // 评论请求数据
  loadData("/cpzcDetail/Comments", para, "zc-comment", ".cm-contents", false, ".comment-pagination");
  // 支持记录请求数据
  loadData("/cpzcDetail/Support", para, "support-record", ".support-record tbody", false, ".record-pagination");
  
  
  
  // 评论
  $(".zc-comment").on("click", ".cm-submit button", function() {
    var comments = $(".cm-area textarea").val();
    var paragh = {
            fpid: project_id,
            type: 0,
            comment: comments
          }
    var comment = $(this).parents(".sub-comment");
    var content = $(this).parents(".cm-content");
    if ( comment.length > 0 ) {
      comments = comment.find("textarea").val();
      paragh.fid = comment.attr('data-id');
    } else if ( content.length > 0 ) {
      comments = content.find("textarea").val();
      paragh.fid = content.attr('data-id');
    } else {
      paragh.fid = 0;
    }
    paragh.comment = comments;
    if (comments == ""){
      alert("评论不能为空");
      return false;
    } else {
      $.post("/cpzcDetail/FbComments", paragh).success(function(data) {
        if (data.success) {
          loadData("/cpzcDetail/Comments", para, "zc-comment", ".cm-contents", false, ".comment-pagination");
          $(".cm-area textarea").val("");
          return false;
         } else {
          switch (data.msg.code) {
            case 1:
              alert("评论输入过少")
              break;
            case 2:
             alert("评论输入过多")
             break;
             case 3:
             alert("评论发送过于频繁")
             break;
          }
        }
      });
    }
  });
});
var cookieProp = "data-" + project_id;
if($.cookie(cookieProp)) {
  var total = parseInt($(".zc-like").attr("data-like"));
  var but = "已赞" + "(" + '<span>' + total + '</span>' + ")";
  $(".zc-like").html(but);
}

var attent = parseInt($(".zc-follow").attr("data-focus"));
var plaud = parseInt($(".zc-like").attr("data-like"));
if(attent >= 10000) {
  attent = attent/10000;
  attent = Math.floor(attent);
  attent += "万";
  $(".zc-follow").find("span").text(attent);
}
if(plaud >= 10000) {
  plaud = plaud/10000;
  plaud = Math.floor(plaud);
  plaud += "万";
  $(".zc-like").find("span").text(plaud);
}


// 关注和赞
function attention() {
  if ( $(".zc-follow").hasClass("cancel")) {
    return false;
  }
  else {
  var total = parseInt($(".zc-follow").attr("data-focus"));
  var para = {
    id: project_id
  }
    $.post("/cpzcDetail/Attention", para).success(function() {
      total = total + 1;
      var round = total;
      if(round >= 10000) {
          round = round/10000;
          round = Math.floor(round);
          round += "万";
        }
      $(".zc-follow span").text(total);
      var but = "已关注" + "(" + '<span>' + round + '</span>' + ")";
      $(".zc-follow").html(but);
      $(".zc-follow").attr("data-focus", total);
      $(".zc-follow").addClass("cancel");
  })
  }
}
function like() {
  if ( $(".zc-like").hasClass("cancel")) {
    alert("已点赞");
    return false;
  }
  
  if(!$(".zc-like").attr("data-laud") && !$.cookie(cookieProp)) {
    var para = {
    id: project_id
    }
    $.post("/cpzcDetail/Laud", para).success(function() {
      var total = parseInt($(".zc-like").attr("data-like"));
      total = total + 1;
      var round = total;
      if(round >= 10000) {
          round = round/10000;
          round = Math.floor(round);
          round += "万";
        }
      var but = "已赞" + "(" + '<span>' + round + '</span>' + ")";
      $(".zc-like").html(but);
      $(".zc-like").attr("data-like", total);
      $(".zc-like").addClass("cancel");
      $.cookie(cookieProp, "true");
    })
  }
  else if (!$(".zc-like").attr("data-laud") && $.cookie(cookieProp)) {
    alert("已点赞");
    return false;
  }
}

$(".category_link").click(function()　{
  var type = $(this).attr("data-type");
  $.cookie("zchou_type", type, { path: '/' });
  window.location.pathname = "/";
});
