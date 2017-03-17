var Client = require("mariasql");
var c = new Client({
  host: '127.0.0.1',
  user: 'dave',
  password: '*****',
  db: "ljls"
});
function post_query(err, rows, query_callback){
  if (err){
    console.log("Error!");
    throw err;
  }
  query_callback(rows);
}
function run_query(query_str, query_callback){
  c.query(query_str, null, function(err, rows){
    post_query(err, rows, query_callback);
  });
  c.end();
}
module.exports = {
  get_members: function(query_callback) {
    run_query("SELECT * FROM member", query_callback);
  }
}
