const db = require('./dbModel');

const bookController = {};

bookController.getAll = (req, res, next) => {
	db.BookStore.find({}, (err, books) => {
    if (err) {
      next(err);
    }
    res.locals.books = books;
    console.log(books);
    next();
  })
}

module.exports = bookController;