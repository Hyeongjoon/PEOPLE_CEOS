var base = require('./BaseDAO.js');
var mysql = require('mysql');

exports.findReply = function(qid , callback){
	var sqlQuery = 'SELECT writer , content , reg_date , qrid FROM qna_reply WHERE qid = ' + mysql.escape(qid);
	base.select(sqlQuery , callback);
}

exports.register = function(inform , callback){
	var sqlQuery = 'INSERT INTO qna_reply SET ?';
	base.lastInsertId(sqlQuery , inform , callback);
}

exports.deletion = function(qrid , writer , callback){
	var sqlQuery = 'DELETE FROM qna_reply WHERE qrid = ' + mysql.escape(qrid) + ' AND writer = ' + mysql.escape(writer);
	base.deletion(sqlQuery , callback);
}