var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/hello', function(req, res, next) {
  res.render('helloworld', { title: 'Hello World' });
});

router.get('/contactlist', function(req, res) {
  var db = req.db;
  var collection = db.get('contacts');
  //collection.find().sort({ "name.last" : 1 });
  collection.find({$query: {}, $orderby: { "name.last" : 1 } },function(e,docs){
    res.render('contactlist', {
      "contactlist" : docs
    });
  });
});

router.get('/newcontact', function(req, res) {
  res.render('newcontact', { title: 'Add New Contact' });
});

router.get('/removecontact', function(req, res) {
  res.render('removecontact', { title: 'Remove Contact'});
});

router.post('/deletecontact', function(req,res) {
  var db = req.db;
  
  var firstName = req.body.firstname;
  var lastName = req.body.lastname;
  
  var collection = db.get('contacts');
  
  collection.remove({ "name" : { "first" : firstName, "last" : lastName}}, function (err, doc) {
    if (err) {
      // If it failed, return error
      res.send("There was a problem adding the information to the database.");
    } else {
      // If it worked, set the header so the address bar doesn't say /addcontact
      res.location("contactlist");
      // And forward to success page
      res.redirect("contactlist");
    }
  });
});

router.post('/addcontact', function(req,res) {
  // Set our internal DB variable
  var db = req.db;
  
  // Get our form values.  These rely on the "name" attributes
  var firstName = req.body.firstname;
  var lastName = req.body.lastname;
  var title = req.body.title;
  var company = req.body.company;
  var email = req.body.email;
  var whereMet = req.body.wheremet;
  var whenMet = req.body.whenmet;
  var comments = req.body.comments;
  
  // Set our collection
  var collection = db.get('contacts');
  
  // Submit to the DB
  collection.insert({
    "name" : { "first" : firstName, "last" : lastName},
    "title" : title,
    "company" : company,
    "email" : email,
    "wheremet" : whereMet,
    "whenmet" : whenMet,
    "comments" : comments
  }, function (err, doc) {
    if (err) {
      // If it failed, return error
      res.send("There was a problem adding the information to the database.");
    }
    else {
      // If it worked, set the header so the address bar doesn't say /addcontact
      res.location("contactlist");
      // And forward to success page
      res.redirect("contactlist");
    }
  });
});
module.exports = router;
