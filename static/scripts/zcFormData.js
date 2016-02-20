$.post("/CpzcFb/Add", function(data) {
    // 获取项目id
    var id = data.result.id;
    
    // 首次载入
    getJBXX(id);
    getXMXX(id);
    getXXMS(id);
    getHBSZ(id);
    setTimeout(function() {
      setJBXX(id);
      setXMXX(id);
      setXXMS(id);
      setHBSZ(id);
    }, 1000);
    
    // 验证是否可以递交审核
    function prepareVerify() {
      if ($(".form-header-menu .valid").length == 4) {
        $(".form-verify").removeClass("forbid");
      } else {
        $(".form-verify").addClass("forbid");
      }
    }
    // 提交审核
    $(".form-verify").click(function() {
      if ($(this).hasClass("forbid")) {
        return false;
      } else {
        $.post("/CpzcFb/FbTj", {
          fpid: id
        }, function(data) {
          alert("成功")
        });
      }
    });
    
    // 用来取得输入框值的自定义方法
    function getVal(id) {
      var elem = $(id);
      if (elem.val() == elem.attr("value")) {
        return "";
      } else {
        return elem.val();
      }
    }
    
    // 显示保存成功信息的方法
    // function setSuccess(text) {
    //   $(".form-success").find("span").text(text);
    //   $(".form-success").fadeIn(2000);
    //   setTimeout(function() {
    //     $(".form-success").fadeOut(2000);
    //   }, 3000);
    // }
    
    // 保存草稿
    $(".save-copy-btn").click(function() {
      var parent = $(this).parents(".form-body");
      if (parent.is(".jbxx")) {
        setJBXX(id);
      } else if (parent.is(".xmxx")) {
        setXMXX(id);
      } else if (parent.is(".xxms")) {
        setXXMS(id);
      } else if (parent.is(".hbsz")) {
        setHBSZ(id);
      }
    });
    
    // 自动保存
    function autoSet() {
      var tab = $(".form-header-item.current");
      var tab_id = tab.attr("id");
      switch (tab_id) {
        case "jbxxBtn":
          setJBXX(id);
          break;
        case "xmxxBtn":
          setXMXX(id);
          break;
        case "xxmsBtn":
          setXXMS(id);
          break;
        case "hbszBtn":
          setHBSZ(id);
          break;
      }
    }
    setInterval(autoSet, 60000);
    
    // 获取基本信息
    function getJBXX(id) {
      $.post("/CpzcFb/GetJbxx", {fpid: id}, function(data) {
        var jbxx = data.result;
        
        // 个人
        if (jbxx.owerType == 0) {
          $(".form-tab li:first-child").trigger("click");
          for (var d in jbxx) {// 项目类型还没写
            if (jbxx[d] != "") {
              switch (d) {
                case "name":
                  $("#jbxxPName").val(jbxx[d]);
                  break;
                case "idcard":
                  $("#jbxxPIdcard").val(jbxx[d]);
                  break;
                case "phone":
                  $("#jbxxPMobile").val(jbxx[d]);
                  break;
                case "address":
                  $("#jbxxPAddress").val(jbxx[d]);
                  break;
                case "city":
                  var geo = jbxx[d].split(","); // 地区
                  $("#jbxxProv").val(geo[0]).trigger("change");
                  $("#jbxxCity").val(geo[1]);
                  break;
                case "idcardF":
                  $("#jbxxIDFrongt").show().attr("src", dhw.imgurl+jbxx[d] + "64x64.jpg")
                                    .attr("ssrc", jbxx[d]);
                  break;
                case "idcardB":
                  $("#jbxxIDBack").show().attr("src", dhw.imgurl+jbxx[d] + "64x64.jpg")
                                     .attr("ssrc", jbxx[d]);
                  break;
                case "product":
                  $("#jbxxProduct").show().attr("src", dhw.imgurl+jbxx[d] + "64x64.jpg")
                                    .attr("ssrc", jbxx[d]);
                  break;
              }
            }
          }
        // 机构
        } else if (jbxx.owerType == 1) {;
          $(".form-tab li:last-child").trigger("click");
          for (var v in jbxx) {// 项目类型还没写
            if (jbxx[v] != "") {
              switch (v) {
                case "Entname":
                  $("#jbxxCCorame").val(jbxx[v]);
                  break;
                case "number":
                  $("#jbxxCNumber").val(jbxx[v]);
                  break;
                case "name":
                  $("#jbxxCName").val(jbxx[v]);
                  break;
                case "address":
                  $("#jbxxCAddress").val(jbxx[v]);
                  break;
                case "cmitname":
                  $("#jbxxCContactName").val(jbxx[v]);
                  break;
                case "cmitphone":
                  $("#jbxxCContactMobile").val(jbxx[v]);
                  break;
                case "licpic":
                  $("#jbxxCLicense").show().attr("src", dhw.imgurl+jbxx[v] + "64x64.jpg")
                                    .attr("ssrc", jbxx[v]);
                  break;
                case "codepic":
                  $("#jbxxCCode").show().attr("src", dhw.imgurl+jbxx[v] + "64x64.jpg")
                                     .attr("ssrc", jbxx[v]);
                  break;
                case "regpic":
                  $("#jbxxCRegister").show().attr("src", dhw.imgurl+jbxx[v] + "64x64.jpg")
                                    .attr("ssrc", jbxx[v]);
                  break;
              }
            }
          }
        }
        
        if (jbxx.sercont == 0) {  // 是否选择平台内容
          $("#jbxxService").removeClass("current");
        } else if (jbxx.sercont == 1) {
          $("#jbxxService").addClass("current");
        }
        
        // 重新判断input框文本颜色
        $(".jbxx input").each(function() {
          if (this.value != this.defaultValue) {
            $(this).css("color", "#333");
          }
        });
        
      });
    }
    
    // 存储基本信息
    function setJBXX(id) {
      var valid = true;
      
      // 判断是个人还是机构
      var _type;
      $(".form-tab li").each(function() {
        if ($(this).hasClass("current")) {
          _type = $(this).index();
        }
      });
      
      var service = (function() {
        if ($("#jbxxService").hasClass("current")) {
          return 1;
        } else {
          return 0;
        }
      })();
      
      // 个人
      if (_type == 0) {
        // 取值
        var p_name = getVal("#jbxxPName"),
            p_idcard = getVal("#jbxxPIdcard"),
            prov = getVal("#jbxxProv"),
            city = getVal("#jbxxCity"),
            p_mobile = getVal("#jbxxPMobile"),
            p_address = getVal("#jbxxPAddress"),
            // 项目类型
            id_front = $("#jbxxIDFrongt").attr("ssrc"),
            id_back = $("#jbxxIDBack").attr("ssrc"),
            product = $("#jbxxProduct").attr("ssrc");
            
        var jbxxP_obj = {
          name: p_name,
          idcard: p_idcard,
          city: prov + "," + city,
          phone: p_mobile,
          idcardF: id_front,
          idcardB: id_back,
          product: product,
          sercont: service
        }
        
        // 传输值  
        $.post("/CpzcFb/JbxxPerson", {
          fpid: id,
          name: p_name,
          idcard: p_idcard,
          city: prov + "," + city,
          phone: p_mobile,
          address: p_address,
          ptid: 1, //临时值
          idcardF: id_front,
          idcardB: id_back,
          product: product,
          sercont: service
        }, function() {
          // setSuccess("基本信息");
        });
        
        // 检查填写是否合法
        for (var prop in jbxxP_obj) {
          if (jbxxP_obj[prop] == "") {
            valid = false;
          }
        }
        if ($(".form-personal .form-error-tip:visible").length != 0) {
          valid = false;
        }
        
      // 机构
      } else if (_type == 1) {
        // 取值
        var cor_name = getVal("#jbxxCCorame"),
            C_number = getVal("#jbxxCNumber"),
            c_name = getVal("#jbxxCName"),
            c_address = getVal("#jbxxCAddress"),
            c_contact_name = getVal("#jbxxCContactName"),
            c_contact_mobile = getVal("#jbxxCContactMobile"),
            c_address = getVal("#jbxxCAddress"),
            // 项目类型
            c_license = $("#jbxxCLicense").attr("ssrc"),
            c_code = $("#jbxxCCode").attr("ssrc"),
            c_register = $("#jbxxCRegister").attr("ssrc");
            
        var jbxxC_obj = {
          entname: cor_name,
          number: C_number,
          name: c_name,
          address: c_address,
          cmitname: c_contact_name,
          cmitphone: c_contact_mobile,
          licpic: c_license,
          codepic: c_code,
          regpic: c_register,
          sercont: service
        }
        
        // 传输值
        $.post("/CpzcFb/JbxxEnterprise", {
          fpid: id,
          entname: cor_name,
          number: C_number,
          name: c_name,
          address: c_address,
          cmitname: c_contact_name,
          cmitphone: c_contact_mobile,
          ptid: 1, //临时值
          type: "", //临时值
          licpic: c_license,
          codepic: c_code,
          regpic: c_register,
          sercont: service
        }, function() {
          // setSuccess("基本信息");
        });
        
        // 检查填写是否合法
        for (var prop in jbxxC_obj) {
          if (jbxxC_obj[prop] == "") {
            valid = false;
          }
        }
        if ($(".form-institutional .form-error-tip:visible").length != 0) {
          valid = false;
        } 
      }
      // 判断填写是否合法
      if (valid != false) {
        $("#jbxxBtn").addClass("valid");
      } else {
        $("#jbxxBtn").removeClass("valid");
      }
      prepareVerify();
    }
    
    // 获取项目信息
    function getXMXX(id) {
      $.post("/CpzcFb/GetXmxx", {fpid: id}, function(data) {
        var xmxx = data.result;
        for (var d in xmxx) {
          if (xmxx[d] != "") {
            switch (d) {
              case "title":
                $("#xmxxTitle").val(xmxx[d]).trigger("propertychange");
                break;
              case "purpose":
                $("#xmxxPurpose").val(xmxx[d]).trigger("propertychange");
                break;
              case "province":
                $("#xmxxProv").val(xmxx[d]).trigger("change");
                break;
              case "city":
                $("#xmxxCity").val(xmxx[d]);
                break;
              case "money":
                $("#xmxxMoney").val(xmxx[d]);
                break;
              case "daysum":
                $("#xmxxDays").val(xmxx[d]);
                break;
              case "frontpic":
                $("#xmxxFront").show().attr("src", dhw.imgurl+xmxx[d] + "260x260.jpg")
                                  .attr("ssrc", xmxx[d]);
                break;
              case "rectag":
                var rec_tags = xmxx[d].split(",");  // 推荐标签 转成数组
                var rec_tag;
                if (rec_tags.length > 0) {  // 如果存在标签，执行操作
                  $("#xmxxTags").find("a").remove(); // 删除默认标签字样
                  for (var i=0; i<rec_tags.length; i++) { // 循环插入每一个标签
                    rec_tag = $("<a href='#'>" + rec_tags[i] + "</a>");
                    $("#xmxxTags").append(rec_tag);
                    // 循环页面上推荐标签列表，若某个标签存在，改变其样式为选中
                    $(".label-item").each(function() {
                      if ($(this).text() == rec_tags[i]) {
                      $(this).addClass("selected"); 
                      }
                    });
                  }
                }
                break;
              case "diytag":
                var diy_tags = xmxx[d].split(",");  // 自定义标签
                var diy_tags_text = diy_tags.join(" ");
                $("#xmxxDiyTags").val(diy_tags_text);
            }
          }
        }
        // 重新判断input框文本颜色
        $(".xmxx input").each(function() {
          if (this.value != this.defaultValue) {
            $(this).css("color", "#333");
          }
        });
      });
    }
    
    // 存储项目信息
    function setXMXX(id) {
      // 取值
      var front = $("#xmxxFront").attr("ssrc"),
          title = getVal("#xmxxTitle"),
          purpose = getVal("#xmxxPurpose"),
          prov = getVal("#xmxxProv"),
          city = getVal("#xmxxCity"),
          money = "",
          days = getVal("#xmxxDays"),
          tags = "",
          diy_tags = "";
          
      // 获取各个推荐标签的文本，拼接成正确格式
      $("#xmxxTags").find("a").each(function() {
        if (!$(this).hasClass("default")) {
          tags += $(this).text();
          if (!$(this).is(":last-child"))
          tags += ",";
        }
      });
      // 获取各个自定义标签的文本，拼接成正确格式
      var o_diy = getVal("#xmxxDiyTags").split(" ");
      var diy = new Array();
      for (var i=0; i<o_diy.length; i++) {
        if (o_diy[i] != "") {
          diy.push(o_diy[i]);
        }
      }
      for (var j=0; j<diy.length; j++) {
        diy_tags += diy[j];
        if (j != diy.length-1) {
          diy_tags += ","
        }
      }
      
      // 传输值
      $.post("/CpzcFb/Xmxx", {
        fpid: id,//项目ID
        frontpic: front,//封面
        title: title,//项目标题
        purpose: purpose,//筹资目的
        province: prov,//项目地点省
        city: city,//项目地点市
        money: money,//筹资金额
        daysum: days,//筹资天数
        rectag: tags,//推荐标签
        diytag: diy_tags//自定义标签
      }, function() {
       // setSuccess("项目信息");
      });
      
      // 验证填写是否合法
      var valid = true;
      var xmxx_obj = {
        frontpic: front,//封面
        title: title,//项目标题
        purpose: purpose,//筹资目的
        province: prov,//项目地点省
        city: city,//项目地点市
        money: money,//筹资金额
        daysum: days,//筹资天数
      }
      for (var prop in xmxx_obj) {
        if (xmxx_obj[prop] == "") {
          valid = false;
        }
      }
      if ($(".xmxx .form-error-tip:visible").length != 0) {
        valid = false;
      }
      
      if (valid != false) {
        $("#xmxxBtn").addClass("valid");
      } else {
        $("#xmxxBtn").removeClass("valid");
      }
      prepareVerify();
      
    }
    
    // 获取详细描述
    function getXXMS(id) {
      $.post("/CpzcFb/GetXxqk", {fpid: id}, function(data) {
        var xxms = data.result;
        
        // 插入数据
        var contents = eval('(' + data.result.text+ ')');
        var html;
        
        if (contents.length != 0) {
          $(".edit-area").html("");
        }
        
        for (var i=0; i<contents.length; i++) {
          var obj =  contents[i] ;
          if (obj.type == 1) {
            html = template("edit-text-templet", obj);
            $(".edit-area").append(html);
          } else if (obj.type == 2) {
            obj.domain = dhw.imgurl;
            html = template("edit-img-template", obj);
            $(".edit-area").append(html);
          }
        }
      });
    }
    
    // 存储详细描述
    function setXXMS(id) {
      var video = $("#xxmsVideo").text(),
          text = [];
      
      $(".edit-box").each(function() {
        var obj = {};
        if ($(this).hasClass("edit-text")) {
          obj.type = 1;
          var title = $(this).find(".edit-text-title").text();
          obj.title = $("<div></div>").text(title).html();
          var content = $(this).find(".edit-text-content").text();
          obj.content = $("<div></div>").text(content).html();
          text.push(obj);
        } else if ($(this).hasClass("edit-img")) {
          var ssrc = $(this).find(".browse-img").attr("ssrc");
          if (ssrc != "") {
            obj.type = 2;
            obj.url = ssrc;
            text.push(obj);
          }
        }
      });
      
      var textStr = JSON.stringify(text);
      
      // 传输值
      $.post("/CpzcFb/FbXxqk", {
        fpid: id,//项目ID
        video: video,//宣传视频
        text: textStr//详细内容
      }, function() {
       // setSuccess("详细描述");
      });
      
      // 验证填写是否合法
      var valid = true;
      if (text.length < 1) {
        valid = false;
      }
      
      if (valid != false) {
        $("#xxmsBtn").addClass("valid");
      } else {
        $("#xxmsBtn").removeClass("valid");
      }
      prepareVerify();
      
    }
    
    // 获取回报设置
    function getHBSZ(id) {
      $.post("/CpzcFb/GetHb", {fpid: id}, function(data) {
        data.domain = dhw.imgurl;
        if (data.result.length == 0) {
          var isEmpty = true;
          data.result = [{img:""}];
        } 
          var html = template("return-box-template", data);
          $(".return-box-wrap").html(html)
          if (isEmpty) {
            $(".return-box").addClass("addition");
          }
          // 绑定图片上传
          $(".return-box-wrap").find(".browse").each(function() {
            bindImg($(this));
          });

      });
    }
    
    // 存储回报设置
    function setHBSZ(id) {
      var returns = [];
      $(".return-box").each(function() {
        if (!$(this).hasClass("addition")) {
          var item = {};
          item.id = $(this).attr("data-id")? $(this).attr("data-id") : null;
          item.fpid = id;
          var hbType = $(this).find(".form-radio-item.current");
          item.type = (hbType.hasClass(".return-type-substance"))? 1 : 0;
          item.img = $(this).find(".browse-img").attr("ssrc");
          item.sum = $(this).find(".hbszSum").val();
          item.title = $(this).find(".hbszTitle").val();
          item.text = $(this).find(".hbszContent").val();
          item.Places = $(this).find(".hbszNumber").val();
          item.Shipment = $(this).find(".hbszShipment").val();
          item.paytime = $(this).find(".hbszPaytime").val();
          returns.push(item);
        }
      });
      var returnStr = JSON.stringify(returns);
      
      $.post("/CpzcFb/hb", {hbs:returnStr, fpid:id}, function() {
       // setSuccess("回报设置");
      });
      
      // 验证填写是否合法
      var valid = true;
      if (returns.length < 1) {
        valid = false;
      }
      if (valid != false) {
        $("#hbszBtn").addClass("valid");
      } else {
        $("#hbszBtn").removeClass("valid");
      }
      prepareVerify();
    }
    
    // 获取预览
    function getYL(id) {
      $.post("/CpzcFb/detailHbYl", {
        fpid: id//项目ID
      }, function(data) {
        var yl = data.result;
        yl.domain = dhw.imgurl;
        if (yl.tjbq != "") {
          yl.tjbqarray = yl.tjbq.split(",");
        }
        if (yl.zdy != "") {
          yl.zdyarray = yl.zdy.split(",");
        }
        var html = template("yl-template", yl);
        $(".form-body.yl").html(html);
      });
    }
    
    // 切换标签
    (function() {
      // 取得页面宽度
      var _width = $("body").width();
    
      // 取得要切换的目标元素
      var form_bodys = $(".form-body");
      var form_footer_btns = $(".form-footer-btns");
      
      // 切换方法
      function move(direction, index, o_index) {
        // 存储数据
        switch (o_index) {
          case 0:
            setJBXX(id);
            break;
          case 1:
            setXMXX(id);
            break;
          case 2:
            setXXMS(id);
            break;
          case 3:
            setHBSZ(id);
            break;
        }
        // 加载数据
        switch (index) {
          case 0:
            getJBXX(id);
            break;
          case 1:
            getXMXX(id);
            break;
          case 2:
            getXXMS(id);
            break;
          case 3:
            getHBSZ(id);
            break;
          case 4:
            getYL(id);
            break;
        }
        
        if (direction == "left") {
          $(".zc-form-wrap").css({
            "left": 0,
            "right": ""
          });
        } else {
          $(".zc-form-wrap").css({
            "left": "",
            "right": 0
          });
        }
        var a = {}, b = {};
        a[direction] = - _width + "px";
        b[direction] = 0;
        
        $(".zc-form-wrap").animate(a, "fast", function() {
          form_bodys.each(function() {
            $(this).hide();
          });
          form_bodys[index].style.display = "block";
          form_footer_btns.each(function() {
            $(this).hide();
          });
          form_footer_btns[index].style.display = "block";
        }).hide().queue(function(next) {
          $(this).css(direction, _width + "px");
          next();
        }).show().animate(b, "fast");
      }
      
      // 点击顶部大标签进行切换
      $(".form-header-item").click(function() {
        if ($(this).hasClass("current")) {
          return false;
        }
        
        var o_index,
            index;
        if ($(".form-header-item.current").is(".form-header-preview")) {
          o_index = 4;
        } else {
          o_index = $(".form-header-item.current").index();
        }
        if ($(this).is(".form-header-preview")) {
          index = 4;
        } else {
          index = $(this).index()
        }
    
        $(".form-header-item").each(function() {
          $(this).removeClass("current");
        })
        $(this).addClass("current");     
        
        if (o_index < index) {
          move("left", index, o_index);
        } else {
          move("right", index, o_index)
        }
        return false;
      });
      
      // 点击 上一步/下一步 切换
      $(".form-footer-btns .form-footer-btn").click(function() {
        var index = $(this).parent().index();
        $(".form-header-item").each(function() {
          $(this).removeClass("current");
        });
        
        if ($(this).hasClass("next-btn")) {
          $($(".form-header-item")[index+1]).addClass("current");
          move("left", index + 1, index);
        } else if ($(this).hasClass("prev-btn")) {
          $($(".form-header-item")[index-1]).addClass("current");
          move("left", index - 1, index);
        }
      });
    })();
  });