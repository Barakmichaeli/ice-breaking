var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var game = require('./routes/game');
var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// uncomment after placing your favicon in /public
var num = 1;
var obj = {};


//Redirect
app.get('/createRoom', function (req, res, next) {
    obj[num] = "OK";
    console.log(obj[num]);
    res.redirect(302, "/room/" + (num++));
});

/* GET new rooms */
app.get("/room/:num", function (req, res, next){
    var reqNum = req.params.num;
    if (obj[reqNum]){
        req.socket
        res.sendFile(path.join(__dirname, '/views', 'room.html'));
    }
    else
        res.send(400,"Room number doesn't exists");
});


// catch 404 and forward to error handler
app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handler
app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

module.exports = app;
