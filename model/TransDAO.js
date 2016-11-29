var base = require('./BaseDAO.js');
var mysql = require('mysql');

exports.register = function(inform , callback){
	var sqlQuery = 'INSERT INTO trans_bdc_table SET ?';
	base.insert(sqlQuery , inform , callback);
}

