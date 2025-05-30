const User = require('../models/User');
const Listing = require('../models/Listing');

exports.addToWishlist = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    const { listingId } = req.body;

    if (!user.wishlist.includes(listingId)) {
      user.wishlist.push(listingId);
      await user.save();
    }

    res.status(200).json({ message: 'Listing added to wishlist' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to add to wishlist' });
  }
};

exports.removeFromWishlist = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    const { listingId } = req.body;

    user.wishlist = user.wishlist.filter(id => id.toString() !== listingId);
    await user.save();

    res.status(200).json({ message: 'Listing removed from wishlist' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to remove from wishlist' });
  }
};

exports.getWishlist = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate('wishlist');
    res.status(200).json(user.wishlist);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch wishlist' });
  }
};
