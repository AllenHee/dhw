var y = 20,
    x = 10;
$(".img-icon span").mouseover(function(e) {
  this.tip = this.title;
  this.title = "";
  //图片路径根据实际情况做修改
  var $img_tip = $("<div class='img-tip'><img src='images/" + this.tip + "'></div>");
  $("body").append($img_tip);
  $(".img-tip").css({
  	"top" : e.pageY + y + "px",
  	"left" : e.pageX + x + "px"
  }).show();
}).mouseout(function() {
  this.title = this.tip;
  $(".img-tip").remove();
}).mousemove(function(e) {
  $(".img-tip").css({
    "top" : e.pageY + y + "px",
    "left" : e.pageX + x + "px"
  });
});