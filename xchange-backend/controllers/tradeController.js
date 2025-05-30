const Trade = require('../models/Trade');
const Listing = require('../models/Listing');
const mongoose = require('mongoose');
const Notification = require('../models/Notification');




// Create a new trade
const createTrade = async (req, res) => {
  try {
    if (!req.user || !req.user._id) {
      return res.status(401).json({ error: 'User not authenticated' });
    }

    const { requestedListing, offeredListing, offeredTo, message } = req.body;

    if (!requestedListing || !offeredListing || !offeredTo) {
      return res.status(400).json({ 
        error: 'Missing required fields: requestedListing, offeredListing, offeredTo' 
      });
    }

    if (!mongoose.Types.ObjectId.isValid(requestedListing) ||
        !mongoose.Types.ObjectId.isValid(offeredListing) ||
        !mongoose.Types.ObjectId.isValid(offeredTo)) {
      return res.status(400).json({ error: 'Invalid ObjectId format' });
    }

    const requestedListingExists = await Listing.findById(requestedListing);
    const offeredListingExists = await Listing.findById(offeredListing);

    if (!requestedListingExists || !offeredListingExists) {
      return res.status(404).json({ error: 'One or both listings not found' });
    }

    if (offeredListingExists.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: 'You can only offer your own listings' });
    }

    if (offeredTo === req.user._id.toString()) {
      return res.status(400).json({ error: 'Cannot create trade with yourself' });
    }

    const newTrade = await Trade.create({
      offeredBy: req.user._id,
      offeredTo,
      requestedListing,
      offeredListing,
      message: message || ''
    });

    // 🔔 Create notification for receiver
    await Notification.create({
      user: offeredTo,
      type: 'trade_request',
      message: `You have a new trade request from ${req.user.name}`,
      link: `/trades/${newTrade._id}`
    });

    const populatedTrade = await Trade.findById(newTrade._id)
      .populate('offeredBy', 'name email')
      .populate('offeredTo', 'name email')
      .populate('requestedListing')
      .populate('offeredListing');

    res.status(201).json(populatedTrade);

  } catch (err) {
    console.error("❌ Error creating trade:", err);
    res.status(500).json({ error: 'Failed to create trade request' });
  }
};

// Get all trades for the current user
const getMyTrades = async (req, res) => {
  try {
    const trades = await Trade.find({
      $or: [
        { offeredBy: req.user._id }, 
        { offeredTo: req.user._id }
      ]
    })
      .populate('requestedListing')
      .populate('offeredListing')
      .populate('offeredBy', 'name email')
      .populate('offeredTo', 'name email')
      .sort({ createdAt: -1 });

    res.status(200).json(trades);

  } catch (err) {
    console.error("❌ Error fetching trades:", err);
    res.status(500).json({ error: 'Failed to fetch trades' });
  }
};

// Update trade status (accept/reject)
const updateTradeStatus = async (req, res) => {
  try {
    const { status } = req.body;

    if (!['accepted', 'rejected'].includes(status)) {
      return res.status(400).json({ error: 'Status must be "accepted" or "rejected"' });
    }

    const trade = await Trade.findById(req.params.id);
    if (!trade) {
      return res.status(404).json({ error: 'Trade not found' });
    }

    if (trade.offeredTo.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: 'Only the recipient can update this trade' });
    }

    if (trade.status !== 'pending') {
      return res.status(400).json({ error: 'Trade has already been processed' });
    }

    trade.status = status;
    await trade.save();

    // 🔔 Notify the trade initiator
    await Notification.create({
      user: trade.offeredBy,
      type: 'trade_status',
      message: `Your trade was ${status}`,
      link: `/trades/${trade._id}`
    });

    const populatedTrade = await Trade.findById(trade._id)
      .populate('offeredBy', 'name email')
      .populate('offeredTo', 'name email')
      .populate('requestedListing')
      .populate('offeredListing');

    res.status(200).json(populatedTrade);

  } catch (err) {
    console.error("❌ Error updating trade status:", err);
    res.status(500).json({ error: 'Failed to update trade status' });
  }
};

exports.getMyTrades = async (req, res) => {
  const trades = await Trade.find({
    $or: [{ offeredBy: req.user._id }, { offeredTo: req.user._id }]
  })
    .populate('requestedListing')
    .populate('offeredListing');
  res.json(trades);
};


module.exports = {
  createTrade,
  getMyTrades,
  updateTradeStatus,
};
