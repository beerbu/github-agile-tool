
/*
 * kanban model
 */

var mongoose = require('mongoose');
var db = require('../db');

var Schema = mongoose.Schema;
var Kanban = new Schema({
    orgname : String,
    reponame  : String,
    username : String,
    issueid : [String]
});

mongoose.model('Kanban', Kanban);
module.exports = db.model('Kanban');
