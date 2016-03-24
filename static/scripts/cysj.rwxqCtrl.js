var tbApp = angular.module("toubiao",[]);
tbApp.controller("tbCtrl", ["$scope", function(s) {
  s.data = {};
  s.submit = function() {
    console.log(s.data)
    var para = $.extend({cpid: cpid},s.data);
    $.post("/Detail/AddTb",para).success(function(data) {
    });
  }
}])
.directive('fileUpload', function () {
  return {
    replace : true,
    scope : true,
    template : function (elem, attr) {
      return `<div>`+
       `<div class="wu-example formUploadImg">` +
              `<div class="uploader-list"></div>` +
              `<div class="btns">` +
                  `<div class="picker">选择文件</div>` +
              `</div>` +
        `</div>` + `</div>`;
      },
    link : function (scope, element, attrs) {
        //附件上传
        var uploader = WebUploader.create({
            auto: true,
            swf: '//cdn.dreamhiway.com/static/lib/Uploader.swf',
            server: dhw.fileuploadurl + '?key=diy',
            pick: element.find('.picker')[0],
            resize: false
       });
       uploader.on('fileQueued', function (file) {
          console.log(file)
          element.find('.formUploadImg').append('<div id="' + file.id + '" class="item">' +
          '<h4 class="info">' + file.name + '</h4>' +
          '<p class="state">等待上传...</p>' +
          '</div>');
      });
      uploader.on('uploadProgress', function (file, percentage) {
        var $li = element.find('#' + file.id),
          $percent = $li.find('.progress .progress-bar');

        // 避免重复创建
        if (!$percent.length) {
          $percent = $('<div class="progress progress-striped active">' +
            '<div class="progress-bar" role="progressbar" style="width: 0%">' +
            '</div>' +
            '</div>').appendTo($li).find('.progress-bar');
        }

        $li.find('p.state').text('上传中');

        $percent.css('width', percentage * 100 + '%');
      });

      uploader.on('uploadSuccess', function (file, res) {
        element.find('#' + file.id).find('p.state').text('已上传');
        scope.$parent.data[attrs.name] = res.path + res.name
      });

      uploader.on('uploadError', function (file) {
        element.find('#' + file.id).find('p.state').text('上传出错');
      });

      uploader.on('uploadComplete', function (file) {
        element.find('#' + file.id).find('.progress').fadeOut();
      });
     }
   }
 });