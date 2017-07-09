'use strict';

const vinmonopolet = require('vinmonopolet');
const express = require('express')
const fetch = require('node-fetch');
const app = express()

const client_id = process.env.CLIENT_ID;
const client_secret = process.env.CLIENT_SECRET;

let cache = {}

// respond with "hello world" when a GET request is made to the homepage
app.get('/untappd', function (req, res) {

    if(req.query.productName === undefined) res.status(400).send("Query param missing: productName");

    if(cache[req.query.productName] !== undefined) {
        res.send(cache[req.query.productName]);
    } else {
        fetch(`https://api.untappd.com/v4/search/beer?q="${req.query.productName}"&client_id=${client_id}&client_secret=${client_secret}`)
        .then(function(responseSearch) {
            return responseSearch.json();
        }).then(function(json) {
            const beer = json.response.beers.items.filter(x => x.checkin_count > 10)[0];
            fetch(`https://api.untappd.com/v4/beer/info/${beer.beer.bid}?client_id=${client_id}&client_secret=${client_secret}`)
            .then(function(responseInfo) {
                return responseInfo.json();
            }).then(function(json) {
                cache[req.query.productName] = json.response.beer;
                res.send(cache[req.query.productName]);
            });
        });
    }
})

app.listen(process.env.PORT, function () {
  console.log('Example app listening on port ' + process.env.PORT)
})
