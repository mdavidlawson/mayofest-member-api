$(document).ready(function(){
  $("#submission-alert").on('closed.bs.alert', function () {
    location.reload(true);
    window.location = window.location.pathname;
  });
  $("#save-member").click(function(e){
    console.log("in submission");
    e.preventDefault();
    $.post("/api/member", $("#kiosk-form").serialize())
      .done(function(data){
        _onSuccessfulSave(data.memberNumber);
      })
      .fail(function(err){
        _onFailure(err);
      })
      .always(function(){
        console.log("done")
        location.reload(true);
        window.location = window.location.pathname;
      })
  })
})

function _onSuccessfulSave(memberNumber){
  alert("Thank you for providing your information and welcome to Mayofest! If you haven't got your wristband yet, please visit the tuck shop :) For your info, you're membership number is " + memberNumber);
}
function _onFailure(err){
  alert("There's a problem with your submission, please visit the tuck shop ");
}
