const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const keys = require('./keys');
const LocalStrategy = require('passport-local').Strategy
var User = require('../controllers/user')

// Configuração da estratégia local
module.exports = passport.use(new LocalStrategy(
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

// Configuração da estratégia google
passport.use(
  new GoogleStrategy({
    callbackURL: '/auth/google/callback',
    clientID: keys.google.clientID,
    clientSecret: keys.google.clientSecret
  }, (accessToken, refreshToken, profile, done) => {
    console.log('Google callback function fired')
    console.log(profile)
    User.lookUpGoogleID(profile.id)
      .then(dados => {
        const user = dados
        if (user !== null) {
          done(null, user);
        } else {
          var usr = {
            googleID: profile.id,
            name: profile.displayName,
            email: profile.emails[0].value,
            username: profile.id
          }
          User.inserir(usr)
            .then(u => {
              return done(null, user)
            })
            .catch(erro => {
              console.log("erro")
              done(erro)
            })
        }
      })
      .catch(erro => {
        console.log("Erro lookUpGoogleID:")
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
