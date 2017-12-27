var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
// app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

const COOKIE_NAME = "DatingGames";
// uncomment after placing your favicon in /public
var roomsCounter = 1;
var rooms = {};

//Redirect
app.get('/createRoom', function (req, res, next) {
    rooms[roomsCounter] = {'counter': 0};
    res.redirect(302, "/room/" + (roomsCounter++));
});

/* GET new rooms */
app.get("/room/:num", function (req, res, next) {
    var room = req.params.num;
    //No room OR room full
    if (!rooms[room] || rooms[room]['counter'] > 1) {
        res.redirect('/');
    }

    //One of the opponents reconnect
    // console.log(req.cookies);
    if (!isRegistered(req.cookies, room)) {
        console.log("here");
        //register new member
        var counter = ++rooms[room]['counter']; //opponent k
        rooms[room]['opponent' + counter] = counter; //opponentk : k
        res.cookie(COOKIE_NAME, counter, {
            expires: new Date(Date.now() + 900000),
            path: '/room/' + room,
            httpOnly: true
        });
    }
    res.sendFile(path.join(__dirname, '/views', 'room.html'));
});


function isRegistered(cookies, room) {
    var uid = parseInt(cookies[COOKIE_NAME]);
    return (uid && (uid === rooms[room]['opponent1']
        || uid === rooms[room]['opponent2']));
}


app.get("/dissconnect",function(req,res,next){


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
