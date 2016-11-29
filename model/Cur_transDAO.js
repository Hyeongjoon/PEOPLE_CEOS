var base = require('./BaseDAO.js');
var mysql = require('mysql');


exports.register = function(inform , callback){
	var sqlQuery = 'INSERT INTO cur_trans_table SET ?';
	base.insert(sqlQuery , inform , callback);
}

exports.findCurToTrans = function(uid , callback){
	var sqlQuery = 'SELECT * from cur_trans_table WHERE from_id = ' + mysql.escape(uid);
	base.select(sqlQuery , callback);
}

exports.findCurFromTrans = function(uid , callback){
	var sqlQuery = 'SELECT * from cur_trans_table WHERE to_id = '+mysql.escape(uid);
	base.select(sqlQuery , callback);
}

exports.deleteTrans = function(bid , myUid , callback){
	var sqlQuery = 'DELETE FROM cur_trans_table WHERE bdc_id = ' + mysql.escape(bid) + ' AND from_id = ' + mysql.escape(myUid);
	base.deletion(sqlQuery , callback);
}
