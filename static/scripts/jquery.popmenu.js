(function($) {
  $.fn.extend({
    popmenu: function() {
      // 找到大菜单下的各个分项
      $(this).find(".pop-menu-item").mouseover(function() {
        $(this).parent().css("border-color", "#fff"); // 隐藏大菜单边框
        $(this).css("border-color", "#e1e1e1"); // 显示分项边框
        $(this).find("dl").css("z-index", "102"); // 给固定项设置更高的z-index
        // 计算弹出项的位置
        var sub =  $(this).find(".pop-menu-sub");
        var sub_top = - ($(this).find(".pop-menu-sub").height() - $(this).height()) / 2;
        // 如果位置超出整个大内容区，重置位置为-1
        var index =$(this).parent().find(".pop-menu-item").index($(this));
        item_top = ($(this).height() + 2) * index;
        if (-sub_top > item_top) {
          sub_top = -1
        }
        // 设置弹出项目的位置，再显示弹出项
        sub.css("top", sub_top)
           .show();
      }).mouseout(function() {
        $(this).parent().css("border-color", "#e1e1e1");
        $(this).css("border-color", "#fff");
        $(this).find("dl").css("z-index", "100");
        $(this).find(".pop-menu-sub").hide();
      });
    }
  });
})(jQuery);