var URL = require('../models/url.js'),
    _ = require('lodash'),
    request = require('request'),
    open = require("open"),
    str,
    short_url,
    env = process.env.NODE_ENV || 'development';

    var site = (env == 'production') ? 'wilbanks-url-shortener.herokuapp.com' : 'localhost:3000';

module.exports = function(app){

    app.get('/', function(req,res){
        res.render('index');
    });

    app.get('/new/:str(*)', function(req, res){

        str = req.params.str;
        confirmValid(str)
            .then(function(str){
                URL
                    .findOne({ original_url: str })
                    .exec(function(err, entry){
                       if (entry) {
                           res.json({
                               original_url: entry.original_url,
                               short_url: site + '/' + entry.short_url
                           })
                       } else {
                           console.log('url not found in db');
                           short_url = generateRandomString();
                           var newEntry = new URL({
                               original_url: str,
                               short_url: short_url
                           });
                           newEntry.save(function(err,savedEntry){
                               if (err) return console.error(err);
                               res.json({
                                   original_url: savedEntry.original_url,
                                   short_url: site + '/' + savedEntry.short_url
                               });
                           })
                       }
                    });
            })
            .catch(function(err){
                console.log('Error: ', err);
                res.json({ error: 'URL invalid' });
            });

    });

    app.get('/:short', function(req,res){

        URL
            .findOne({ short_url: req.params.short })
            .exec(function(err, entry){
                if (entry){

                    //res.render('view', {
                    //    original_url: entry.original_url,
                    //    short_url: entry.short_url
                    //});

                    open( entry.original_url, function (err) {
                        if ( err ) throw err;
                    });

                } else {
                    res.json({error: "No short url found for given input"});
                }
            });
    })

};

function confirmValid(str){
    str = str.replace(/\/$/,"");
    if (str.indexOf('http://') == -1) {
        str = 'http://' + str;
    }

    return new Promise(function(resolve,reject){

        request
            .head(str, function(err, resp){
                if ( resp !== undefined && resp.statusCode >= 200 && resp.statusCode < 400){
                    resolve(str);
                } else {
                    reject(new Error('Could not reach url'))
                }
            })
    });

}

function generateRandomString(){
    var lowercase = "abcdefghijklmnopqrstuvwxyz",
        uppercase = "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
        numbers = "1234567890",
        sampleSet = lowercase + uppercase + numbers,
        sampleArr = sampleSet.split('');
    return _.sampleSize(sampleArr, 5).join('');
}