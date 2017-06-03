var exports = module.exports;
exports.init = function(req, res){

      var scripts = [
        {script: 'js/member-intake.js'},

      ];
      var context = {layoutData: {
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
    res.render('home', context);
}
