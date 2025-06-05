const auctionModels = require("../models/auctionModels");

// Create auction
const createAuction = (req, res) => {
  const { title, description, end_time } = req.body;
  const author_id = req.user.id; // from authenticateToken middleware
  const status = "pending";

  if (!title || !description || !end_time) {
    return res.status(400).json({ message: "All fields are required." });
  }

  const auctionData = { author_id, title, description, end_time, status };

  auctionModels.createAuction(auctionData, (err, result) => {
    if (err) return res.status(500).json({ message: "Database error.", error: err });

    res.status(201).json({ message: "Auction created successfully.", auctionId: result.insertId });
  });
};

// Get all auctions
const getAllAuctions = (req, res) => {
  auctionModels.getAllAuctions((err, results) => {
    if (err) return res.status(500).json({ message: "Database error.", error: err });

    res.status(200).json(results);
  });
};

// Get single auction
const getAuctionById = (req, res) => {
  const { auctionId } = req.params;

  auctionModels.getAuctionById(auctionId, (err, result) => {
    if (err) return res.status(500).json({ message: "Database error.", error: err });

    if (result.length === 0) {
      return res.status(404).json({ message: "Auction not found." });
    }

    res.status(200).json(result[0]);
  });
};

// Update auction status
const updateAuctionStatus = (req, res) => {
  const { auctionId } = req.params;
  const { status } = req.body;

  auctionModels.updateAuctionStatus(auctionId, status, (err) => {
    if (err) return res.status(500).json({ message: "Database error.", error: err });

    res.status(200).json({ message: "Auction status updated." });
  });
};

// Delete auction
const deleteAuction = (req, res) => {
  const { auctionId } = req.params;

  auctionModels.deleteAuction(auctionId, (err) => {
    if (err) return res.status(500).json({ message: "Database error.", error: err });

    res.status(200).json({ message: "Auction deleted successfully." });
  });
};

module.exports = {
  createAuction,
  getAllAuctions,
  getAuctionById,
  updateAuctionStatus,
  deleteAuction,
};
