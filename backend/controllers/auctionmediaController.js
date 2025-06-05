const auctionMediaModels = require("../models/auctionMediaModels");

// Add media to an auction
const addAuctionMedia = (req, res) => {
  const auctionId = req.body.auction_id;
  const files = req.files;

  if (!auctionId || !files || files.length === 0) {
    return res.status(400).json({ message: "Auction ID and media files are required." });
  }

  const mediaEntries = files.map((file) => ({
    auction_id: auctionId,
    media_path: `auctions/${file.filename}`,
  }));

  let completed = 0;
  mediaEntries.forEach((mediaData) => {
    auctionMediaModels.addAuctionMedia(mediaData, (err) => {
      if (err)
        return res.status(500).json({ message: "Database error.", error: err });
      completed++;
      if (completed === mediaEntries.length) {
        res.status(201).json({ message: "Auction media uploaded successfully!" });
      }
    });
  });
};

// Get all media for a specific auction
const getAuctionMediaByAuctionId = (req, res) => {
  const { auctionId } = req.params;

  auctionMediaModels.getAuctionMediaByAuctionId(auctionId, (err, results) => {
    if (err)
      return res.status(500).json({ message: "Database error.", error: err });
    res.status(200).json(results);
  });
};

// Delete all media for a specific auction
const deleteAuctionMediaByAuctionId = (req, res) => {
  const { auctionId } = req.params;

  auctionMediaModels.deleteAuctionMediaByAuctionId(auctionId, (err) => {
    if (err)
      return res.status(500).json({ message: "Database error.", error: err });
    res.status(200).json({ message: "Auction media deleted successfully!" });
  });
};

module.exports = {
  addAuctionMedia,
  getAuctionMediaByAuctionId,
  deleteAuctionMediaByAuctionId,
};
