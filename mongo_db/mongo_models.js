const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const bookSchema = new Schema({
  title: { type: String, required: true },
  comments: [String],
});
const book = mongoose.model("book", bookSchema);

exports.book = book;
