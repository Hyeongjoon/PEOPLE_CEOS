var base = require('./BaseDAO.js');
var mysql = require('mysql');

exports.register = function(inform, callback) {
	var sqlQuery = 'INSERT INTO user set ?';
	base.insert(sqlQuery, inform, callback);
};

exports.findUserById = function(id , callback){
	var sqlQuery = 'SELECT * FROM user WHERE id = '+ mysql.escape(id);
	base.select(sqlQuery , callback);
}

exports.findUserByEmail = function(email , callback){
	var sqlQuery = 'SELECT * FROM user WHERE email = ' + mysql.escape(email);
	base.select(sqlQuery , callback);
}