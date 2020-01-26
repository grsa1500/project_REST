var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var booksSchema = new Schema({
    title: String,
    author: String,
    ISBN: Number,
    image: String,
    year: Number,
    lang: String,
    pages: Number,
    read: Boolean,
    dateRead: Date
});

module.exports = mongoose.model("Books", booksSchema);