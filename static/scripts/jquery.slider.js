(function($) {
  $.fn.extend({
    slide: function(isHorizontal, isResizeWindow, animaName) {
      // 默认值
      var defaults = {
        interval: 5000, // 滑动间隔
        speed: "fast",  // 滑动速度
        prev: ".s-prev",
        next: ".s-next",
        slider: "em",
      }
      
      var anima;
      if (animaName) {
        anima = animaName
      } else {
        anima = 'anima'
      }
      
      // 轮播元素和相关变量
      var elem = $(this); //
      var width_all = elem.width(),  // 图片总宽度
          height_all = elem.height();  // 图片总高度
      var count = elem.find("li").length; // 图片个数
      var width_single = width_all / count, // 单张图片宽度
          height_single = height_all / count; // 单张图片高度
      // 小滑动块和相关变量 
      var slider = $(".slider").find(defaults.slider);
      var s_width = slider.width(), // 小滑动块的宽度
          s_height = slider.height(); // 小滑动块的高度
      var s_items = $(this).parent().find('.slider').find("li"); // 小滑动块需要滑过的元素
      var s_gap_hor = parseInt(s_items.first().css("margin-bottom")),  // 水平外边距
          s_gap_ver = parseInt(s_items.first().css("margin-bottom"));  // 垂直外边距
      s_width += s_gap_hor;
      s_height += s_gap_ver;
      
      // 向左移动
      function slideLeft() {
        var pos = parseInt(elem.css("left"));
        if (pos > - width_single * (count - 1)) {
          elem.animate({"left" : pos - width_single + "px"}, {
            speed: defaults.speed,
            easing: 'linear'
          });
        } else {
          elem.animate({"left" : 0}, {
            speed: defaults.speed,
            easing: 'linear'
          });
        }
        // 小滑动向右移动
        if (slider.position()) {
          var s_pos = parseInt(slider.css("left"));
          if (s_pos < s_width * (count - 1)) {
            slider.animate({"left" : s_pos + s_width + "px"}, defaults.speed);
          } else {
            slider.animate({"left" : 0}, defaults.speed);
          }
        } else { // 非小滑动块、小块列表自身变化的情况
          var index = parseInt(- (pos / width_single));
          if (index + 1 == count) {
            $(".slider").find("li").removeClass("current")
                                   .eq(0).addClass("current");
          } else {
            $(".slider").find("li").removeClass("current")
                                   .eq(index + 1).addClass("current");
          }
        }
      }
      // 向右移动
      function slideRight() {
        var pos = parseInt(elem.css("left"));
        if (pos < 0) {
          elem.animate({"left" : pos + width_single + "px"}, {
            speed: defaults.speed,
            easing: 'linear'
          });
        } else {
          elem.animate({"left" : - width_single * (count - 1)}, {
            speed: defaults.speed,
            easing: 'linear'
          });
        }
        // 小滑动块向左移动
        if (slider.position()) {
          var s_pos = parseInt(slider.css("left"));
          if (s_pos > 0) {
            slider.animate({"left" : s_pos - s_width + "px"}, defaults.speed);
          } else {
            slider.animate({"left" : s_width * (count - 1)}, defaults.speed);
          }
        } else { // 非小滑动块、小块列表自身变化的情况
          var index = parseInt(- (pos / width_single));
          if (index == 0) {
            $(".slider").find("li").removeClass("current")
                                   .eq(count - 1).addClass("current");
          } else {
            $(".slider").find("li").removeClass("current")
                                   .eq(index - 1).addClass("current");
          }
        }
      }
      // 向上移动
      function slideTop() {
        var pos = parseInt(elem.css("top"));
        if (pos > - height_single * (count - 1)) {
          elem.animate({"top" : pos - height_single + "px"}, {
            speed: defaults.speed,
            easing: 'linear'
          });
        } else {
          elem.animate({"top" : 0}, {
            speed: defaults.speed,
            easing: 'linear'
          });
        }
        // 小滑动向下移动
        if (slider.position()) {
          var s_pos = parseInt(slider.css("top"));
          if (s_pos < s_height * (count - 1)) {
            slider.animate({"top" : s_pos + s_height + "px"}, defaults.speed);
          } else {
            slider.animate({"top" : 0}, defaults.speed);
          }
        }
      }
      // 向下移动
      function slideBottom() {
        var pos = parseInt(elem.css("top"));
        if (pos < 0) {
          elem.animate({"top" : pos + height_single + "px"}, {
            speed: defaults.speed,
            easing: 'linear'
          });
        } else {
          elem.animate({"top" : - height_single * (count - 1)}, {
            speed: defaults.speed,
            easing: 'linear'
          });
        }
        // 小滑动块向上移动
        if (slider.position()) {
          var s_pos = parseInt(slider.css("top"));
          if (s_pos > 0) {
            slider.animate({"top" : s_pos - s_height + "px"}, defaults.speed);
          } else {
            slider.animate({"top" : s_height * (count - 1)}, defaults.speed);
          }
        }
      }
      
      // 判断方向，开始轮播
      defaults[anima] = setInterval(function(){isHorizontal? slideLeft() : slideTop();}, defaults.interval);
      
      // 判断方向，鼠标悬停于elem的父元素时清除轮播、退出时恢复轮播
      elem.parent().mouseover(function() {
        clearInterval(defaults[anima]);
      }).mouseout(function() {
        defaults[anima] = setInterval(function(){isHorizontal? slideLeft() : slideTop();}, defaults.interval);
      }); 
      
      // 下一张按钮的点击行为
      elem.parent().find(defaults.next).click(function() {
        if (! elem.is(":animated")) {
          isHorizontal? slideLeft() : slideTop(); // 判断方向
        }
      });
      // 上一张按钮的点击行为
      elem.parent().find(defaults.prev).click(function() {
        if (! elem.is(":animated")) {
          isHorizontal? slideRight() : slideBottom(); // 判断方向
        }
      });
      
      //  小滑动块的悬停行为
      s_items.mouseover(function() {
        elem.stop(false, false);
        if (slider.position()) {
          slider.stop(false, false);
        }
        var s_index = $(this).index();
        // 判断方向，移动滑动元素
        isHorizontal?
        elem.animate({"left" : - width_single * s_index + "px"}, defaults.speed)
        :
        elem.animate({"top" : - height_single * s_index + "px"}, defaults.speed);
        // 判断方向，移动小滑动块
        if (slider.position()) {
          isHorizontal?
          slider.animate({"left" : s_width * s_index + "px"}, defaults.speed)
          :
          slider.animate({"top" : s_height * s_index + "px"}, defaults.speed);
        } else { //非小滑动块、小块列表自身变化的情况
          $(this).siblings().removeClass("current")
                 .end().addClass("current");
        }
      });
      
      // 窗口大小改变时,停止动画
      if (isResizeWindow) {
        $(window).resize(function() {
          // 停止
          clearInterval(defaults[anima]);
          // 调用外部函数重新调整滑动区相关数值
          //prepareSlide();
          // 重新调整脚本内部相关数值
          width_all = elem.width(),  // 图片总宽度
          height_all = elem.height();  // 图片总高度
          width_single = width_all / count, // 单张图片宽度
          height_single = height_all / count; // 单张图片高度
          
          // 恢复动画
          defaults[anima] = setInterval(function(){isHorizontal? slideLeft() : slideTop();}, defaults.interval);
        });
      }
    }
  });
})(jQuery);