
/*
 * project model
 */

var mongoose = require('mongoose');
var db = mongoose.connect('mongodb://beerbu:kuzu@linus.mongohq.com:10053/github-ajile-tool');
var Schema = mongoose.Schema;
var Project = new Schema({
    username  : String,
    reponame  : String
});

mongoose.model('Project', Project);
module.exports = db.model('Project');