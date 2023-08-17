/*
 *
 *
 *       FILL IN EACH FUNCTIONAL TEST BELOW COMPLETELY
 *       -----[Keep the tests in the same order!]-----
 *
 */

const chaiHttp = require("chai-http");
const chai = require("chai");
const assert = chai.assert;
const server = require("../server");

chai.use(chaiHttp);

// suite("Functional Tests", function () {
/*
 * ----[EXAMPLE TEST]----
 * Each test should completely test the response of the API end-point including response status code!
 */
// test("#example Test GET /api/books", function (done) {
//   chai
//     .request(server)
//     .get("/api/books")
//     .end(function (err, res) {
//       assert.equal(res.status, 200);
//       assert.isArray(res.body, "response should be an array");
//       assert.property(res.body[0], "commentcount", "Books in array should contain commentcount");
//       assert.property(res.body[0], "title", "Books in array should contain title");
//       assert.property(res.body[0], "_id", "Books in array should contain _id");
//       done();
//     });
// });
/*
 * ----[END of EXAMPLE TEST]----
 */

suite("Routing tests", function () {
  let bookid = "";
  suite("POST /api/books with title => create book object/expect book object", function () {
    test("Test POST /api/books with title", function (done) {
      chai
        .request(server)
        .post("/api/books")
        .send({ title: "1984" })
        .end(function (err, res) {
          assert.equal(res.status, 200);
          assert.property(res.body, "title", "Book data should contain title");
          assert.property(res.body, "_id", "Book data should contain _id");
          assert.equal(res.body.title, "1984", "Book title shoul equal to the one posted");
          bookid = res.body._id;
          done();
        });
    });

    test("Test POST /api/books with no title given", function (done) {
      chai
        .request(server)
        .post("/api/books")
        .send({})
        .end(function (err, res) {
          assert.equal(res.status, 200);
          assert.equal(res.text, "missing required field title", "Submitting new book with no title given will print the following text: 'missing required field title'");
          done();
        });
    });
  });

  suite("GET /api/books => array of books", function () {
    test("Test GET /api/books", function (done) {
      chai
        .request(server)
        .get("/api/books")
        .end(function (err, res) {
          assert.equal(res.status, 200);
          assert.isArray(res.body, "response should be an array");
          assert.property(res.body[0], "commentcount", "Books in array should contain commentcount");
          assert.property(res.body[0], "title", "Books in array should contain title");
          assert.property(res.body[0], "_id", "Books in array should contain _id");
          done();
        });
    });
  });

  suite("GET /api/books/[id] => book object with [id]", function () {
    test("Test GET /api/books/[id] with id not in db", function (done) {
      chai
        .request(server)
        .get(`/api/books/invalid_book_id`)
        .end(function (err, res) {
          assert.equal(res.status, 200);
          assert.equal(res.text, "no book exists", "Invalid id should result in error and the relevant text is printed on the screen");
          done();
        });
    });

    test("Test GET /api/books/[id] with valid id in db", function (done) {
      chai
        .request(server)
        .get(`/api/books/${bookid}`)
        .end(function (err, res) {
          assert.equal(res.status, 200);
          assert.equal(res.body.title, "1984", "Book data should contain valid title");
          done();
        });
    });
  });

  suite("POST /api/books/[id] => add comment/expect book object with id", function () {
    test("Test POST /api/books/[id] with comment", function (done) {
      chai
        .request(server)
        .post(`/api/books/${bookid}`)
        .send({ comment: "must read" })
        .end(function (err, res) {
          assert.equal(res.status, 200);
          assert.equal(res.body.comments[0], "must read", "Book data should contain one comment: 'must read'");
          done();
        });
    });

    test("Test POST /api/books/[id] without comment field", function (done) {
      chai
        .request(server)
        .post(`/api/books/${bookid}`)
        .send({})
        .end(function (err, res) {
          assert.equal(res.status, 200);
          assert.equal(res.text, "missing required field comment", "Posting to /api/books/[id] without comment field should print the following text: 'missing required field comment'");
          done();
        });
    });

    test("Test POST /api/books/[id] with comment, id not in db", function (done) {
      chai
        .request(server)
        .post(`/api/books/invalid_id`)
        .send({ comment: "must read" })
        .end(function (err, res) {
          assert.equal(res.status, 200);
          assert.equal(res.text, "no book exists", "Posting with comment but with invalid id should print the following text: 'no book exists'");
          done();
        });
    });
  });

  suite("DELETE /api/books/[id] => delete book object id", function () {
    test("Test DELETE /api/books/[id] with valid id in db", function (done) {
      chai
        .request(server)
        .delete(`/api/books/${bookid}`)
        .end(function (err, res) {
          assert.equal(res.status, 200);
          assert.equal(res.text, "delete successful", "Deleting book should be confirmed with the following message: 'delete successful'");
          done();
        });
    });

    test("Test DELETE /api/books/[id] with  id not in db", function (done) {
      chai
        .request(server)
        .delete(`/api/books/invalid_id`)
        .end(function (err, res) {
          assert.equal(res.status, 200);
          assert.equal(res.text, "no book exists", "Delete request with wrong book id should print the the following message 'no book exists'");
          done();
        });
    });
  });
});
