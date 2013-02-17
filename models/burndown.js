
/*
 * project model
 */

var mongoose = require('mongoose');
var db = require('../db');

var Schema = mongoose.Schema;
var Burndown = new Schema({
    project: String,
    iteration: Number,
    point: Number,
    type: String         //type is "burndown" or "velocity"
});

mongoose.model('Burndown', Burndown);
module.exports = db.model('Burndown');
