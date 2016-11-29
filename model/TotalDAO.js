var base = require('./BaseDAO.js');
var mysql = require('mysql');

exports.findTotalInfo = function(callback){
	sqlQuery = 'SELECT * FROM total'
	base.select(sqlQuery , callback);
}