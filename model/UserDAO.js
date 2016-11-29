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

exports.findUserByNameNotMe = function(name, myUid , callback){
	var name = '\'%'+ name + '%\'';
	var sqlQuery = 'SELECT uid , phone_number, name FROM user WHERE uid != '+mysql.escape(myUid) +' AND name LIKE ' +name+ ' LIMIT 10';
	base.select(sqlQuery , callback);
}

exports.findNameByFromUidArr = function(uidArr , callback){
	var sqlQuery = 'SELECT name , uid FROM user WHERE uid = ';
	if(uidArr.length==0){
		callback(null , []);
	} else{
	for(var i = 0 ; i <uidArr.length ; i++){
		sqlQuery = sqlQuery + mysql.escape(uidArr[i].from_id) + ' OR uid = ';
	}
	sqlQuery = sqlQuery.substr(0, sqlQuery.length-9);
	base.select(sqlQuery , callback);
	}
}

exports.findNameByUidArr = function(uidArr , callback){
	var sqlQuery = 'SELECT name , uid FROM user WHERE uid = ';
	
	if(uidArr.length==0){
		callback(null , []);
	} else{
	for(var i = 0 ; i <uidArr.length ; i++){
		sqlQuery = sqlQuery + mysql.escape(uidArr[i]) + ' OR uid = ';
	}
	sqlQuery = sqlQuery.substr(0, sqlQuery.length-9);
	base.select(sqlQuery , callback);
	}
}