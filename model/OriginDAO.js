var base = require('./BaseDAO.js');
var mysql = require('mysql');

exports.findOriginName = function(name , callback){
	name = '\'%'+ name + '%\'';
	var sqlQuery = 'SELECT * FROM origin_table WHERE origin_name LIKE ' +name+ ' LIMIT 5';
	base.select(sqlQuery , callback);
}