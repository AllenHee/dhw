function loadData(path, para, templateID, targetElem, fn, pagination, fn2) {
  $.post(path, para, function(data) {
    if (fn) {
      fn(data);
    }
    if (window.dhw) {
      data.result.domain = dhw.imgurl;
      data.result.staticDomain = dhw.staticurl;
    }
    var html = template(templateID, data.result);
    $(targetElem).html(html);
    if(data.result.total === 0) {
      return;
    }
    // 分页模块
    $((pagination? pagination : ".pagination")).paging(data.result.total, {
      format: '[< nncnn >]',
      perpage: para.pageSize,
      page: para.pageIndex,
      onSelect: function (page) {
        // Ajax请求
        if (page != para.pageIndex) {
          var paraCopy = $.extend({}, para);
          paraCopy.pageIndex = page;
          loadData(path, paraCopy, templateID, targetElem, fn, pagination, fn2);
        }
         if (fn2) {
           fn2(data, para.pageIndex)
         }
      },
      onFormat: function (type) {
        switch (type) {
          case 'block':
            if (!this.active)
              return '<span class="disabled">' + this.value + '</span>';
            else if (this.value != this.page)
              return '<em><a href="#' + this.value + '">' + this.value + '</a></em>';
            return '<span class="current">' + this.value + '</span>';
      
          case 'next':
            if (this.active)
              return '<a href="#' + this.value + '" class="next">下一页</a>';
            return '<span class="disabled">下一页</span>';
      
          case 'prev': 
            if (this.active)
              return '<a href="#' + this.value + '" class="prev">上一页</a>';
            return '<span class="disabled">上一页</span>';
      
          case 'first':
            if (this.active)
              return '<a href="#' + this.value + '" class="first">首页</a>';
            return '<span class="disabled">首页</span>';
      
          case 'last':
            if (this.active)
              return '<a href="#' + this.value + '" class="last">尾页</a>';
            return '<span class="disabled">尾页</span>';
      
          case "leap":
            if (this.active)
              return "   ";
            return "";
      
          case 'fill':
            if (this.active)
              return "...";
            return "";
        }
      }
    });
  });
}