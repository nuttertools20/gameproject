let express = require('express');
let path = require('path');
let app = express();
let server = require("http").createServer(app);
let bodyParser = require('body-parser');
let fs = require('fs');
let mongoClient = require("mongodb").MongoClient;
let objectId = require("mongodb").ObjectID;
let Cookies = require( "cookies" );
let session = require('express-session');
var mongoose = require("mongoose");
var MongoStore = require('connect-mongo')(session);

var url = "mongodb://localhost:27017/players";
app.use(session({
  secret: 'secret-key',
  resave: false,
  saveUninitialized: false,
  store: new MongoStore({ 
    url,
  })
}));
app.use(bodyParser.urlencoded({extended: true}));
app.set('views', __dirname + '/template');
app.set('view engine', 'ejs');
app.use('/', express.static(path.join(__dirname, "publick")));

let Player = require("./model/Player");
const auth = require('./my_modules/auth');
var api = require('./api');

app.get('/autorization', function (req, res) {
  res.render('registration/autorization', {
  	title: 'autorization'
  });
});

app.post('/autorization', function (req, res) {

		if (!req.query.nick || !req.query.password) {
    res.send('login failed');    
  } else if(req.query.nick === "Randomuser" || req.query.password === "1234") {
    req.session.user = "Randomuser";
    req.session.admin = true;
    res.redirect('user cabinet/main');
  }
});
app.get('/registration', function (req, res) {
	 if (req.session.user) return res.redirect('/')
  res.render('registration/registration', {
  	title: 'registration'
  });
});
app.post('/registration', function (req, res) {

  if(!req.body) return res.sendStatus(400);
     
    const {nick, password, email} = req.body;
    var user = {nick, password, email};
  
    mongoClient.connect(url, function(err, db){
        db.collection("players").insertOne(user, function(err, result){
             
            if(err) return res.status(400).send();
            db.close();
            res.redirect('/main');
        });
    });

});
app.get('/main', function (req, res) {
  res.render('user cabinet/main', {
  	title: 'main'
  });
});

app.get('/about', function (req, res) {
  res.render('user cabinet/about', {
  	title: 'about'
  });
});

app.get('/game', function (req, res) {
  res.render('game', {
  	title: 'STAR FIGHTER'
  });
});

app.get('/logout', function(req, res) {
  req.session.destroy();
  res.redirect("registration/autorization");
});

app.get('/admin', function (req, res) {
  
  mongoClient.connect(url, (err, db)=>{
            db.collection("players").find({}).toArray((err, players)=>{
            res.render('admin/admin', {
    	  	title: 'admin',
    	  	data: players
        	});
            db.close();
            });
        });
  	});


app.get('/admin/edituser/:id', function (req, res) {
	  var id = new objectId(req.params.id);
	            mongoClient.connect(url, function(err, db){
	            db.collection("players").findOne({_id: id}, function(err, user){          
	            if(err) return res.status(400).send();
	            db.close();
	            res.render('admin/edituser', {
	    	  	title: 'Edit user',
	    	  	user
	    	});
        });
    });
});

app.post('/admin/edituser/:id', function (req, res) {
         	if(!req.body) return res.sendStatus(400);
            const {nick, password, email} = req.body;
            var id = new objectId(req.params.id);
            mongoClient.connect(url, function(err, db){
            db.collection("players").findOneAndUpdate({_id: id}, { $set: {nick, password, email}},
            {returnOriginal: false },function(err, result){            
            if(err) return res.status(400).send();            
            db.close();
            res.redirect("/admin");           
            });
        }); 	
    });

app.get('/admin/delete/:id', function (req, res) {

		var id = new objectId(req.params.id);
                mongoClient.connect(url, function(err, db){
                db.collection("players").findOneAndDelete({_id: id}, function(err, result){
                if(err) return res.status(400).send();            
                db.close();
     			res.redirect("/admin");
            });
        });
	});	

app.post('/admin/deleteajax/:id', function (req, res) {

		var id = new objectId(req.params.id);
        mongoClient.connect(url, function(err, db){
        db.collection("players").findOneAndDelete({_id: id}, function(err, result){             
        if(err) return res.status(400).send();            
        db.close();
     			res.send(200,{"resalt": "true"});
            });
        });
	});


app.use((req, res, next)=>{
  console.log(req.url);
  res.send("Error 404 page not found");
  next();
});

app.use((error, req, res, next)=>{
  console.log(error);
  console.log(req.url);
  res.send("Error 500 server not work");
  next();
});

app.listen(3000);  