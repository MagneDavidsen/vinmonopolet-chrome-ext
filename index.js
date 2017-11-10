'use strict';

const vinmonopolet = require('vinmonopolet');
const express = require('express')
const fetch = require('node-fetch');
const stringSimilarity = require('string-similarity');
const app = express()

const client_id = process.env.CLIENT_ID;
const client_secret = process.env.CLIENT_SECRET;

let cache = {}


app.get('/untappd', function (req, res) {

    if(req.query.productName === undefined) res.status(400).send("Query param missing: productName");

    if(cache[req.query.productName] !== undefined) {
        res.send(cache[req.query.productName]);
    } else {
        fetch(`https://api.untappd.com/v4/search/beer?q="${req.query.productName}"&client_id=${client_id}&client_secret=${client_secret}`)
        .then(function(responseSearch) {
            return responseSearch.json();
        }).then(function(json) {
            const beers = json.response.beers.items.filter(x => x.checkin_count > 10);
            const beersWithMatchRating = beers.map(item => {
                return {bid: item.beer.bid, rating: stringSimilarity.compareTwoStrings(req.query.productName, `${item.brewery.brewery_name} ${item.beer.beer_name}`)}
            });

            const beer = beersWithMatchRating.sort((a,b) => b.rating - a.rating)[0];

            fetch(`https://api.untappd.com/v4/beer/info/${beer.bid}?client_id=${client_id}&client_secret=${client_secret}`)
            .then(function(responseInfo) {
                return responseInfo.json();
            }).then(function(json) {
                json.response.beer.vinmonopolet_name = req.query.productName;
                cache[req.query.productName] = json.response.beer;
                res.send(cache[req.query.productName]);
            });
        });
    }
})

app.listen(process.env.PORT, function () {
  console.log('Example app listening on port ' + process.env.PORT)
})
