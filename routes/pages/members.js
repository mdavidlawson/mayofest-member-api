var exports = module.exports;
exports.init = function(req, res){
    scripts = [{script: 'js/member-intake.js'}];
    res.render('home', {scripts: scripts});
}
