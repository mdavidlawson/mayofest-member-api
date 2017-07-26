$(document).ready(function(){
  $("#submission-alert").on('closed.bs.alert', function () {
    location.reload(true);
    window.location = window.location.pathname;
  });
  $("#save-member").click(function(e){
    console.log("in submission");
    e.preventDefault();
    var serializedForm = $("#kiosk-form").serialize();
    $.getJSON("/api/member/email/"+ $("#email-input").val(), function(data){
      if (data && data.data && data.data.length > 0 && data.data[0]) {
        var member = data.data[0];
        if (member.status === "BANNED") {
          alert("There was an issue processing your information, please provide your information to the tuckshop.");
        } else {
          alert("You've already given us your info!");
        }
        return;
      }
      $.post("/api/member", serializedForm)
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
        });
      }).fail(function(error){
        alert("Cannot get member by email: " + error.message);
      });
    });

})

function _onSuccessfulSave(memberNumber){
  alert("Thank you for providing your information and welcome to Mayofest! If you haven't got your wristband yet, please visit the tuck shop :) For your info, you're membership number is " + memberNumber);
}
function _onFailure(err){
  alert("There's a problem with your submission, please visit the tuck shop ");
}
