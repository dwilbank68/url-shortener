var port = process.env.PORT || 3000;

var express = require('express');
var app = express();
app.set('view engine', 'ejs');

var mongoose = require('mongoose');
mongoose.connect('mongodb://dwilbank:example@ds017248.mlab.com:17248/url-shortener');

var routes = require('./routes/routes.js')(app);

var server = app.listen(port, function(){
    console.log('Server at localhost:' + port);
});

