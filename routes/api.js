'use strict';

const expect = require('chai').expect;
const MongoClient = require('mongodb');
const mongoose = require('mongoose');

const stockSchema = require('../schema/Schema');
const saveStock = require('../utils/saveStock');
const getPrice = require('../utils/getPrice');
const loadLikes = require('../utils/loadLikes');

const CONNECTION_STRING = process.env.DB;
mongoose.connect(CONNECTION_STRING, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

const StockModel = mongoose.model('StockModel', stockSchema);

module.exports = function(app) {
    app.route('/api/stock-prices').get(async function(req, res) {
        let { stock, like } = req.query;
        let { ip } = req;
        let stockData;
        let json = {
            stockData,
        };

        if (typeof stock === 'string') {
            if (like) saveStock(StockModel, stock, like, ip);
            let price = getPrice(stock).then(price => {
                stockData = {
                    stock,
                    price,
                    likes: like ? 1 : 0,
                };
                json.stockData = stockData;
                res.json(json);
            });
        } else {
            stockData = [];
            console.log(stock);
            if (like) {
                stock.forEach(st => saveStock(StockModel, st, like, ip));
            }

            let pricePromises = stock.map(st => getPrice(st));
            let likesPromises = stock.map(st => loadLikes(StockModel, st, ip));

            let promises = pricePromises.concat(likesPromises);
            Promise.all(promises)
                .then(data => {
                    console.log(data);

                    stock.forEach((s, idx) => {
                        stockData[idx] = {
                            stock: stock[idx],
                            price: data[idx],
                        };
                    });
                    if (data[2].length === 1 && data[3].length === 0) {
                        stockData[0].rel_likes = 1;
                        stockData[1].rel_likes = -1;
                    } else if (data[2].length === 0 && data[3].length === 1) {
                        stockData[0].rel_likes = -1;
                        stockData[1].rel_likes = 1;
                    } else {
                        stockData[0].rel_likes = 0;
                        stockData[1].rel_likes = 0;
                    }
                    json.stockData = stockData;
                    res.json(json);
                })
                .catch(e => console.error(e));
        }
    });
};
