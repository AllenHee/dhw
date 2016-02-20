$(function() {
  $(".content").on("click", ".formInputSet_input-select, .selectArrow", function(event) {
    var selectBox = $(this).parent().find(".selectArrow").next();
    var isVisible = selectBox.is(":visible");
    if (!isVisible) {
      selectBox.slideDown("fast");
    } else {
      selectBox.slideUp("fast");
    }
    event.stopPropagation();
  });
  $("body").click(function() {
    $(".selectItems").slideUp("fast");
  })
  $(".content").on('click', '.selectItem', function(event) {
    var text = $.trim($(this).text());
    $(this).parents(".formInputSet_inputWrap").find(".formInputSet_input").val(text);
    $(this).parents(".formInputSet_inputWrap").find(".selectItems").hide();
    event.stopPropagation();
  });
  
  // radio
  $(".formInputSet_radio").click(function() {
    $(".formInputSet_radio").css({
      "background-position": "0 0"
    });
    $(this).css({
      "background-position": "0 -20px"
    });
  });
});