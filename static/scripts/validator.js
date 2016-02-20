// 表单验证
var regs = {
  name: /^[\u4e00-\u9fa5]{2,5}$/,
  id: /(^\d{15}$)|(^\d{17}(\d|X)$)/,
  email: /^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/,
  mobile: /^\d{10,15}$/,
  normal: /^[\u4e00-\u9fa5_a-zA-Z0-9_]+.*$/,
  fundmoney: /(^[5-9]\d{2}$)|(^[1-9]\d{3,7}$)|(^100000000$)/,
  fundtime: /(^[1-8]?[0-9]?$)|(^90$)/,
  supportmoney: /^\d{1,6}$/,
  quota: /^\d{1,3}$/
  
}

function check() {
  var input_type = $(this).attr("type");
  var input_value = $(this).val();
  var elem = $(this).parent().find(".form-error-tip");
  
  switch (input_type) {
    case "normal":
      valid(input_value, regs.normal, elem);
      break;
    case "name":
      valid(input_value, regs.name, elem);
      break;
    case "id":
      valid(input_value, regs.id, elem);
      break;
    case "mobile":
      valid(input_value, regs.mobile, elem);
      break;
    case "fundmoney":
      valid(input_value, regs.fundmoney, elem);
      break;
    case "fundtime":
      valid(input_value, regs.fundtime, elem);
      break;
    case "supportmoney":
      valid(input_value, regs.supportmoney, elem);
      break;
    case "quota":
      valid(input_value, regs.quota, elem);
      break;
    case "tag":
      var o_tags = input_value.split(" ");
      var tags = new Array();
      for (var i=0; i<o_tags.length; i++) {
        if (o_tags[i] != "") {
          tags.push(o_tags[i])
        }
      }
      
      if (tags.length > 3) {
        $(this).next().text("*最多输入三个自定义标签").show();
      } else {
        for (var j=0; j<tags.length; j++) {
          if (tags[j].length > 5) {
            $(this).next().text("*每个标签不超过5个汉字").show();
          } else {
            $(this).next().hide()
          }
        }
      }
      break;
  }
  
  function valid(input_value, reg, elem) {
    if (! reg.test(input_value)) {
        elem.show();
      } else {
        elem.hide();
      }
  }
}

$(".form-body").on("input propertychange", "input", check);
$(".form-body").on("blur", "input", check);