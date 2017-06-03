
var exports = module.exports;
exports.init = function(req, res){

      var scripts = [
        {script: 'js/admin-lookup.js'},
        {script: "bower_components/handlebars/handlebars.js"}

      ];
      var context = {
        layoutData: {
        title: 'Member Lookup',
        subtitle: "Members",
        scripts: scripts,
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
