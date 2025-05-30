const Review = require('../models/Review');
const Trade = require('../models/Trade');
const Notification = require('../models/Notification');

// Add a review
exports.addReview = async (req, res) => {
  try {
    const { tradeId } = req.params;
    const { rating, comment } = req.body;

    const trade = await Trade.findById(tradeId);
    if (!trade || trade.status !== 'accepted') {
      return res.status(400).json({ error: 'Trade not completed or invalid' });
    }

    const isParticipant =
      trade.requester.toString() === req.user.id ||
      trade.responder.toString() === req.user.id;

    if (!isParticipant) {
      return res.status(403).json({ error: 'Not authorized' });
    }

    const reviewee =
      trade.requester.toString() === req.user.id
        ? trade.responder
        : trade.requester;

    // Prevent duplicate review
    const existing = await Review.findOne({ trade: tradeId, reviewer: req.user.id });
    if (existing) {
      return res.status(409).json({ error: 'You already reviewed this trade' });
    }

    const review = new Review({
      reviewer: req.user.id,
      reviewee,
      trade: tradeId,
      rating,
      comment
    });

    await review.save();

    // 🔔 Send notification to the reviewee
    await Notification.create({
      user: reviewee,
      type: 'review',
      message: `You received a review from ${req.user.name}`,
      link: `/trades/${tradeId}`
    });

    res.status(201).json(review);
  } catch (err) {
    console.error("❌ Review error:", err);
    res.status(500).json({ error: 'Failed to submit review' });
  }
};

// Get all reviews for a user
exports.getUserReviews = async (req, res) => {
  try {
    const reviews = await Review.find({ reviewee: req.params.userId })
      .populate('reviewer', 'name email')
      .sort({ createdAt: -1 });

    res.json(reviews);
  } catch (err) {
    console.error("❌ Load reviews error:", err);
    res.status(500).json({ error: 'Failed to load reviews' });
  }
};
