const mongoose = require('mongoose');
require("dotenv").config();

mongoose.connect(process.env.MONGO_URI, {
  // options for the connect method to parse the URI
  useNewUrlParser: true,
  useUnifiedTopology: true,
  // sets the name of the DB that our collections are part of
  // dbName: 'swell'
})
.then(()=>console.log('Connected to Mongo DB.'))
.catch(err=>console.log(err));

const Schema = mongoose.Schema;

// sets a schema for the 'bookSore' collection
const bookStoreSchema = new Schema({
	title:	{
    type: String,
    required: true
	},
	author:	{
    type: String,
    required: true
	},
	pages: {
    type: Number,
    required: true
	}
});

// creats a model for the 'bookStore' collection that will be part of the export
const BookStore = mongoose.model('bookStore', bookStoreSchema);

// exports all the models in an object to be used in the controller
module.exports = {
	BookStore
}