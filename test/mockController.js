// const mongoose = require('mongoose');
let db = [];

// mongoose.set('useFindAndModify', false);

const bookController = {};

bookController.clearDB = (req, res, next) => {
	db = [];
	return next()
}

bookController.getAll = (req, res, next) => {
	res.locals.books = db;
	return next();
}

bookController.addBook = (req, res, next) => {
	const { title, author, pages } = req.body;
	const book = {title, author, pages};
	db.push(book);
	res.locals.books = db;
	return next();
}

bookController.updateEntireBook = (req, res, next) => {
	const { title } = req.params;
	const { author, pages } = req.body;
	const book = db.filter(book => book.title === title);
	book[0].title = title;
	book[0].author = author;
	book[0].pages = pages;
	db = [...db, ...book];
	res.locals.books = db;
	return next();
}

bookController.patchBook = (req, res, next) => {
	const { title } = req.params;
	const { author } = req.body;
	const book = db.filter(book => book.title === title);
	book[0].title = title;
	book[0].author = author;
	db = [...db, ...book];
	res.locals.books = db;
	return next();
}

bookController.deleteBook = (req, res, next) => {
	const { title } = req.params;
	const book = db.filter(book => book.title === title)[0];
	db = db.filter(book => book.title !== title);
	res.locals.books = book;
  return next();
}

module.exports = bookController;