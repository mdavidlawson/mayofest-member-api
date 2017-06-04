$(document).ready(function(){
  _init_table();
  _setup_add();
});

function _init_table(){
  var $src = $("#member-table-template").html();
  var template = Handlebars.compile($src);
  $("#member-table-container").append(template());
  _wrap_table();
}
function _wrap_table(){
  $("#member-table").dataTable({
    "ajax": window.location.origin + "/api/member",
    "columns": [
        {"data": "memberNumber"},
        {"data": "name"},
        {"data": "email"},
        {"data": "status"}
    ],
    select: "single",
    dom: 'Bfrtip',
    buttons: [
        _make_custom_button("Reload", doReload),
        _make_custom_button("Add", doAdd),
        _make_custom_button("Edit", doEdit),
        _make_custom_button("Remove", doRemove),
    ]
  });
}
function _setup_add(){
  $("#save-changes").click(onAdd);
}
function _make_custom_button(text, handler){
  return {
      text: text,
      action: handler
  };
}
function _get_single_selected(){
  var selectedItems = $("#member-table").DataTable().rows( { selected: true } ).data();
  if (selectedItems.length === 0){
    return null;
  }
  return selectedItems[0];
}
/** Handler Methods **/
function doReload(e, dt, node, config){
    dt.ajax.reload();
}
function doReload(){
  $("#member-table").DataTable().ajax.reload();
}
function doAdd(e, dt, node, config){
  $("#intake-model").modal({
    show: true
  });
}
function doRemove(e, dt, node, config){
  var selectedItem = _get_single_selected();
  if (!selectedItem){
    console.log("Will not delete, nothing selected.");
    return;
  }
  $('#confirm-delete').modal({
      backdrop: 'static',
      keyboard: false
    })
    .one('click', '#delete-member', function(e) {

      $.ajax({
        url: window.location.origin + "/api/member/"+selectedItem._id,
        type: 'DELETE'
      }).done(function(){
        console.log("Deleted");
        doReload();
      });
    });
}
function doEdit(e, dt, node, config){
  console.log("Editing!");
}
function onAdd(e){
  $.post(window.location.origin + "/api/member", $("#membership-intake").serialize())
    .done(function() {
      console.log("Success");
      doReload();
    })
    .fail(function() {
      console.log( "error" );
    }).always(function(){
      console.log( "done" );
    });
}
