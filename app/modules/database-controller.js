var Client = require("mariasql");
var c = new Client({
  host: '127.0.0.1',
  user: 'dave',
  password: 'XT977erm'
});

function show_dbs(){
  result = null;
  c.query("SHOW DATABASES",null, {useArray: true}, function(err, rows){
    if (err){
      throw err;
    }
    result = rows;
  });
  c.end();
  return rows;
}
