var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var Session = require('express-session');
var redis = require('redis');
var redisStore = require('connect-redis')(Session);

var passport = require('./helper/passport.js').passport;

var config = require('./helper/config');

var client = redis.createClient(config.redisConfig.port , config.redisConfig.host , {no_ready_check: true});



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
app.use(express.static(path.join(__dirname, 'public')));
app.use(favicon(path.join(__dirname, 'public', 'img/favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(CookiePaser);
app.use(session);

app.use(passport.initialize());
app.use(passport.session());

exports.passport = passport;

var index = require('./routes/index');
var login = require('./routes/login_chk');
var register = require('./routes/register');
var verifyMail = require('./routes/verify');
var success_mail = require('./routes/success_mail');
var logout = require('./routes/logout');
var about = require('./routes/about');
var rdc = require('./routes/rdc');
var donor = require('./routes/donor');
var myPage = require('./routes/myPage');
var commu = require('./routes/commu');


app.use('/', index);
app.use('/login',notensureAuthenticated, login);
app.use('/register',notensureAuthenticated, register);
app.use('/success_mail',notensureAuthenticated, success_mail);
app.use('/logout' , logout);
app.use('/about' , about);
app.use('/rdc' , ensureAuthenticated , rdc);
app.use('/donor' , ensureAuthenticated  , donor);
app.use('/myPage' , ensureAuthenticated  , myPage);
app.use('/commu' , ensureAuthenticated, commu);

function ensureAuthenticated(req, res, next) {
    // 로그인이 되어 있으면, 다음 파이프라인으로 진행
    if (req.isAuthenticated()) { return next(); }
    // 로그인이 안되어 있으면, 만료된 페이지 
    res.render('invalid' , {title:'피플'});
}

function notensureAuthenticated(req, res, next) {
    // 로그인이 되어 있으면, 다음 파이프라인으로 진행
    if (req.isAuthenticated()) { res.redirect('/'); }
    // 로그인이 안되어 있으면, 만료된 페이지 
    return next();
}

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
