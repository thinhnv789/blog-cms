var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var expressValidator = require('express-validator');
var sass = require('node-sass');
var sassMiddleware = require('node-sass-middleware');
var passport = require('passport');
var session = require('express-session');
var flash = require('express-flash');
const MongoStore = require('connect-mongo')(session);

// Configuration
var dbConfig = require('./src/config/dbConfig.json');
var Database = require('./src/config/dbconnection');

var index = require('./src/routes/index');
var user = require('./src/routes/user');
var role = require('./src/routes/role');
var media = require('./src/routes/media');
var category = require('./src/routes/category');
var post = require('./src/routes/post');
var product = require('./src/routes/product');
var tag = require('./src/routes/tag');
var slider = require('./src/routes/slider');

/**
 * Api for frontend
 */
var apiv1 = require('./src/routes/apis/v1');

/**
 * API keys and Passport configuration.
 */
const passportConfig = require('./src/config/passport');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'src/views'));
app.set('view engine', 'pug');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(expressValidator());
app.use(cookieParser());

// adding the sass middleware
app.use(
  sassMiddleware({
    src: __dirname + '/src/sass', 
    dest: __dirname + '/public', 
    debug: true, 
    outputStyle: 'compressed'
  })
);

// Use session
app.use(session({
  resave: true,
  saveUninitialized: true,
  secret: 'cms2017',
  store: new MongoStore({
    url: dbConfig.mongodb.address,
    autoReconnect: true,
    clear_interval: 3600
  })
}));

// Use passport
app.use(passport.initialize());
app.use(passport.session());

// User flash data
app.use(flash());

// Pass user login to client
app.use((req, res, next) => {
  // Allow request from all domain
  res.setHeader('Access-Control-Allow-Origin', '*');
  // Pass user logedin
  res.locals.user = req.user;
  next();
});

app.use('/libs', express.static(__dirname + '/node_modules/'));
app.use('/media', express.static(__dirname + '/media/'));
app.use(express.static(path.join(__dirname, '/public')));

app.use('/', index);
app.use('/user', user);
app.use('/role', role);
app.use('/media', media);
app.use('/category', category);
app.use('/post', post);
app.use('/product', product);
app.use('/tag', tag);
app.use('/slider', slider);

/**
 * Using router api/v1/...
 */
app.use('/api/v1', apiv1);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// Connect to mongo database
Database.config(
  dbConfig && dbConfig.mongodb && dbConfig.mongodb.address ? dbConfig.mongodb.address : '', 'sbadmin',
  
  dbConfig.mongodb && dbConfig.mongodb.options ? dbConfig.mongodb.options : undefined,
  function(err, message) {
    if (!err) console.info('  - Mongodb is connected');
    
  }
);

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
