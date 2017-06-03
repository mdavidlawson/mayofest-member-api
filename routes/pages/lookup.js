
var exports = module.exports;
exports.init = function(req, res){

      var scripts = [
        {script: 'js/admin-lookup.js'},
        {script: "bower_components/handlebars/handlebars.js"},
        {script: "bower_components/datatables.net/js/jquery.dataTables.js"}
      ];
      var styles = [
        {script: "bower_components/datatables.net-dt/css/jquery.dataTables.min.css"}
      ]
      var context = {
        layoutData: {
        title: 'Member Lookup',
        subtitle: "Members",
        scripts: scripts,
        styles: styles,
        meta: {
          author: 'Dave Lawson',
          description: '',
          keywords: '',
          robots: ''
        }
      }
    };
  res.render("pages/admin-lookup", context);
}
