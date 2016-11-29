var base = require('./BaseDAO.js');
var mysql = require('mysql');

exports.load5History = function(callback){
	sqlQuery = 'SELECT * FROM hs_week order by date_mon desc limit 5'
	base.select(sqlQuery , callback);
}