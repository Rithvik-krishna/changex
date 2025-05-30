const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  type: { type: String, enum: ['trade_request', 'trade_status', 'review'], required: true },
  message: { type: String, required: true },
  link: { type: String }, // e.g., `/trades/:id` or `/reviews/user/:userId`
  isRead: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Notification', notificationSchema);
