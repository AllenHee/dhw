$(function() {
  // 顶栏弹出框
  $(".sn-dropper").parent().mouseover(function() {
    var elem = $(this).find(".sn-dropper");
    elem.css({
      "position" : "absolute",
      "height" : "32px",
      "z-index" : "101",
      "background-color" : "#fff",
      "color" : "#666"
    });
    if (elem.is(".iconfont")) {
      elem.css({
        "border-left" : "1px solid #ccc",
        "border-right" : "1px solid #ccc"
      });
    }
    $(this).find(".sn-dropdown").show();
  }).mouseout(function() {
    var elem = $(this).find(".sn-dropper");
    elem.css({
      "position" : "relative",
      "background-color" : "transparent",
      "color" : "#a5a5a5"
    });
    if (elem.is(".iconfont")) {
      elem.css({
         "border-left" : "1px solid transparent",
         "border-right" : "1px solid transparent"
      });
    }
    $(this).find(".sn-dropdown").hide();
  })
  
  // 模拟select元素
  $(".select").click(function(e) {
    $(this).find("ul").toggle();
  });
  $(".select li").click(function() {
    $(".select span").text($(this).text())
  });
  $(document).click(function(){
    $(".select ul").hide();
  });
  $(".select").click(function(e){
    e.stopPropagation();
  });
  
  // 文本输入框原文字消失与复原
  // $("input").each(function() {
  //   if ($(this).hasClass("editable-text-title")) {
  //     return false;
  //   } else if (this.value == this.defaultValue) {
  //     $(this).css("color", "#aaa");
      
  //     $(this).focus(function() {
  //       if (this.value == this.defaultValue) {
  //         this.value = "";
  //         $(this).css("color", "#333");
  //       }
  //     }).blur(function() {
  //       if (this.value == "") {
  //         this.value = this.defaultValue;
  //         $(this).css("color", "#aaa");
  //       }
  //     });
  //   }
  // });
  
  // 标签切换显示
  var current = $(".tb-tabs .current");
  var index = $(".tb-tabs li").index(current);
  $(".tb-box-wrap>ul").eq(index).show();
  
  $(".tb-tabs li").click(function() {
    $(this).addClass("current");
    $(this).siblings().removeClass("current");
    var index = $(".tb-tabs li").index($(this));
    $(".tb-box-wrap>ul").hide()
                        .eq(index).show();
  });
  
  // 底栏微信弹出
  $(".contact a").eq(2).mouseover(function() {
    $(this).parent().find(".wechat").show();
  }).mouseout(function() {
    $(this).parent().find(".wechat").hide();
  });
  $(".contact a").eq(3).mouseover(function() {
    $(this).parent().find(".weibo").show();
  }).mouseout(function() {
    $(this).parent().find(".weibo").hide();
  });
  
  // 大选择框操作与弹出
  $(".filter-box div dd").click(function() {
    if ($(this).hasClass("more")) {
      return false;
    } else {
      $(this).siblings().css({"background-color": "#fff","color": "#333"})
             .end().css({"background-color": "#3d9ccc","color": "#fff"});
    }
  });
  $(".filter-box .has-more .more").mouseenter(function() {
    $(this).parent().next().show();
  }).parents(".has-more").mouseleave(function() {
    $(this).find("ul").hide();
  }).find("li").click(function() {
    $(this).parent().hide();
  });
  
  
  // 小选择框操作与弹出
  $(".filter-box-s .sort dd").click(function() {
    $(this).siblings().css({"background-color": "#fff","color": "#333"})
           .end().css({"background-color": "#3d9ccc","color": "#fff"});
  });
  $(".filter-box-s .has-more").click(function(e) {
    e.stopPropagation();
    $(this).next().toggle();
    $(this).find("i").toggleClass("rotate");
  });
  $(".filter-box-s dd li").click(function() {
    var text = $(this).text();
    $(this).parent().prev().find("span").text(text);
  });
  $(document).click(function() {
     $(".filter-box-s dd ul").hide();
  })
  
  //底部图片背景位置变化
  $(".icp_one").on("mouseover",function(){
      $(this).css("background-position","0px 0px");
    })
    .on("mouseout",function(){
      $(this).css("background-position","0px -60px");
    });
});


// Production steps of ECMA-262, Edition 5, 15.4.4.19
// Reference: http://es5.github.io/#x15.4.4.19
if (!Array.prototype.map) {

  Array.prototype.map = function(callback, thisArg) {

    var T, A, k;

    if (this == null) {
      throw new TypeError(' this is null or not defined');
    }

    // 1. Let O be the result of calling ToObject passing the |this| 
    //    value as the argument.
    var O = Object(this);

    // 2. Let lenValue be the result of calling the Get internal 
    //    method of O with the argument "length".
    // 3. Let len be ToUint32(lenValue).
    var len = O.length >>> 0;

    // 4. If IsCallable(callback) is false, throw a TypeError exception.
    // See: http://es5.github.com/#x9.11
    if (typeof callback !== 'function') {
      throw new TypeError(callback + ' is not a function');
    }

    // 5. If thisArg was supplied, let T be thisArg; else let T be undefined.
    if (arguments.length > 1) {
      T = thisArg;
    }

    // 6. Let A be a new array created as if by the expression new Array(len) 
    //    where Array is the standard built-in constructor with that name and 
    //    len is the value of len.
    A = new Array(len);

    // 7. Let k be 0
    k = 0;

    // 8. Repeat, while k < len
    while (k < len) {

      var kValue, mappedValue;

      // a. Let Pk be ToString(k).
      //   This is implicit for LHS operands of the in operator
      // b. Let kPresent be the result of calling the HasProperty internal 
      //    method of O with argument Pk.
      //   This step can be combined with c
      // c. If kPresent is true, then
      if (k in O) {

        // i. Let kValue be the result of calling the Get internal 
        //    method of O with argument Pk.
        kValue = O[k];

        // ii. Let mappedValue be the result of calling the Call internal 
        //     method of callback with T as the this value and argument 
        //     list containing kValue, k, and O.
        mappedValue = callback.call(T, kValue, k, O);

        // iii. Call the DefineOwnProperty internal method of A with arguments
        // Pk, Property Descriptor
        // { Value: mappedValue,
        //   Writable: true,
        //   Enumerable: true,
        //   Configurable: true },
        // and false.

        // In browsers that support Object.defineProperty, use the following:
        // Object.defineProperty(A, k, {
        //   value: mappedValue,
        //   writable: true,
        //   enumerable: true,
        //   configurable: true
        // });

        // For best browser support, use the following:
        A[k] = mappedValue;
      }
      // d. Increase k by 1.
      k++;
    }

    // 9. return A
    return A;
  };
}