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
        {"data": "status"},
        {"data": "checkinStatus"}
    ],
    select: "single",
    dom: 'Bfrtip',
    buttons: [
        _make_custom_button("Reload", doReload),
        _make_custom_button("Add", doAdd),
        _make_custom_button("Edit", doEdit),
        _make_custom_button("Remove", doRemove),
        _make_custom_button("View", doView),
        _make_custom_button("Checkin Member", doCheckin),
        _make_custom_button("View Billing Info", doViewBilling)
    ],rowCallback: function(row, data, index) {
    if (data[3] == 'BANNED') {
      $(row).find('td:eq(3)').addClass('banned-member');
    }
  }
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
function doCheckin(e, dt, node, config){
  var selectedItem = _get_single_selected();
  if (!selectedItem){
    console.log("Will not delete, nothing selected.");
    return;
  }
  selectedItem.checkinStatus = true
  $.ajax({
    url: window.location.origin + "/api/member/"+selectedItem._id,
    data: selectedItem,
    type: 'put'
  }).fail(function(err){
    alert("There was an error updating this record. " + err.message);
    return;
  }).done(function(){
    console.log("Updated");
    doReload();
  });

}
function doViewBilling(e, dt, node, config){
  var selectedItem = _get_single_selected();
  if (!selectedItem){
    console.log("Will not edit, nothing selected.");
    return;
  }
  var filterKeys = ["__v", "_id", "memberForOrder", "lineItemsForOrder", "memberNumber"];
  var lineItemFilterKeys = ["__v", "_id", "orderForLineItem", "price", "fufillmentStatus"];
  $("#billing-info-header").text("LLS Member: " + selectedItem.memberNumber + " Billing Information");
  var $container = $("#billing-info");
  $container.empty();
  $.getJSON(window.location.origin + "/api/order/memberNumber/"+selectedItem.memberNumber, function(billingInfo){
    if (!billingInfo){
      console.log("billing info missing");
      return;
    }
    $container.append("<h3>Order "+billingInfo["ssOrderId"]+" Info</h3>");
    for (var dataKey in billingInfo){
      if (filterKeys.includes(dataKey)) continue;

      var $label = $("<label class='control-label'></label>");
      $label.text(dataKey);

      var $component = $("<p class='form-control-static'></p>");
      $component.text(String(billingInfo[dataKey]));

      var $formGroup = $("<div class='form-group'></div>");
      $formGroup.append($label).append($component);
      $container.append($formGroup);
    }
    if (!billingInfo["lineItemsForOrder"]){
      return;
    }
    for (var lineItemInfoIndex in billingInfo["lineItemsForOrder"]){
      var lineItemInfo = billingInfo["lineItemsForOrder"][lineItemInfoIndex];
      var adjustedLineItemIndex = Number(lineItemInfoIndex) + 1;
      $container.append("<h4>Line Item #"+adjustedLineItemIndex+"</h4>");
      for (dataKey in lineItemInfo){
        if (filterKeys.includes(dataKey)) continue;

        var $label = $("<label class='control-label'></label>");
        $label.text(dataKey);

        var $component = $("<p class='form-control-static'></p>");
        $component.text(String(lineItemInfo[dataKey]));

        var $formGroup = $("<div class='form-group'></div>");
        $formGroup.append($label).append($component);
        $container.append($formGroup);
      }
    }
  }).fail(function(error){
    alert("Cannot get billing information: " + error.message);
  });
  $("#view-billing-info").modal({
    view: true
  });
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
      }).fail(function(error){
        alert("Failed to delete member! " + error.message);
        return;
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
        if (name === "checkinStatus") {
          if (data.data[name]){
            $("[name='checkinStatus']").attr("checked", "")
          } else {
            $("[name='checkinStatus']").removeAttr("checked")
          }
        }
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
    }).fail(function(error){
      alert("Failed to get member! " + error.message);
      return;
    });

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
  var serializedForm = $("#membership-intake").serialize();
  $.getJSON("/api/member/email/"+ $("#email-input").val(), function(data){
    if (data && data.data && data.data.length > 0 && data.data[0]) {
      var member = data.data[0];
      if (member.status === "BANNED") {
        alert("The email entered is flagged - please contact Tuckshop Section Leader / directors");
      } else {
        alert("Member email already in the system, please update record instead");
      }
      return;
    }
    $.post(window.location.origin + "/api/member", serializedForm)
      .done(function() {
        console.log("Success");
        doReload();
      }).fail(function(error) {
        alert("Failed to add member: " + error.message)
      }).always(function(){
        console.log( "done" );
      });
    });
}
function onEdit(id){
    var formData = $("#membership-intake").serialize();
    formData += "&checkinStatus=" + $("[name='checkinStatus']")[0].checked;
    $.ajax({
      url: window.location.origin + "/api/member/"+id,
      data: formData,
      type: 'put'
    }).fail(function(error){
      alert("Failed to edit member: " + error.message);
    }).done(function(){
      console.log("Updated");
      doReload();
    });
}
