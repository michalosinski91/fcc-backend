//basic required imports for node.js
var express = require('express');
var bodyParser = require('body-parser');
var cors = require('cors');


//create an instance of express fr our app and instantiate bodyParser and cors
var app = module.exports = express();
app.use(bodyParser.json());
app.use(cors());
// GET call to return JSON that formats date
app.get('/dateValues/:dateVal', function(req, res, next){
//gets the request data from date
  var dateVal = req.params.dateVal;
//Options for formatting date in natural format
  var dateFormattingOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  };
  if(isNaN(dateVal)) {
    var naturalDate = new Date(dateVal);
    naturalDate = naturalDate.toLocaleDateString("en-us", dateFormattingOptions);
    var unixDate = new Date(dateVal).getTime()/1000;
    }
    else {
      var unixDate = dateVal;
      var naturalDate = new Date(dateVal * 1000);
      naturalDate = naturalDate.toLocaleDateString("en-us", dateFormattingOptions);
    }
  res.json({
    unix: unixDate,
    natural: naturalDate
  });
})












app.listen(3000, function(){
  console.log('Working! Yay!');
})
