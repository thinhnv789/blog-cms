var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var sass = require('node-sass');
var sassMiddleware = require('node-sass-middleware');

// Configuration
var dbConfig = require('./src/config/dbConfig.json');
var Database = require('./src/config/dbconnection');

var index = require('./src/routes/index');
var users = require('./src/routes/users');
var media = require('./src/routes/media');
var category = require('./src/routes/category');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'src/views'));
app.set('view engine', 'pug');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
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

app.use('/libs', express.static(__dirname + '/node_modules/'));
app.use('/media', express.static(__dirname + '/media/'));
app.use(express.static(path.join(__dirname, '/public')));

app.use('/', index);
app.use('/users', users);
app.use('/media', media);
app.use('/category', category);

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
