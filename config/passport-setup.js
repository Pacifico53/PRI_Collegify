const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const FacebookStrategy = require('passport-facebook').Strategy;
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
    clientSecret: keys.google.clientSecret,
    passReqToCallback: true
  }, (req, accessToken, refreshToken, profile, done) => {
    console.log('Google callback function fired')
    console.log(profile)
    var resultUsername = profile.name.givenName + profile.name.familyName

    User.listar()
      .then(dados => {
        var allunames = [];

        dados.forEach(user => {
          allunames.push(user.username)
        });
        
        if (allunames.includes(resultUsername)) {
          console.log('Found same username!');
          var done = true;
          var i = 0;

          while (done) {
            resultUsername = resultUsername + i;
            if (!allunames.includes(resultUsername)) {
              done = false;
            }
            i++;
          }
        }
        console.log("calculado uname: " + resultUsername);
      })
      .catch(erro => {
        console.log("Erro gerar nome:")
        console.log(erro)
      })

    if (req.user) {
      var googleUser = { googleID: profile.id }
      User.atualizar(req.user["_id"], googleUser)
        .then(u => {
          req.user["googleID"] = profile.id
          return done(null, req.user)
        })
        .catch(erro => {
          console.log("GoogleStrategy req.user, erro ao atualizar!")
          console.log(req.user);
          done(erro)
        })
    } else {
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
              level: 'produtor',
              username: resultUsername
            }
            console.log(usr);
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
    }
  })
)

// Configuração da estratégia google
passport.use(new FacebookStrategy({
  clientID: keys.facebook.appID,
  clientSecret: keys.facebook.appSecret,
  callbackURL: "http://localhost:3000/auth/facebook/callback",
  profileFields: ['id', 'email', 'displayName', 'profileUrl'],
  passReqToCallback: true
},
  function (req, accessToken, refreshToken, profile, done) {
    console.log('Facebook callback function fired')
    console.log(profile)
    var resultUsername = profile.displayName;
    resultUsername = resultUsername.trim();

    User.listar()
      .then(dados => {
        var allunames = [];

        dados.forEach(user => {
          allunames.push(user.username)
        });

        if (allunames.includes(resultUsername)) {
          var done = true;
          var i = 0;

          while (done) {
            resultUsername = resultUsername + i;
            if (!allunames.includes(resultUsername)) {
              done = false;
            }
            i++;
          }
        }
        console.log("calculado uname: " + resultUsername);
      })
      .catch(erro => {
        console.log("Erro gerar nome:")
        console.log(erro)
      })

    if (req.user) {
      var facebookUser = { facebookID: profile.id }
      User.atualizar(req.user["_id"], facebookUser)
        .then(u => {
          req.user["facebookID"] = profile.id
          return done(null, req.user)
        })
        .catch(erro => {
          console.log("FacebookStrategy req.user, erro ao atualizar!")
          console.log(req.user)
          done(erro)
        })
    } else {
      User.lookUpFacebookID(profile.id)
        .then(dados => {
          const user = dados
          if (user !== null) {
            done(null, user);
          } else {
            var usr = {
              facebookID: profile.id,
              name: profile.displayName,
              email: profile.emails[0].value,
              username: resultUsername
            }
            console.log('Utilizador resultante:')
            console.log(usr)
            User.inserir(usr)
              .then(u => {
                return done(null, user)
              })
              .catch(erro => {
                console.log("Erro a inserir o user FB callback")
                done(erro)
              })
          }
        })
        .catch(erro => {
          console.log("Erro lookUpFacebookID:")
          console.log(erro)
          console.log('Acabou o erro')
          done(erro)
        })
    }
  }
));

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
