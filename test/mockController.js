const mongoose = require('mongoose');
const db = require('./dbModel');

mongoose.set('useFindAndModify', false);

const bookController = {};

bookController.clearDB = (req, res, next) => {
	db.BookStore.deleteMany({}, (err) => {
		if (err) next(err);
		next()
	});
}

bookController.getAll = (req, res, next) => {
	db.BookStore.find({}, (err, books) => {
    if (err) {
      next(err);
    }
    res.locals.books = books;
    // console.log(books);
    next();
  })
}

bookController.addBook = (req, res, next) => {
	const { title, author, pages } = req.body;
	db.BookStore.create({ title, author, pages }, (err, books) => {
    if (err) {
      next(err);
    }
    res.locals.books = books;
    next();
	})
}

bookController.updateEntireBook = (req, res, next) => {
	const { title } = req.params;
	const { author, pages } = req.body;
	db.BookStore.replaceOne({ title }, { title, author, pages }, (err, books) => {
    if (err) {
      next(err);
		}
		if (books.n === 1) {
			db.BookStore.findOne({title}, (err, books) => {
				if (err) {
					next(err);
				}

				res.locals.books = books;
				next();
			})
		}
	})
}

bookController.patchBook = (req, res, next) => {
	const { title } = req.params;
	const { author } = req.body;
	db.BookStore.findOneAndUpdate({ title }, { title, author }, {new: true}, (err, books) => {
    if (err) {
      next(err);
    }
		res.locals.books = books;
    next();
	})
}

bookController.deleteBook = (req, res, next) => {
	const { title } = req.params;
	db.BookStore.findOneAndDelete({ title }, (err, books) => {
    if (err) {
      next(err);
    }
		res.locals.books = books;
    next();
	})
}

module.exports = bookController;