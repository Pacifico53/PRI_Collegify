var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var User = require('./controllers/user')

var mongoose = require('mongoose');

var { v4: uuidv4 } = require('uuid');
var session = require('express-session');
const FileStore = require('session-file-store')(session);

var passport = require('passport')
var LocalStrategy = require('passport-local').Strategy

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


// Configuração da estratégia local
passport.use(new LocalStrategy(
  { usernameField: 'username' }, (username, password, done) => {
    User.lookUpUsername(username)
      .then(dados => {
        const user = dados
        if (!user) { return done(null, false, { message: 'Utilizador inexistente!\n' }) }
        if (password != user.password) { return done(null, false, { message: 'Credenciais inválidas!\n' }) }
        return done(null, user)
      })
      .catch(erro => {
        console.log("erro")
        done(erro)
      })
  })
)

// Indica-se ao passport como serializar o utilizador
passport.serializeUser((user, done) => {
  console.log('Serielização user: ' + JSON.stringify(user))
  done(null, user.username)
})

// Desserialização: a partir do id obtem-se a informação do utilizador
passport.deserializeUser((uid, done) => {
  console.log('Desserielização, id: ' + uid)
  User.lookUpUsername(uid)
    .then(dados => done(null, dados))
    .catch(erro => done(erro, false))
})


var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var postsRouter = require('./routes/posts');

var app = express();

app.use(session({
  genid: req => {
    return uuidv4()
  },
  store: new FileStore(),
  secret: 'O meu segredo',
  resave: false,
  saveUninitialized: false
}))

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(passport.initialize());
app.use(passport.session());

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/posts', postsRouter);


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
