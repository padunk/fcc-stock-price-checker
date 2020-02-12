function saveStock(model, stock, like, ip) {
    model.find({ stock }, (err, data) => {
        if (data.length === 0) {
            let stockToSave = new model({
                stock,
                likes: [ip],
            });

            stockToSave.save();
        } else {
            if (!data[0].likes.includes(ip) && like) {
                model.findOneAndUpdate(stock, {
                    $push: { likes: ip },
                });
            }
        }
    });
}

module.exports = saveStock;
