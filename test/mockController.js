const db = require('./dbModel');

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
	const { title, author } = req.body;
	db.BookStore.create({ title, author }, (err, books) => {
    if (err) {
      next(err);
    }
    res.locals.books = books;
    console.log(books);
    next();
	})
}

module.exports = bookController;