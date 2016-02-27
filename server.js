if (process.env.NODE_ENV !== 'production') {
    require('dotenv').load();
}

var port = process.env.PORT || 3000;

var express = require('express');
var app = express();
app.set('view engine', 'ejs');

var mongoose = require('mongoose');

var mongoAddress = 'mongodb://'+
    process.env.DB_USER+':'+
    process.env.DB_PASS+'@'+
    process.env.DB_HOST;

mongoose.connect(mongoAddress);

var routes = require('./routes/routes.js')(app);

var server = app.listen(port, function(){
    console.log('Server at localhost:' + port);
});

