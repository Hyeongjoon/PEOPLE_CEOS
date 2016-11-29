var base = require('./BaseDAO.js');
var mysql = require('mysql');

exports.loadWeekHistory = function(callback){
	var sqlQuery = 'select date , donate_num , bdc_num from hs order by date desc limit 7';
	base.select(sqlQuery , callback);
}

exports.load_com_and_bdc_num = function(callback){
	var sqlQuery = 'SELECT date , com_req_num , donate_num from hs order by date desc limit 7';
	base.select(sqlQuery , callback);
}