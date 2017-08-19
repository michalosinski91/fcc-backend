var express = require('express');
var cors = require('cors');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var shortUrl = require('./models/shortUrl');
var app = express();
app.use(bodyParser.json());
app.use(cors());

//Conntect to database
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost/shortUrls');

//allows node to find static content
app.use(express.static(__dirname +'/public'))
//Create database entry
app.get('/new/:urlToShorten(*)', function(req, res, next) {
  var urlToShorten = req.params.urlToShorten;
  //regex for url
  var expression = /[-a-zA-Z0-9@:%_\+.~#?&//=]{2,256}\.[a-z]{2,4}\b(\/[-a-zA-Z0-9@:%_\+.~#?&//=]*)?/gi;

  if(expression.test(urlToShorten) === true){
    var short = Math.floor(Math.random()*100000).toString();
    var data = new shortUrl(
      {
      originalUrl: urlToShorten,
      shorterUrl: short
      }
    );
    data.save(function(err){
      if(err){
        return res.send('Error saving to database');
      }
    });
    return res.json(data);
  }
var data = new shortUrl({
  originalUrl: urlToShorten,
  shorterUrl: 'Invalid URL'
});
return res.json(data);
});

//query database and forward to originalUrl

app.get('/:urlToForward', function(req, res, next){
  var shorterUrl = req.params.urlToForward;

  shortUrl.findOne({'shorterUrl' : shorterUrl}, function(err, data){
    if (err) return res.send("Error reading database");
    var re = new RegExp("^(http|https)://", "i");
    var strToCheck = data.originalUrl;
    if (re.test(strToCheck)){
      res.redirect(301, data.originalUrl);
    }
    else{
      res.redirect(301, 'http://' + data.originalUrl)
    }
  })
});




app.listen(process.env.PORT || 3000, function(){
  console.log('Working!');
});
