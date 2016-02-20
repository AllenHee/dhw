(function($) {
  $.fn.extend({
    mask: function() {
      $(this).bind("mouseenter mouseleave", function(e) {
        //判断鼠标从哪个方向进入或离开
        var w = $(this).width();
        var h = $(this).height();
        var x = (e.pageX - this.offsetLeft - (w / 2)) * (w > h ? (h / w) : 1);
        var y = (e.pageY - this.offsetTop - (h / 2)) * (h > w ? (w / h) : 1);
        var direction = Math.round((((Math.atan2(y, x) * (180 / Math.PI)) + 180) / 90) + 3) % 4;
        
        //遮罩层
        var mask_elem = $(this).find("div");
        
        //根据方向处理遮罩层的动画
        if(e.type == 'mouseenter') {
          switch (direction) {
            case 0:
              mask_elem.hide().animate({"top": "-100%", "left": 0}, 0).show().animate({"top": 0}, 0);
              // 等价于下面的写法
              // mask_elem.hide(0) //隐藏遮罩层
              //         .queue(function(next) {$(this).css({"top": "-100%", "left": 0}); next();}) //移动遮罩层到对应方向的外围
              //         .show(0) //显示遮罩层
              //         .queue(function(next) {$(this).css({"top": 0}); next();});  //移动遮罩层到可见区域
              break;
            case 1:
              mask_elem.hide().animate({"left": "100%", "top": 0}, 0).show().animate({"left" : 0}, 0);
              break;
            case 2:
              mask_elem.hide().animate({"left": 0, "top": "100%"}, 0).show().animate({"top" : 0}, 0);
              break;
            case 3:
              mask_elem.hide().animate({"left": "-100%", "top": 0}, 0).show().animate({"left" : 0}, 0);
              break;
          }
        } else {
          switch (direction) {
            case 0:
              mask_elem.css({"left": 0, "top": "-100%"});
              break;
            case 1:
              mask_elem.css({"left": "100%", "top": 0});
              break;
            case 2:
              mask_elem.css({"left": 0, "top": "100%"});
              break;
            case 3:
              mask_elem.css({"left": "-100%", "top": 0});
              break;
          }
        }
      })
    }
  });
})(jQuery);