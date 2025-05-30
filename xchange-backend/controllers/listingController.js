const Listing = require('../models/Listing');

// Create Listing
exports.createListing = async (req, res) => {
  try {
    const { title, description, category, location } = req.body;
    const owner = req.user._id;
    const newListing = new Listing({ title, description, category, location, owner });
    await newListing.save();
    res.status(201).json(newListing);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create listing' });
  }
};

// Get All Listings
exports.getListings = async (req, res) => {
  try {
    const listings = await Listing.find().populate('owner', 'name email');
    res.json(listings);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch listings' });
  }
};

// Get One Listing
exports.getListing = async (req, res) => {
  try {
    const listing = await Listing.findById(req.params.id).populate('owner', 'name email');
    if (!listing) return res.status(404).json({ error: 'Listing not found' });
    res.json(listing);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch listing' });
  }
};

// Update Listing
exports.updateListing = async (req, res) => {
  try {
    const listing = await Listing.findOneAndUpdate(
      { _id: req.params.id, owner: req.user.id },
      req.body,
      { new: true }
    );
    if (!listing) return res.status(404).json({ error: 'Listing not found or not yours' });
    res.json(listing);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update listing' });
  }
};

// Delete Listing
exports.deleteListing = async (req, res) => {
  try {
    const listing = await Listing.findOneAndDelete({ _id: req.params.id, owner: req.user.id });
    if (!listing) return res.status(404).json({ error: 'Listing not found or not yours' });
    res.json({ message: 'Listing deleted' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete listing' });
  }
};

// Get Listings Owned By Current User
exports.getMyListings = async (req, res) => {
  try {
    const listings = await Listing.find({ owner: req.user._id });
    res.json(listings);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch your listings' });
  }
};
