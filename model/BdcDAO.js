var base = require('./BaseDAO.js');
var mysql = require('mysql');

exports.register=function(inform , callback){
	var sqlQuery = 'INSERT INTO bdc_table set ?'
	base.insert(sqlQuery , inform , callback);
}

exports.findCurOwn = function(uid , callback){
	var sqlQuery = 'SELECT bid, bd_date , usable , bdc_num from bdc_table WHERE current_own = ' + mysql.escape(uid);
	base.select(sqlQuery , callback);
}

exports.disabled = function(bid , myUid , callback){
	var sqlQuery = 'UPDATE bdc_table SET usable = ' + mysql.escape(false) + ' WHERE bid = ' +mysql.escape(bid) + ' AND current_own = ' + mysql.escape(myUid);
	base.update(sqlQuery , callback);
}

exports.abled = function(bid , myUid , callback){
	var sqlQuery = 'UPDATE bdc_table SET usable = ' + mysql.escape(true) + ' WHERE bid = ' +mysql.escape(bid) + ' AND current_own = ' + mysql.escape(myUid);
	base.update(sqlQuery , callback);
}

exports.updateCurOwn = function(bid , myUid , callback){
	var sqlQuery = 'UPDATE bdc_table SET current_own = ' +mysql.escape(myUid) + ' WHERE bid = ' +mysql.escape(bid);
	base.update(sqlQuery , callback);
}