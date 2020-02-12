const mongoose = require('mongoose');

const stockSchema = mongoose.Schema({
    stock: String,
    likes: {
        type: [String],
        default: [],
    },
});

module.exports = stockSchema;
