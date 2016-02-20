var select_all = $(".select-all"),
  select_boxes = $(".list-content :checkbox");
select_all.click(function() {
  select_boxes.prop("checked", this.checked);
});
select_boxes.click(function() {
  select_all.prop("checked", select_boxes.length == select_boxes.filter(":checked").length);
});