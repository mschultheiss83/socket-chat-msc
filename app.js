'use strict';
require('./lib/polyfill');
const express = require('express');
const logger = require('morgan');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const app = express();
const env = process.env.NODE_ENV || 'development';
const config = require('./lib/config.js')[env];

const sess = {
  secret: 'super-secret-key',
  key: 'super-secret-cookie',
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 3600000 * 24
  }
};
if (process.env.NODE_ENV === 'production') {
  app.set('trust proxy', 1); // trust first proxy
  sess.cookie.secure = true; // serve secure cookies
}
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(cookieParser())
app.use(session(sess))
app.use(function (req, res, next) {
// if user is not logged-in redirect back to login page //
  if (req.session.user == null && req.url !== '/login') {
    res.redirect('/login');
  } else {
    next();
  }
})

app.use('/static', express.static(__dirname + '/public'));
app.set('view engine', 'ejs');

app.get('/', function (req, res) {
  res.render('pages/index', {});
});

app.get('/test', function (req, res) {
  res.sendFile(__dirname + '/views/index.html');
});

app.get('/login', function (req, res) {
  //res.render('pages/login', {});
  res.sendFile(__dirname + '/views/login.html');
});
app.post('/login', function (req, res) {
  if (config.users && config.users[req.body.Username] === req.body.Password) {
    req.session.user = req.body.Username;
    res.redirect('/');
  } else {
    setTimeout(function () {
      //console.log(req.body);
      //res.json(req.body);
      res.redirect('/login');
    }, 10);
  }
});

const log = function () {
  console.log('log', arguments);
};

module.exports = app;