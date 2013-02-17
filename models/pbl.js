/*
 * pbl model
 */

var mongoose = require('mongoose');
var db = require('../db');

var Schema = mongoose.Schema;
var Pbl = new Schema({
    username  : String,
    reponame  : String,
    issueId   : String,
    point     : String,
    priority  : Number
});

mongoose.model('Pbl', Pbl);
module.exports = db.model('Pbl');
