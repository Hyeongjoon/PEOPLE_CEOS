var base = require('./BaseDAO.js');
var mysql = require('mysql');

exports.register = function(inform , callback){
	var sqlQuery = 'INSERT INTO qna_board SET ?';
	base.insert(sqlQuery , inform , callback);
}

exports.findBoard = function(pageNum , count , callback){
	var start = (pageNum -1) * 10; //10은 한번에 보여줄 개수
	var sqlQuery = 'SELECT qid , writer , title , see_num, reply_num , reg_date FROM qna_board ORDER BY qid DESC LIMIT ' + start + ' , ' + count;
	base.select(sqlQuery , callback);
}

exports.findBoardContent = function(qid , callback){
	var sqlQuery = 'SELECT * from qna_board WHERE qid = ' + mysql.escape(qid);
	base.select(sqlQuery , callback);
}

exports.updateSeenum = function(qid , callback){
	var sqlQuery = 'UPDATE qna_board SET see_num = see_num + ' + mysql.escape(1) + ' WHERE qid = ' + mysql.escape(qid);
	base.update(sqlQuery , callback);
}

exports.subReplyNum = function(qid , callback){
	var sqlQuery = 'UPDATE qna_board SET reply_num = reply_num - ' + mysql.escape(1) + ' WHERE qid = ' + mysql.escape(qid);
	base.update(sqlQuery , callback);
}

exports.deletion = function(qid , writer , callback){
	var sqlQuery = 'DELETE FROM qna_board WHERE qid = ' + mysql.escape(qid) + ' AND writer = ' + mysql.escape(writer);
	base.deletion(sqlQuery , callback);
}