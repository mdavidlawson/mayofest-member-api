var mongoose = require('mongoose'),
  db;

db = mongoose.connect('mongodb://localhost/mayofest-member-db');

module.exports = db;
