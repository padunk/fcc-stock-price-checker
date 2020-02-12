function loadLikes(Model, stock, ip) {
    return Model.find({ stock, likes: ip });
}

module.exports = loadLikes;
