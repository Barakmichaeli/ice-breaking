var express = require('express');
var app = express();

/**
 * External modules
 */
var path = require('path');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');


/**
 * External middlewares
 */
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


/**
 *  Global variables
 */
const COOKIE_NAME = "IceBreaker";
var rooms = [];
var roomsCounter = 0;


/**
 * API
 */
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


        rooms[roomNumber]['opponent' + cookie] = {
            cookie: cookie,
            isActive: true,
            socket: req.socket
        };

        res.set('Connection', 'keep-alive');
        res.cookie("room", roomNumber, {
            expires: new Date(Date.now() + 900000),
            path: '/',
            httpOnly: true
        });
        res.cookie(COOKIE_NAME, cookie, {
            expires: new Date(Date.now() + 900000),
            path: '/',
            httpOnly: true
        });

    }

    res.sendFile(path.join(__dirname, '/public', 'room.html'));
});

app.get('/api/connection', function (req, res) {
    res.status(200);
    res.end();
});


var questionNum = 0;
app.get('/api/question', function (req, res) {
    var questions = [{
        question: 'What do we usually have for dinner on friday?',
        answer_a: "We go out for a diffrent restraunt each week",
        answer_b: "Tasteless Chicken",
        answer_c: "Morrocan fish",
        correct_answer : "2"

    },{
        question: 'What is my favorite vacation location?',
        answer_a: "The dead sea",
        answer_b: "My bed",
        answer_c: "I hate vacations",
        correct_answer : "2"
    },{
        question: 'What is my favorite course in college?',
        answer_a: "Nothing",
        answer_b: "Advanced algorithems",
        answer_c: "The karnaf" ,
        correct_answer : "3"
    }];
    questionNum = (++questionNum) % 3;
    res.json(questions[questionNum]);
    res.status(200);
});


app.get('/api/result', function (req, res) {
    res.status(200);
    res.end();
});

app.post('/api/sendquestion', function (req, res) {
    res.status(200);
    res.end();
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
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};
    res.status(err.status || 500);
    res.json({msg: "ERROR"})
});

module.exports = app;
