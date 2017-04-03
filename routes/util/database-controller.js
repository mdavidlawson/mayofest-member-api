var Client = require("mariasql");
var c = new Client({
  host: '127.0.0.1',
  user: 'dave',
  password: '****',
  db: "ljls"
});
function post_query(err, rows, query_callback){
  if (err){
    console.log("Error!");
    throw err;
  }
  query_callback(rows);
}
function run_query(query_str, data, query_callback){
  try{
    // query will call connect if it's not specified
    c.query(query_str, data, function(err, rows){
      post_query(err, rows, query_callback);
    });
  }finally{
    c.end();
  }
}
module.exports = {
  get_members: function(query_callback) {
    run_query("SELECT * FROM member", null, query_callback);
  },
  add_member: function(data, query_callback) {
    console.log("About to insert: " + JSON.stringify(data));
    //{"memberNumber":3327,"name":"test","email":"","address":",\n,\n, , \n ","status":"INACTIVE"}
    set_values="";
    // TODO clean this up and automate the query creation. mariasql doesn't support feeding dict objects in any other way :()
    run_query("INSERT INTO member SET memberNumber=:memberNumber, name=:name, email=:email, address=:address, status=:status", data, query_callback);
  },
  get_token: function(token, query_callback){
    run_query("SELECT * FROM token WHERE token=:token", {token:token}, query_callback);
  }
}
