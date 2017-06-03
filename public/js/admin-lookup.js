$(document).ready(function(){
  _init_table();
});

function _init_table(){
  var $src = $("#member-table").html();
  var template = Handlebars.compile($src);
  _get_members().done(function(data){
    $("#member-table-container").append(template({members:data}));
  });
}

function _get_members(){
    return $.getJSON(window.location.origin + "/api/member");
}
