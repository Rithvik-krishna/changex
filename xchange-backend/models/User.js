const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  googleId: String,
  avatar: String,
  location: String,
  wishlist: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Listing' }],
  ratings: [{ score: Number, review: String }]
});

module.exports = mongoose.model('User', UserSchema);
