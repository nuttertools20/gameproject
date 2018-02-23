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

app.use(bodyParser.urlencoded({extended: true}));
app.set('views', __dirname + '/template');
app.set('view engine', 'ejs');
app.use('/', express.static(path.join(__dirname, "publick")));

app.get('/autorization', function (req, res) {
  res.render('registration/autorization', {
  	title: 'autorization'
  });
});
// app.post('/autorization', function (req, res) {
  
// 	if(!req.body) return res.sendStatus(400);
//     const {login, pass} = req.body;

//   mongoClient.connect(url, function(err, db){
//         db.collection("users").findOne({login, pass}, function(err, user){
             
//              console.log(user);
//             if(err) return res.status(400).send();
             
//             if(user){
//             	var cookies = new Cookies( req, res); 
//             	req.session.login = user.login;
//     			    req.session.admin = true;
//             }

//             db.close();

//             res.redirect('/');
//         });
//     });
// });
app.get('/registration', function (req, res) {
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
       //      	if(user){
       //        var cookies = new Cookies(req, res);
       //  		req.session.user = user.nick;
    			// }
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

app.get('/admin', function (req, res) {
  
  mongoClient.connect(url, (err, db)=>{
            db.collection("players").find({}).toArray((err, users)=>{
            res.render('admin/admin', {
    	  	title: 'admin',
    	  	data: players
        	});
            db.close();
            });
        });
  	});


app.get('/edituser', function (req, res) {
  res.render('admin/edituser', {
  	title: 'edituser'
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