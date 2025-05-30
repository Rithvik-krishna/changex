const mongoose = require('mongoose');
const ListingSchema = new mongoose.Schema({
  title: String,
  description: String,
  category: String,
  location: String,
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
});
module.exports = mongoose.model('Listing', ListingSchema);
