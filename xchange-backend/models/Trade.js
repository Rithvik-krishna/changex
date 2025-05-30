const mongoose = require('mongoose');

const tradeSchema = new mongoose.Schema({
  offeredBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  offeredTo: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  offeredListing: { type: mongoose.Schema.Types.ObjectId, ref: 'Listing', required: true },
  requestedListing: { type: mongoose.Schema.Types.ObjectId, ref: 'Listing', required: true },
  status: {
    type: String,
    enum: ['pending', 'accepted', 'rejected'],
    default: 'pending'
  },
  message: { type: String },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Trade', tradeSchema);
