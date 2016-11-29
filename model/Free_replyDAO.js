var base = require('./BaseDAO.js');
var mysql = require('mysql');

exports.findReply = function(fid , callback){
	var sqlQuery = 'SELECT writer , content , reg_date , frid FROM free_reply WHERE fid = ' + mysql.escape(fid);
	base.select(sqlQuery , callback);
}


exports.register = function(inform , callback){
	var sqlQuery = 'INSERT INTO free_reply SET ?';
	base.lastInsertId(sqlQuery , inform , callback);
}

exports.deletion = function(frid , writer , callback){
	var sqlQuery = 'DELETE FROM free_reply WHERE frid = ' + mysql.escape(frid) + ' AND writer = ' + mysql.escape(writer);
	base.deletion(sqlQuery , callback);
}