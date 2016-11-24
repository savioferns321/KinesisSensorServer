var mysql = require('mysql');
exports.login = function(req, res){
console.log("hello");
console.log(req.body.username);
console.log(req.body.password);
var con = mysql.createConnection({
	  host     : 'mysql2.cf0nl4bnjdro.us-west-2.rds.amazonaws.com',
	  user     : 'root',
	  password : 'sreekar26',
	  port     : '3306',
	  database : 'cmpe281'
	});
con.connect();
var sql = "SELECT * FROM user WHERE firstname = ? and password = ?";
var inserts = [req.body.username,req.body.password];
sql = mysql.format(sql, inserts);
console.log(sql);
con.query(sql, function(err, rows, fields) {
  if (!err){
    console.log('The solution is: ', rows);
  if(rows.length>0){
    res.send("success");
  }
  else{
	  res.send("not found");
  }
  }
  else{
    console.log('Error while performing Query.');
   res.send("error"); 
  }
});
con.end();
};