const Notification = require('../models/Notification');

// Fetch notifications for a user
exports.getMyNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.json(notifications);
  } catch (err) {
    res.status(500).json({ error: 'Failed to load notifications' });
  }
};

// Mark a notification as read
exports.markAsRead = async (req, res) => {
  try {
    const notification = await Notification.findById(req.params.id);
    if (!notification || notification.user.toString() !== req.user.id) {
      return res.status(403).json({ error: 'Not authorized' });
    }

    notification.isRead = true;
    await notification.save();
    res.json({ message: 'Notification marked as read' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update notification' });
  }
};
