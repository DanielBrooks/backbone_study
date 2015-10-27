$(function() {

  $('#datepicker').datetimepicker({
    inline: true,
    sideBySide: true,
    minDate: new Date()
  });
  $('#datepicker').on('dp.change', function() {
    console.log($(this).data("DateTimePicker").viewDate().toDate());
    console.log($(this).data("DateTimePicker").viewDate().valueOf());
  });

});