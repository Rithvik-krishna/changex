const User = require('../models/User');

exports.saveListing = async (req, res) => {
  const { listingId } = req.body;

  try {
    const user = await User.findById(req.user.id);
    if (!user.savedListings.includes(listingId)) {
      user.savedListings.push(listingId);
      await user.save();
    }
    res.json({ message: 'Listing saved' });
  } catch (err) {
    res.status(500).json({ error: 'Could not save listing' });
  }
};

exports.unsaveListing = async (req, res) => {
  const { listingId } = req.body;

  try {
    await User.findByIdAndUpdate(req.user.id, {
      $pull: { savedListings: listingId }
    });
    res.json({ message: 'Listing removed from saved' });
  } catch (err) {
    res.status(500).json({ error: 'Could not remove listing' });
  }
};

exports.getSavedListings = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate('savedListings');
    res.json(user.savedListings);
  } catch (err) {
    res.status(500).json({ error: 'Could not fetch saved listings' });
  }
};
