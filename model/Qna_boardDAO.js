var base = require('./BaseDAO.js');
var mysql = require('mysql');

exports.register = function(inform , callback){
	var sqlQuery = 'INSERT INTO qna_board SET ?';
	base.insert(sqlQuery , inform , callback);
}