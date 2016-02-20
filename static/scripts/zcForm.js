$(function() {
    // 调用省市插件
  $(".cityselect").citySelect(); 
  $(".cityselect2").citySelect(); 
  
  // 监听字数
  $(".form-body").on("input propertychange", ".form-input-set.countable input", function() {
    var total = parseInt($(this).parent().find(".form-word-total").text());
    var length = $(this).val().length;
    $(this).parent().find(".form-word-used").text(total-length);
  });
  $(".form-body").on("input propertychange", ".form-input-set.countable textarea", function() {
    var total = parseInt($(this).parent().find(".form-word-total").text());
    var length = $(this).val().length;
    $(this).parent().find(".form-word-used").text(total-length);
  });
  
  // 基本信息 个人/企业 切换
  $(".form-tab li").click(function() {
    $(this).siblings().removeClass("current")
            .end().addClass("current");
    if ($(this).hasClass("personal")) {
      $(".form-institutional").hide();
      $(".form-personal").show();
    } else {
      $(".form-personal").hide(); 
      $(".form-institutional").show();
    }
  });
  
  // 基本信息 类目切换 通用
  $(".form-category-tab li").click(function() {
    $(this).siblings().removeClass("current")
            .end().addClass("current");
    
    var cate = $.trim($(this).text());
    var para = $(this).parent().next();
    switch (cate) {
      case "科技":
        para.text("科技类项目发起上传资料")
        break
      case "公益":
        para.text("公益类项目发起上传资料")
        break
      case "农业":
        para.text("农业项目发起上传资料")
        break
      case "出版":
        para.text("出版类项目发起上传资料")
        break
      case "娱乐":
        para.text("娱乐")
        break
      case "艺术":
        para.text("艺术无价")
        break
      case "商铺":
        para.text("商铺")
        break;
      case "房产":
        para.text("")
        break;
      case "其他":
        para.text("其他类项目发起上传资料")
        break;
    }
  })
  // 基本信息 类目切换 个人
  $(".form-category-tab.personal li").click(function() {
    var cate = $.trim($(this).text());
    var materials = $(".material-list.personal>div");
    switch (cate) {
      case "科技":
        materials.each(function() {
          $(this).show();
        });
        break;
      case "公益":
      case "农业":
      case "出版":
      case "商铺":
      case "其他":
        materials.each(function() {
          if ($(this).index() == 2) {
            $(this).hide()
          } else {
            $(this).show();
          }
        });
        break;
      case "娱乐":
      case "艺术":
      case "房产":
        materials.each(function() {
          $(this).hide();
        });
        break;
    } 
  });
  
  // 基本信息 类目切换 机构
  $(".form-category-tab.institutional li").click(function() {
    var cate = $.trim($(this).text());
    var materials = $(".material-list.institutional>div");
    switch (cate) {
      case "科技":
        materials.each(function() {
          $(this).show();
        });
        break;
      case "公益":
      case "房产":
        materials.each(function() {
          if ($(this).index() == 2) {
            $(this).hide()
          } else {
            $(this).show();
          }
        });
        break;
      case "农业":
      case "出版":
      case "娱乐":
        materials.each(function() {
          if ($(this).index() == 0) {
            $(this).show()
          } else {
            $(this).hide();
          }
        });
        break;
      case "艺术":
      case "商铺":
      case "其他":
        materials.each(function() {
          $(this).hide();
        });
        break;
    } 
  });
  
  // 基本信息 选择平台服务内容
  $("#jbxxService").click(function() {
    $(this).toggleClass("current");
  })
  
  // 项目信息 文字预览
  $(".xmxx-title").bind("input propertychange", function() {
    var title = $(this).val();
    $(".xmxx-title-preview").text(title);
  });
  $(".xmxx-purpose").bind("input propertychange", function() {
    var purpose = $(this).val();
    $(".xmxx-purpose-preview").text(purpose);
  })
  
  // 详细描述 添加模块
  var edit_area = $(".edit-area");
  var edit_text_html = template("edit-text-templet", {className: "addition", title: "", content: ""}) //$("#edit-text").html();
  var edit_img_html = template("edit-img-template", {className: "addition", title: "", content: ""})
  // 添加文本模块
  $(".edit-addtion-text a").click(function () {
    edit_area.append(edit_text_html);
    return false;
  });
  // 添加图片模块
  $(".edit-addtion-img a").click(function () {
    var new_edit_img = $(edit_img_html);
    var target_btn = new_edit_img.find(".browse");
    // 绑定图片上传
    bindImg(target_btn);
    edit_area.append(new_edit_img);
    return false;
  });
  
  // 详细描述 文本编辑
  $(".edit-area").on("click", ".edit-text-btn.edit", function() {
    var area = $(this).parents(".edit-text");
    var text_title = area.find(".edit-text-title").text();
    var text_content = area.find(".edit-text-content").text();
    if (text_title != "" || text_content != "") {
      area.find(".editable-save").removeClass("forbid");
    }
    area.find(".editable-text-title").val(text_title);
    area.find(".editable-text-content").val(text_content);
    area.find(".edit-text-result").hide();
    area.find(".editable").show();
  });
  
  // 详细描述 文本保存按钮监听
  $(".edit-area").on('input propertychange', ".editable-text-title", function() {
    saveBtnChange($(this));
  });
  $(".edit-area").on('input propertychange', ".editable-text-content", function() {
    saveBtnChange($(this));
  });
  function saveBtnChange(elem) {
    var text_title = elem.parents(".edit-text").find(".editable-text-title").val();
    var text_content = elem.parents(".edit-text").find(".editable-text-content").val();
    if (text_title != "" || text_content != "" ) {
      elem.parents(".edit-text").find(".editable-save").removeClass("forbid");
    } else {
      elem.parents(".edit-text").find(".editable-save").addClass("forbid");
    }
  }
  
  // 详细描述 文本保存
  $(".edit-area").on("click", ".editable-save", function() {
    var area = $(this).parents(".edit-text");
    var text_title = area.find(".editable-text-title").val();
    var text_content = area.find(".editable-text-content").val();
    if (text_title == "" && text_content == "") {
      return false;
    }
    area.find(".edit-text-title").text(text_title);
    area.find(".edit-text-content").text(text_content);
    area.find(".editable").hide();
    area.find(".edit-text-result").show();
  });
  
  // 调用模态框
  (function() {
    var target;
    
    // 详细描述 文本/图像删除
    $(".xxms").on("click", ".editable-delet", function() {
      target = $(this).parents(".edit-box");
      if ($(this).parent().parent().is(".edit-text-result")) {
        $(".modal-body span").text("这段文本");
      } else {
        $(".modal-body span").text("这张图像");
      }
      $(".edit-modal").fadeIn();
      $(".modal-dialog").fadeIn();
    });
    
    // 回报设置 删除
    $(".hbsz").on("click", ".return-box-delete", function() {
      target = $(this).parents(".return-box");
      $(".modal-body span").text("这项回报");
      $(".edit-modal").fadeIn();
      $(".modal-dialog").fadeIn();
    });
    $(".hbsz").on("click", ".edit-text-btn.delete", function() {
      target = $(this).parents(".return-box");
      $(".modal-body span").text("这项回报");
      $(".edit-modal").fadeIn();
      $(".modal-dialog").fadeIn();
    });
    
    
    // 项目信息 推荐标签
    $(".label-items span").click(function() {
      target = null;
      
      var tag_name = $(this).text();
        
      if (!$(this).hasClass("selected")) {
        if ($(".form-right-bottom-bq").find("a").length < 2) {
          $(this).addClass("selected");
          var new_tag = $("<a href='#'>" + tag_name + "</a>");
          $(".form-right-bottom-bq").find(".default").remove()
          $(".form-right-bottom-bq").append(new_tag);
        } else {
          $(".modal-dialog").find(".modal-cancel").remove();
          $(".modal-body").text("最多只能选择两个推荐标签");
          $(".edit-modal").fadeIn();
          $(".modal-dialog").fadeIn();
        }  
      } else {
        $(this).removeClass("selected");
        $(".form-right-bottom-bq").find("a").each(function() {
          if ($(this).text() == tag_name) {
            $(this).remove();
          }
        })
      }
    });
    
    // 模态框行为
    $(".modal-cancel").click(function() {
      $(".edit-modal").hide();
      $(".modal-dialog").hide();
    });
    $(".modal-close").click(function() {
      $(".edit-modal").hide();
      $(".modal-dialog").hide();
    });
    $(".modal-confirm").click(function() {
      if (target == null) {
        $(".edit-modal").hide();
        $(".modal-dialog").hide();
      }
      if (target.hasClass("return-box")) {
        var target_parent = target.parent();
        target.remove();
        var i = 0;
        if (target_parent.find(".hbsz-title").length == 0) {
          $(".form-header-item.last").removeClass("valid");
        } else {
          target_parent.find(".hbsz-title").each(function() {
            $(this).text("回报"+ (++i));
          });
        }
      } else {
        target.remove();
      }
      $(".edit-modal").hide();
      $(".modal-dialog").hide();
    });
  })();
  
  // 详细描述 文本/图像移动
  $(".edit-area").on("click", ".edit-text-btn.up", function() {
    var elem = $(this).parents(".edit-box");
    elem.prev().before(elem);
  });
  $(".edit-area").on("click", ".edit-text-btn.down", function() {
    var elem = $(this).parents(".edit-box");
    elem.next().after(elem);
  });
  
  // 详细描述 添加视频
  $(".xxms-video-inpput").bind("input propertychange", function() {
    if ($(this).val().length != 0) {
      $(this).next().removeClass("forbid");
    } else {
      $(this).next().addClass("forbid");
    }
  })
  $(".xxms-video-save").click(function() {
    if ($(this).hasClass("forbid")) {
      return false;
    }
    var url = $(".xxms-video-inpput").val();
    $(".xxms-video-inpput").val("");
    $(".xxms-video-url").text(url);
    $(".xxms-video-edit").hide();
    $(".xxms-video-result").show();
  })
  $(".xxms-video-cancel").click(function() {
    $(".xxms-video-result").hide();
    $(".xxms-video-edit").show();
  })
  
  // 回报设置，动态生成
  function addHB() {
    var hb = {"result": [{img:""}]};
    var html = template("return-box-template", hb);
    var new_box =  $(html);
    new_box.addClass("addition");
    bindImg(new_box.find(".browse"));
    var len = $(".return-box-wrap .return-box").length;
    if (!len) {
      len = 0;
    }
    new_box.find(".hbsz-title").text("回报" + (len + 1));
    $(".return-box-wrap").append(new_box);
  };
  // 回报设置 图片删除
  // $(".form-img-upload").on("mouseenter", ".browse-img-wrap", function() {
  //   $(this).find("span").show();
  // }).on("mouseleave", ".browse-img-wrap", function() {
  //   $(this).find("span").hide();
  // });
  // $(".form-img-upload").on("click", ".browse-img-wrap span", function() {
  //   target = $(this).parents(".browse-img-wrap");
  //   $(".modal-body span").text("这张图片");
  //   $(".edit-modal").fadeIn();
  //   $(".modal-dialog").fadeIn();
  // });
  // 回报设置 回报类型
  $(".hbsz").on("click", ".return-type li i", function() {
    $(".return-type").find("i").removeClass("current");
    $(this).addClass("current");
    ($(this).hasClass("return-type-virtual")) ?
      $(".virtual-return").show() : $(".virtual-return").hide()
  });
  
  // 回报设置 添加
  (function() {
    $(".return-box-add").click(function() {
      addHB();
      return false;
    });
  })();
  
  // 回报设置 保存按钮监听
  $(".return-box-wrap").on("input propertychange", "input", function() {
    returnSaveBtnChange($(this));
  });
  $(".return-box-wrap").on("input propertychange", "textarea", function() {
    returnSaveBtnChange($(this));
  });
  function returnSaveBtnChange(elem) {
    var edit = elem.parents(".return-box-edit");
    var inputs = edit.find("input");
    var textarea = edit.find("textarea");
    var count = 0;
    inputs.each(function() {
      if ($(this).val() != "") {
        count++;
      }
    });
    textarea.each(function() {
      if ($(this).val() != "") {
        count++;
      }
    });
    if (count == 6) {
      if (edit.find(".form-error-tip:visible").length == 0) {
        edit.find(".return-box-save").removeClass("forbid");
      }
    } else {
      edit.find(".return-box-save").addClass("forbid");
    }
  }
  
  // 回报设置 保存
  $(".return-box-wrap").on("click", ".return-box-save", function() {
    if ($(this).hasClass("forbid")) {
      return false;
    } else {
      var edit =  $(this).parents(".return-box").find(".return-box-edit");
      var result = $(this).parents(".return-box").find(".return-box-result");
      result.find(".hbszSum-result").text("¥" + edit.find(".hbszSum").val());
      result.find(".hbszNumber-result").text(edit.find(".hbszNumber").val());
      result.find(".hbszTitle-result").text(edit.find(".hbszTitle").val());
      result.find(".hbszContent-result").text(edit.find(".hbszContent").val());
      result.find(".hbszShipment-result").text(edit.find(".hbszShipment").val());
      result.find(".hbszPaytime-result").text(edit.find(".hbszPaytime").val());
      var src = edit.find(".browse-img").attr("src");
      var ssrc = edit.find(".browse-img").attr("ssrc");
      if (src != undefined) {
        result.find(".browse-img-result").attr("src", src).show()
                                         .attr("ssrc", ssrc);
      }
      
      $(this).parents(".return-box").removeClass("addition");
    }
  })
  
  // 回报设置 编辑
  $(".return-box-wrap").on("click", ".edit-text-btn.edit", function() {
    $(this).parents(".return-box").find(".return-box-save").removeClass("forbid");
    $(this).parents(".return-box").addClass("addition");
  });
  
  // 回报设置 移动
  $(".return-box-wrap").on("click", ".edit-text-btn.up", function() {
    var elem = $(this).parents(".return-box");
    var index = elem.index();
    elem.find(".hbsz-title").text("回报" + index);
    elem.prev().find(".hbsz-title").text("回报" + (index + 1));
    elem.prev().before(elem);
  });
  $(".return-box-wrap").on("click", ".edit-text-btn.down", function() {
    var elem = $(this).parents(".return-box");
    var index = elem.index();
    elem.find(".hbsz-title").text("回报" + (index + 2));
    elem.next().find(".hbsz-title").text("回报" + (index + 1));
    elem.next().after(elem);
  });
  
  
  // 绑定图片上传
  $(".browse").each(function() {
    bindImg($(this), true);
  });
  
});