var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

const favicon = require('express-favicon');

var mongoose = require('mongoose');

var { v4: uuidv4 } = require('uuid');
var session = require('express-session');
const FileStore = require('session-file-store')(session);
const passport = require('passport');
const passportSetup = require('./config/passport-setup');


//Set up default mongoose connection
var mongoDB = 'mongodb://127.0.0.1/Collegify';
mongoose.connect(mongoDB, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

//Get the default connection
var db = mongoose.connection;

//Bind connection to error event (to get notification of connection errors)
db.on('error', console.error.bind(console, 'MongoDB connection error...'));
db.once('open', function () {
  console.log("MongoDB connected successfully...")
});


var indexRouter = require('./routes/index');
var authRouter = require('./routes/auth');
var usersRouter = require('./routes/users');
var postsRouter = require('./routes/posts');
var cursosRouter = require('./routes/cursos');

var app = express();

app.use(session({
  genid: req => {
    return uuidv4()
  },
  store: new FileStore(),
  secret: 'O meu segredo',
  resave: false,
  saveUninitialized: false,
  name: 'cookie'
}))

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');


app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(favicon(__dirname + '/public/favicon.ico'));

app.use(passport.initialize());
app.use(passport.session());

app.use('/', indexRouter);
app.use('/auth', authRouter)
app.use('/users', usersRouter);
app.use('/posts', postsRouter);
app.use('/cursos', cursosRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
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
