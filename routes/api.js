/*
 *
 *
 *       Complete the API routing below
 *
 *
 */

"use strict";
const bookModel = require("../mongo_db/mongo_models").book;

module.exports = function (app) {
  app
    .route("/api/books")
    .get(function (req, res) {
      bookModel.find({}, (err, library) => {
        if (err) return console.log("error while trying to get personal library");
        library = library.map((book) => {
          return {
            _id: book._id,
            title: book.title,
            commentcount: book.comments.length,
          };
        });
        res.json(library);
      });
    })

    .post(function (req, res) {
      let title = req.body.title;
      if (!title) return res.send("missing required field title");
      let newBook = new bookModel({
        title: title,
        comments: [],
      });
      newBook.save((err, data) => {
        if (err) return console.log("error while to trying to submit new book");
        res.json({ _id: data._id, title: title });
      });
    })

    .delete(function (req, res) {
      bookModel.remove({}, (err, data) => {
        if (err) return console.log("error while trying to delete library");
        res.send("complete delete successful");
      });
    });

  app
    .route("/api/books/:id")
    .get(function (req, res) {
      let bookid = req.params.id;
      bookModel.findById(bookid, (err, bookData) => {
        if (err || !bookData) return res.send("no book exists");
        res.json(bookData);
      });
    })

    .post(function (req, res) {
      let bookid = req.params.id;
      let comment = req.body.comment;
      bookModel.findById(bookid, (err, bookData) => {
        if (err || !bookData) return res.send("no book exists");
        if (!comment) return res.send("missing required field comment");
        bookData.comments.push(comment);
        bookData.save((err, data) => {
          if (err) return console.log("error while trying to save new comment");
          res.json(bookData);
        });
      });
    })

    .delete(function (req, res) {
      let bookid = req.params.id;
      bookModel.findById(bookid, (err, bookData) => {
        if (err || !bookData) return res.send("no book exists");
        bookData.remove((err, data) => {
          if (err) return console.log("error while trying to delete book data by book id");
          res.send("delete successful");
        });
      });
    });
};
