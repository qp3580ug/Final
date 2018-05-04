var express = require('express');
var router = express.Router();
var passport = require('passport');
var film = require('../models/film');


/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Nate\'s Film Site' });
});

router.post('/addFilm', function(req, res, next) {
  if (req.body.text) {
    var Film = film(req.body);

    Film.save().then( (Film) => {
      res.redirect('/loggedinhome')
    });
  }
  else {
    req.flash('error', 'Please enter film information')
    res.redirect('/loggedinhome')
  }
});

router.get('/login', function(req, res, next) {
  res.render('login');
});

router.get('/signup', function(req, res, next) {
  res.render('signup');
});

router.get('/database', function(req, res, next) {
  res.render('database')
});

router.get('/loggedindatabase', function(req, res, next) {
  res.render('loggedindatabase')
})

router.post('/login', passport.authenticate('local-login', {
  successRedirect: '/secret',
  failureRedirect: '/login',
  failureFlash: '/true'
}));

router.post('/signup', passport.authenticate('local-signup', {
  successRedirect: '/secret',
  failureRedirect: '/signup',
  failureFlash: true
}));

router.get('/secret', isLoggedIn, function(req, res, next) {

  var user = req.user.local;

  res.render('secret', {
    username : req.user.local.username,
  });
});

function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    next();
  } else {
    res.redirect('/login');
  }
}

router.get('/logout', function(req, res, next) {
  req.logout();
  res.redirect('/');
});

router.get('/loggedinhome', function(req, res, next) {
  res.render('loggedinhome', { title: 'Nate\'s Film Site' });
});

module.exports = router;
