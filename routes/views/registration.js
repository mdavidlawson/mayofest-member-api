// "prepend event" functionality as a jQuery plugin
$.fn.extend({
  prependEvent: function (event, handler) {
    return this.each(function () {
      var events = $(this).data("events"),
          currentHandler;

      if (events && events[event].length > 0) {
        currentHandler = events[event][0].handler;
        events[event][0].handler = function () {
          handler.apply(this, arguments);
          currentHandler.apply(this, arguments);
        }
      }
    });
  }
});

$(document).ready(function(){
  // TODO this needs to point at the Squarespace button we'd like to control.
  $("#test-registration-trigger").prependEvent("click", function(){
    console.log("Checkout button clicked");
    onRegistrationButtonClick();
  });
});

function registerMember(member){
  console.log("Registering member")
}
function prepDialog(){
  // TODO probably should be done by a templating engine
  $(".modal-body").html($("#intake-container").html());
}

function raiseRegistrationDialog(){
  console.log("Raising dialog");
  prepDialog();
  $("#intake-model").modal();
}

function onRegistrationButtonClick(event){
  if (! $("#intake-model").hasClass("in")) {
    raiseRegistrationDialog();
  }
}
