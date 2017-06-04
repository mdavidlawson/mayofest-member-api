
var exports = module.exports;
exports.init = function(req, res){

      // var scripts = [
      //   {script: 'js/admin-lookup.js'},
      //   {script: "bower_components/handlebars/handlebars.js"},
      //   {script: "bower_components/datatables.net/js/jquery.dataTables.js"},
      //   {script: "bower_components/datatables.net-buttons/js/dataTables.buttons.min.js"},
      //   {script: "bower_components/datatables.net-buttons/js/buttons.print.min.js"},
      //   {script: "bower_components/datatables.net-buttons/js/buttons.html5.min.js"},
      //   {script: "bower_components/datatables.net-buttons/js/buttons.flash.min.js"},
      //   {script: "bower_components/datatables.net-buttons/js/buttons.colVis.min.js"},
      //   {script: "bower_components/datatables.net-select/js/dataTables.select.min.js"}
      // ];
      // var styles = [
      //   {script: "bower_components/datatables.net-dt/css/jquery.dataTables.min.css"},
      //   {script: "bower_components/datatables.net-buttons-dt/css/buttons.dataTables.min.css"},
      //   {script: "bower_components/datatables.net-select-dt/css/select.dataTables.min.css"}
      // ]
      var context = {
        layoutData: {
        title: 'Self Serve Kiosk',
        // scripts: scripts,
        // styles: styles,
        meta: {
          author: 'Dave Lawson',
          description: '',
          keywords: '',
          robots: ''
        }
      }
    };
  res.render("pages/kiosk", context);
}
