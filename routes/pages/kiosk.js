
var exports = module.exports;
exports.init = function(req, res){

      var scripts = [
        {script: 'js/kiosk.js'}
      ];
      // var styles = [
      //   {script: "bower_components/datatables.net-dt/css/jquery.dataTables.min.css"},
      //   {script: "bower_components/datatables.net-buttons-dt/css/buttons.dataTables.min.css"},
      //   {script: "bower_components/datatables.net-select-dt/css/select.dataTables.min.css"}
      // ]
      var context = {
        layoutData: {
        title: 'Self Serve Kiosk',
        scripts: scripts,
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
