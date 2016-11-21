var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var Session = require('express-session');
var redis = require('redis');
var redisStore = require('connect-redis')(Session);

var config = require('./helper/config');

var client = redis.createClient(config.redisConfig.port , config.redisConfig.host , {no_ready_check: true});

var index = require('./routes/index');
var login = require('./routes/login_chk');
var register = require('./routes/register');
var verifyMail = require('./routes/verify');

var CookiePaser = cookieParser(config.secretKey);
var sessionStore = new redisStore({client : client});

var session = new Session({
	store: sessionStore,
	cookie:{
		maxAge: 1000 * 60 * 60,
		 secure: false 
	},
	key : config.sessionKey,
	resave : false,
    saveUninitialized : false,
    secret: config.secretKey
});


var app = express();

//app.set('port', 80);
//app.listen(app.get('port'));

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(CookiePaser);
app.use(session);
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', index);
app.use('/login' , login);
app.use('/register' , register);

var url = require('url');
var decryptHelper = require('./helper/DecryptHelper');



app.use('/verify',
function (req,res,next){
	var parseObject = url.parse(req.url);
	if(parseObject.query==null){
		res.render('invalid' , {});
	} else{
		var sessionId = decryptHelper.decryptEmail(parseObject.query);
		sessionStore.get(sessionId , function(err , session){
			if(session==undefined){
				res.render('invalid' , {});
			} else{				
				req.session.inform = session.inform;
				next();
			}
		});
	}}, verifyMail); //세션스토어에서 확인작업

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
