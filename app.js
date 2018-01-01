var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

const COOKIE_NAME = "DatingGames";
var rooms = [];
var roomsCounter = 0;

//Redirect
app.get('/createRoom', function (req, res, next) {
    rooms[roomsCounter] = {'counter': 0};
    var tmp = roomsCounter++;
    res.redirect(302, "/room/" + (tmp));
});

/* GET new rooms */
app.get("/room/:num", function (req, res) {
    var roomNumber = req.params.num;

    //Room doesn't exists or full
    if (!rooms[roomNumber] || rooms[roomNumber]['counter'] > 2) {
        console.log("cant access");
        res.redirect('/');
    }

    //New member trying to connect the room
    if (!isRegistered(req.cookies, roomNumber)) {
        var cookie = ++rooms[roomNumber]['counter'];
        rooms[roomNumber]['cookie'] = cookie;
        res.cookie(COOKIE_NAME , cookie, {
            expires: new Date(Date.now() + 900000),
            path: '/room/' + roomNumber,
            httpOnly: true
        });
    }
    res.sendFile(path.join(__dirname, '/public', 'room.html'));
});

function isRegistered(cookies, room) {
    var uid = parseInt(cookies[COOKIE_NAME]);
    return (uid && (uid === rooms[room]['cookie']
        || uid === rooms[room]['cookie']));
}

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
