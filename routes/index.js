var express = require('express');
var router = express.Router();
var passport = require('passport');
var film = require('../models/film');


/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Nate\'s Film Site' });
});

router.post('/addFilm', function(req, res, next) {
  var Film = film(req.body);

  Film.save().then( (filmDoc) => {
    console.log(filmDoc)
    res.redirect('/loggedinhome')
  }).catch((err) => {
    next(err);
  });
});

router.get('/loggedindatabase', function(req, res, next) {
  film.find().select( {filmTitle: 1} ).sort( {filmTitle: 1} )
    .then( (filmDocs) => {
      console.log('Film List', filmDocs);
      res.render('loggedindatabase', {title: 'Film List', films: filmDocs} )
    }).catch( (err) => {
      next(err);
    })
});

router.get('/database', function(req, res, next) {
  film.find().select( {filmTitle: 1} ).sort( {filmTitle: 1} )
    .then( (filmDocs) => {
      console.log('Film List', filmDocs);
      res.render('database', {title: 'Film List', films: filmDocs} )
    }).catch( (err) => {
      next(err);
    })
});

router.get('/film/:_id', function(req, res, next) {
  film.findOne( { _id: req.params._id} )
    .then( (filmDoc) => {
      if (filmDoc) {
        res.render('filmInfo', { title: filmDoc.filmTitle, film: filmDoc} );
      } else {
        var err = Error('This film is not in our system');
        err.status = 404;
        throw err;
      }
    })
    .catch( (err) => {
      next(err);
    });
});

router.get('/login', function(req, res, next) {
  res.render('login');
});

router.get('/signup', function(req, res, next) {
  res.render('signup');
});

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

router.post('/delete', function(req, res, next){

  film.findByIdAndRemove(req.body._id)
    .then( (deletedFilm) => {
      if (deletedFilm) {
        req.flash('filmInfo', 'Film deleted.')
        res.redirect('/loggedindatabase');
      } else {
        var error = new Error('Film not found.')
        error.status = 404;
        next(err);
      }
    })
    .catch( (err) => {
      next(err);
    })
});

module.exports = router;
