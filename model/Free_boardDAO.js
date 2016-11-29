var base = require('./BaseDAO.js');
var mysql = require('mysql');

exports.register = function(inform , callback){
	var sqlQuery = 'INSERT INTO free_board SET ?';
	base.insert(sqlQuery , inform , callback);
}

exports.findBoard = function(pageNum , count , callback){
	var start = (pageNum -1) * 10; //10은 한번에 보여줄 개수
	var sqlQuery = 'SELECT fid , writer , title ,reply_num, see_num , reg_date FROM free_board ORDER BY fid DESC LIMIT ' + start + ' , ' + count;
	base.select(sqlQuery , callback);
}

exports.findBoardContent = function(fid , callback){
	var sqlQuery = 'SELECT * from free_board WHERE fid = ' + mysql.escape(fid);
	base.select(sqlQuery , callback);
}


exports.updateSeenum = function(fid , callback){
	var sqlQuery = 'UPDATE free_board SET see_num = see_num + ' + mysql.escape(1) + ' WHERE fid = ' + mysql.escape(fid);
	base.update(sqlQuery , callback);
}


exports.subReplyNum = function(fid , callback){
	var sqlQuery = 'UPDATE free_board SET reply_num = reply_num - ' + mysql.escape(1) + ' WHERE fid = ' + mysql.escape(fid);
	base.update(sqlQuery , callback);
}

exports.deletion = function(fid , writer , callback){
	var sqlQuery = 'DELETE FROM free_board WHERE fid = ' + mysql.escape(fid) + ' AND writer = ' + mysql.escape(writer);
	base.deletion(sqlQuery , callback);
}