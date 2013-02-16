module.exports = function (app, config) {
    return app.getModel('Base', true).extend(function () {
        this.mongo = require('mongodb');
        this.mongoose = require('mongoose');
        this.Schema = this.mongoose.Schema;
        this.mongoose.connect('mongodb://beerbu:kuzu@linus.mongohq.com:10053/github-ajile-tool');
    });
}