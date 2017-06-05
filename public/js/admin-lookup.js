$(document).ready(function(){
  _init_table();
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
        _make_custom_button("View", doView)
    ]
  });
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
  $("#membership-intake")[0].reset();
  $("#intake-model").modal({
    show: true
  })
  .off("click", "#save-member")
  .one("click", "#save-member", function(e){
    console.log("Adding");
    onAdd();
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
  var selectedItem = _get_single_selected();
  if (!selectedItem){
    console.log("Will not edit, nothing selected.");
    return;
  }
  $("#membership-intake")[0].reset();
  $.getJSON(window.location.origin + "/api/member/"+selectedItem._id)
    .done(function(data){
      for (var name in data.data){
        $("[name='"+name+"']").val(data.data[name]);
      }
      $("#intake-model").modal({
        show: true
      })
      .off("click", "#save-member")
      .one("click", "#save-member", function(e){
        console.log("Updating");
        onEdit(selectedItem._id);
      });
    })

}
function doView(e, dt, node, config){
  var selectedItem = _get_single_selected();
  if (!selectedItem){
    console.log("Will not edit, nothing selected.");
    return;
  }
  var filterKeys = ["__v", "_id"];
  $("#member-info-header").text("LLS Member: " + selectedItem.memberNumber);
  var $container = $("#member-info");
  $container.empty();
  $container.append("<h3>Personal Info</h3>");
  for (var dataKey in selectedItem){
    if (filterKeys.includes(dataKey)) continue;

    var $label = $("<label class='control-label'></label>");
    $label.text(dataKey);

    var $component = $("<p class='form-control-static'></p>");
    $component.text(String(selectedItem[dataKey]));

    var $formGroup = $("<div class='form-group'></div>");
    $formGroup.append($label).append($component);
    $container.append($formGroup);
  }
  $("#view-member").modal({
    view: true
  });
}
function onAdd(){
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
function onEdit(id){
    $.ajax({
      url: window.location.origin + "/api/member/"+id,
      data: $("#membership-intake").serialize(),
      type: 'put'
    }).done(function(){
      console.log("Updated");
      doReload();
    });
}
